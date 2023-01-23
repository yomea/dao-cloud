package com.junmo.boot.banlance;

import com.junmo.boot.channel.ChannelClient;
import io.netty.channel.Channel;

import java.util.Set;

/**
 * @author: sucf
 * @date: 2023/1/11 22:36
 * @description:
 */
public abstract class DaoLoadBalance {

//    public Set<ChannelClient> available(Set<ChannelClient> channelClients) {
//        return CollectionUtil.removeNull(channelClients);
//    }

    /**
     * route channel
     *
     * @param availableChannelClients
     * @return
     */
    public abstract Channel route(Set<ChannelClient> availableChannelClients);
}
