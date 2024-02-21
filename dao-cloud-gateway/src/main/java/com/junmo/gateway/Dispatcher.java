package com.junmo.gateway;

import com.google.common.collect.Lists;
import com.junmo.boot.banlance.DaoLoadBalance;
import com.junmo.boot.bootstrap.manager.ClientManager;
import com.junmo.boot.bootstrap.unit.ClientInvoker;
import com.junmo.core.enums.CodeEnum;
import com.junmo.core.enums.Serializer;
import com.junmo.core.exception.DaoException;
import com.junmo.core.model.*;
import com.junmo.core.util.HttpGenericInvokeUtils;
import com.junmo.gateway.auth.Interceptor;
import com.junmo.gateway.global.GatewayServiceConfig;
import com.junmo.gateway.limit.Limiter;
import java.io.IOException;
import java.io.OutputStream;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * @author: sucf
 * @date: 2023/12/28 14:55
 * @description: 转发分发处理器
 */
@RestController
@Slf4j
public class Dispatcher {

    private Limiter limiter;

    private DaoLoadBalance daoLoadBalance;

    public Dispatcher(Limiter limiter, DaoLoadBalance daoLoadBalance) {
        this.limiter = limiter;
        this.daoLoadBalance = daoLoadBalance;
    }

    /**
     * 网关请求主入口(get)
     *
     * @param proxy
     * @param provider
     * @param version
     * @param request
     * @param response
     */
    @RequestMapping(value = "api/{proxy}/{provider}/{version}/{method}", method = RequestMethod.GET)
    public void goGet(@PathVariable String proxy, @PathVariable String provider, @PathVariable() String version,
                      @PathVariable String method, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        if (!StringUtils.hasLength(proxy) || !StringUtils.hasLength(provider) || !StringUtils.hasLength(method)) {
            throw new DaoException(CodeEnum.GATEWAY_REQUEST_PARAM_DELETION.getCode(), CodeEnum.GATEWAY_REQUEST_PARAM_DELETION.getText());
        }
        HttpServletRequestModel requestModel = HttpGenericInvokeUtils.buildRequest(request);
        GatewayRequestModel gatewayRequestModel = new GatewayRequestModel(provider, Byte.valueOf(version), method, requestModel);
        this.doService(proxy, gatewayRequestModel, response);
    }

    /**
     * 网关请求主入口(post)
     *
     * @param proxy
     * @param provider
     * @param version
     * @param request
     * @param response
     */
    @RequestMapping(value = "api/{proxy}/{provider}/{version}/{method}", method = RequestMethod.POST)
    public void goPost(@PathVariable String proxy, @PathVariable String provider, @PathVariable() String version,
                       @PathVariable String method, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        if (!StringUtils.hasLength(proxy) || !StringUtils.hasLength(provider) || !StringUtils.hasLength(version) || !StringUtils.hasLength(method)) {
            throw new DaoException(CodeEnum.GATEWAY_REQUEST_PARAM_DELETION.getCode(), CodeEnum.GATEWAY_REQUEST_PARAM_DELETION.getText());
        }
        HttpServletRequestModel requestModel = HttpGenericInvokeUtils.buildRequest(request);
        GatewayRequestModel gatewayRequestModel = new GatewayRequestModel(provider, Byte.valueOf(version), method, requestModel);
        this.doService(proxy, gatewayRequestModel, response);

    }

    public void doService(String proxy, GatewayRequestModel gatewayRequestModel, HttpServletResponse response) {
        // 先判断限流
        if (!limiter.allow()) {
            throw new DaoException(CodeEnum.GATEWAY_REQUEST_LIMIT.getCode(), CodeEnum.GATEWAY_REQUEST_LIMIT.getText());
        }

        // 处理拦截器的责任链请求
        List<Interceptor> interceptors = Lists.newArrayList();
        for (Interceptor interceptor : interceptors) {
            if (!interceptor.action()) {
                return;
            }
        }

        // 发起转发路由请求
        byte serializable = Serializer.HESSIAN.getType();
        ProxyProviderModel proxyProviderModel = new ProxyProviderModel(proxy, gatewayRequestModel.getProvider(), gatewayRequestModel.getVersion());
        Set<ServerNodeModel> providerNodes = ClientManager.getProviderNodes(proxyProviderModel);
        if (providerNodes == null) {
            throw new DaoException(CodeEnum.GATEWAY_SERVICE_NOT_EXIST.getCode(), CodeEnum.GATEWAY_SERVICE_NOT_EXIST.getText());

        }
        GatewayConfigModel gatewayConfig = GatewayServiceConfig.getGatewayConfig(proxyProviderModel);
        // gateway timout config
        Long timeout;
        if (gatewayConfig == null) {
            // default timeout 30s
            timeout = 30L;
        } else {
            timeout = gatewayConfig.getTimeout();
            // default timeout 10s
            if (timeout == null || timeout <= 0) {
                timeout = 30L;
            }
        }
        ClientInvoker clientInvoker = new ClientInvoker(proxyProviderModel, daoLoadBalance, serializable, timeout);
        com.junmo.core.model.HttpServletResponse result;
        try (OutputStream outputStream = response.getOutputStream()){
            result = (com.junmo.core.model.HttpServletResponse) clientInvoker.invoke(gatewayRequestModel);
            Optional.ofNullable(result.getHeads()).orElse(Collections.emptyMap())
                    .forEach(response::addHeader);
            outputStream.write(result.getBodyData());
        } catch (InterruptedException e) {
            throw new DaoException(CodeEnum.GATEWAY_REQUEST_ERROR.getCode(), CodeEnum.GATEWAY_REQUEST_ERROR.getText());

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
