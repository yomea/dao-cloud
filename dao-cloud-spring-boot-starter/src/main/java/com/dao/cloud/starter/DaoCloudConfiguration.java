package com.dao.cloud.starter;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.Appender;
import com.dao.cloud.core.converter.StringToCharConverter;
import com.dao.cloud.core.resolver.MethodArgumentResolver;
import com.dao.cloud.core.resolver.MethodArgumentResolverHandler;
import com.dao.cloud.core.util.NetUtil;
import com.dao.cloud.starter.bootstrap.DaoCloudCustomInterceptor;
import com.dao.cloud.starter.context.DaoCloudLogAppender;
import com.dao.cloud.starter.properties.DaoCloudCenterProperties;
import com.dao.cloud.starter.properties.DaoCloudServerProperties;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.web.format.DateTimeFormatters;
import org.springframework.boot.autoconfigure.web.format.WebConversionService;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.convert.ConversionService;
import org.springframework.core.convert.support.ConfigurableConversionService;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;


/**
 * @author: sucf
 * @date: 2022/10/28 20:29
 * @description: dao-cloud SpringBoot Auto Configuration
 */
@Configuration
@EnableConfigurationProperties({DaoCloudServerProperties.class})
@ConditionalOnProperty(prefix = "dao-cloud", name = "enable", havingValue = "true")
@ComponentScan("com.dao.cloud.starter.bootstrap")
@Import({DaoCloudServerProperties.class, DaoCloudCenterProperties.class})
public class DaoCloudConfiguration implements WebMvcConfigurer {

    private DaoCloudCustomInterceptor daoCloudCustomInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(daoCloudCustomInterceptor).addPathPatterns("/**");
    }

    public DaoCloudConfiguration(DaoCloudCustomInterceptor daoCloudCustomInterceptor) {
        this.daoCloudCustomInterceptor = daoCloudCustomInterceptor;
    }

    @Bean
    public Appender<ILoggingEvent> daoCloudLogAppender() {
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();

        if (loggerContext.getLogger("ROOT").getAppender("Console") != null) {
            return null;
        }
        DaoCloudLogAppender daoCloudLogAppender = new DaoCloudLogAppender(NetUtil.getLocalIp());
        daoCloudLogAppender.setContext(loggerContext);
        daoCloudLogAppender.start();

        ch.qos.logback.classic.Logger rootLogger = loggerContext.getLogger("ROOT");
        rootLogger.addAppender(daoCloudLogAppender);
        return daoCloudLogAppender;
    }

    @Bean
    public ConversionService customerConversionService() {
        DateTimeFormatters dateTimeFormatters = new DateTimeFormatters()
                .dateTimeFormat("yyyy-MM-dd HH:mm:ss")
                .dateFormat("yyyy-MM-dd")
                .timeFormat("HH:mm:ss");
        dateTimeFormatters.dateFormat("yyyy-MM-dd");
        ConfigurableConversionService conversionService = new WebConversionService(dateTimeFormatters);
        conversionService.addConverter(new StringToCharConverter());
        return conversionService;
    }

    @Bean
    public MethodArgumentResolverHandler methodArgumentResolverHandler(@Autowired(required = false) ConversionService customerConversionService,
                                                                       @Autowired(required = false) List<MethodArgumentResolver> resolverList) {
        // conversionService 可自定义
        MethodArgumentResolverHandler resolverHandler = new MethodArgumentResolverHandler(customerConversionService);
//        如果当前满足不了你的参数解析需求，可以自己扩展，然后可以自己加排序
        resolverHandler.addCustomerResolvers(resolverList);
        return resolverHandler;
    }
}
