package com.dao.cloud.center.core.handler;

import com.dao.cloud.center.core.RegisterCenterManager;
import com.dao.cloud.core.model.CallTrendModel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import lombok.extern.slf4j.Slf4j;

/**
 * @author: sucf
 * @date: 2024/7/14 16:23
 * @description: Receive call trend handler
 */
@Slf4j
public class ReceiveCallTrendHandler extends SimpleChannelInboundHandler<CallTrendModel> {

    private final RegisterCenterManager registerCenterManager;

    public ReceiveCallTrendHandler(RegisterCenterManager registerCenterManager) {
        this.registerCenterManager = registerCenterManager;
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, CallTrendModel model) throws Exception {
        registerCenterManager.callTrendIncrement(model);
    }
}
