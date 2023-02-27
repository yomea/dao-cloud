# 项目介绍
DaoCloud通过SpringBoot构建基于netty开发轻量级的微服务框架.麻雀虽小,五脏俱全;
本项目追求轻量、易接入、自定义协议、高可用、高性能、高扩展、易上手等特性;
致力于简化应用程序之间的RPC调用，并为应用程序提供方便、无代码入侵、稳定和高效的点对点远程微服务调用解决方案。对于开发人员来说,dao-cloud的提供了丰富的模型抽象和可扩展接口,为求一站式解决微服务带来的系统架构复杂度,包括路由、负载平衡、故障转移、性能监控、微服务治理等;

# 系统架构
![dao-cloud](https://user-images.githubusercontent.com/27397567/216245222-ffa99ab7-097a-4ba6-a5b4-7637da06b37f.jpg)

# 项目结构
    dao-cloud-core = 核心
    dao-cloud-center = 注册+配置-中心
    dao-cloud-gateway = 网关
    dao-cloud-spring-boot-starter = rpc的依赖的jar
    dao-cloud-monitor = 监控性能
    dao-cloud-example = 使用示例

# dao-协议
    +---------+---------+--------------+----------------+----------------+----------------+
    |  magic  | version | message type | serialize type |   data length  |  data content  |
    | 3(byte) | 1(byte) |    1(byte)   |     1(byte)    |     4(byte)    |       ~~       |
    +---------+---------+--------------+----------------+----------------+----------------+
    version: 暂时没用到
    serialize type 支持: jdk(DTO请实现序列化接口)、json、hessian(推荐默认)
todo 自定义协议(通过版本来让用户自定义一个协议来通信),这是该项目的看点

# 快速开始
无需任何配置(追求轻量).所有功能组件都是通过SpringBoot自动装配一键化启动(引入启动依赖jar包)

    <dependency>
        <groupId>org.junmo</groupId>
        <artifactId>dao-cloud-spring-boot-starter</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

rpc注解用法说明(其实用法与dubbo、spring-cloud、sofa这些差不多一致)
    
    每个provider一定要设置自己的proxy名字! 确定唯一接口: proxy+provider+version
    @DaoService = 用于服务注册    provider:暴露服务的provider名称, version:发布版本, serialize:序列化选择
    @DaoReference = 用于服务注入  provider:暴露服务的provider名称, version:发布版本, serialize:序列化选择, loadbanalce:负载路由选择, timeout:超时时间

注册｜配置中心(引入dao-cloud-center的pom依赖jar包)

    <dependency>
        <groupId>org.junmo</groupId>
        <artifactId>dao-cloud-center</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
    通过注解EnableDaoCloudCenter标注在一个SpringBoot工程的启动类上,告诉这是dao-cloud的center(todo 页面)
    
    查看服务注册情况
        http://127.0.0.1:5555/dao-cloud/register/server ==== 查看所有服务信息
        http://127.0.0.1:5555/dao-cloud/register/proxy?proxy=demo&version=0 ==== 查看服务列表详情
    
    配置中心管理
        http://127.0.0.1:5555/dao-cloud/config/save ==== 更新配置信息
        http://127.0.0.1:5555/dao-cloud/config/query ==== 获取配置信息
    DaoConfig这个类提供了服务对配置信息的获取、订阅
        DaoConfig.getConf  ==== 获取配置
        DaoConfig.subscribe  ==== 订阅配置,在监听到订阅的配置发生变化时,做某些事(回调)
        注意: 此外你在配置中心更改配置后,配置中心会自动刷新到服务上

项目(dao-cloud-example)中有一个示例

    0.把公共的接口请放在api-common中,就是你要暴露出去的函数方法
    1.先启动web工程(通过@EnableDaoCloudCenter注解搞定注册中心)
    2.然后就是provider与consumer,项目中提供了工程(dao-cloud-example)来示例使用
    先启动provider,再启动consumer(其实启反也可以)
    3.验证! http://127.0.0.1:19998/dao-cloud-example-consumer/demo
    还有其他test-demo也放在改工程中

**本项目是由作者利用平时自由时间创建或迭代,所有的微服务异常情况没办法测试全,未在真实项目上实践过! 请酌情考虑使用,出事故拒不负责(^_^)! 有问题请提issues;**
    
        



   
    
    
    
