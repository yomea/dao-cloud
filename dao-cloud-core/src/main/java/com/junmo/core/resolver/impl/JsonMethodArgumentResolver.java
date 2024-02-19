package com.junmo.core.resolver.impl;

import cn.hutool.json.JSONUtil;
import com.junmo.core.exception.DaoException;
import com.junmo.core.model.HttpServletRequestModel;
import com.junmo.core.model.HttpServletResponse;
import com.junmo.core.resolver.MethodArgumentResolver;
import com.junmo.core.util.HttpGenericInvokeUtils;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaderValues;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Parameter;
import java.util.Objects;
import org.springframework.util.ClassUtils;

/**
 * @author wuzhenhong
 * @date 2024/2/8 14:34
 */
public class JsonMethodArgumentResolver implements MethodArgumentResolver {

    @Override
    public boolean support(Parameter parameter, HttpServletRequestModel httpServletRequest, HttpServletResponse httpServletResponse) {
        String contentType = httpServletRequest.getHeads().get(HttpHeaderNames.CONTENT_TYPE.toString());
        contentType = Objects.isNull(contentType) ? "" : contentType;
        String[] headerArr = HttpGenericInvokeUtils.splitHeaderContentType(contentType);
        Class<?> type = parameter.getType();
        byte[] bodyData = httpServletRequest.getBodyData();
        return !ClassUtils.isPrimitiveOrWrapper(type)
            && type != String.class
            && Objects.nonNull(headerArr) && headerArr.length > 0 && headerArr[0].equals(
            HttpHeaderValues.APPLICATION_JSON.toString())
            && bodyData != null && bodyData.length > 0;
    }

    @Override
    public Object resolver(Parameter parameter, HttpServletRequestModel httpServletRequest, HttpServletResponse httpServletResponse) {
        byte[] bodyData = httpServletRequest.getBodyData();
        try {
            String jsonData = new String(bodyData, "UTF-8");
            return JSONUtil.toBean(jsonData, parameter.getType());
        } catch (UnsupportedEncodingException e) {
            throw new DaoException("http请求体编码错误！", e);
        } catch (Exception e) {
            throw new DaoException("http请求体json解析错误！", e);
        }
    }
}
