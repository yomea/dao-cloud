$(function () {
    var dataTable = $("#data_list").dataTable({
        "paging": true,
        "deferRender": true, "processing": true, "serverSide": false, "ajax": {
            url: base_url + "/registry/pageList", type: "post", data: function (d) {
                var obj = {};
                obj.start = d.start;
                obj.length = d.length;
                obj.proxy = $('#proxy').val();
                obj.provider = $('#provider').val();
                obj.version = $('#version').val();
                return obj;
            }
        }, "searching": false, "ordering": false,
        "columns": [{data: 'proxy'}, {data: 'provider'}, {data: 'version'}, {
            data: 'number', ordering: true, render: function (data, type, row) {
                if (data != 0) {
                    return '<a href="javascript:;" class="showData" proxy="' + row.proxy + '" provider="' + row.provider + '" version="' + row.version + '">' + data + '</a>';
                } else {
                    return '0';
                }
            }
        }, {
            data: 'call', ordering: true, render: function (data, type, row) {
                return '<a href="javascript:;" class="showCallTrend" proxy="' + row.proxy + '" provider="' + row.provider + '" version="' + row.version + '">' + '方法函数计数' + '</a>';
            }
        }, {
            data: 'gateway', ordering: true, render: function (data, type, row) {
                // 网关就直接跳过
                if (row.proxy == "dao-cloud-gateway" && row.provider == "gateway") {
                    return '';
                }

                if (row.gateway == null) {
                    return '<a href="javascript:;" class="openGatewayConfigModelWindow" proxy="' + row.proxy + '" provider="' + row.provider + '" version="' + row.version + '">设置</a>'
                }

                var slideDateWindowSize = row.gateway.limitModel.slideDateWindowSize;
                var slideWindowMaxRequestCount = row.gateway.limitModel.slideWindowMaxRequestCount;
                var tokenBucketMaxSize = row.gateway.limitModel.tokenBucketMaxSize;
                var tokenBucketRefillRate = row.gateway.limitModel.tokenBucketRefillRate;
                var leakyBucketCapacity = row.gateway.limitModel.leakyBucketCapacity;
                var leakyBucketRefillRate = row.gateway.limitModel.leakyBucketRefillRate;
                var timeout = row.gateway.timeout;
                var limit_div = '';
                var limitAlgorithm_div = '';
                if (row.gateway.limitModel != null && row.gateway.limitModel.limitAlgorithm != null) {
                    var limitAlgorithm, c1, c2, a1, a2;
                    if (row.gateway.limitModel.limitAlgorithm == 1) {
                        limitAlgorithm = '计数'
                        c1 = slideDateWindowSize;
                        c2 = slideWindowMaxRequestCount;
                        a1 = "滑动时间窗口(单位是毫秒)";
                        a2 = "滑动窗口内的最大请求数";
                    } else if (row.gateway.limitModel.limitAlgorithm == 2) {
                        limitAlgorithm = '令牌'
                        c1 = tokenBucketMaxSize;
                        c2 = tokenBucketRefillRate;
                        a1 = "最大令牌数";
                        a2 = "每秒新增令牌数";
                    } else if (row.gateway.limitModel.limitAlgorithm == 3) {
                        limitAlgorithm = '漏桶'
                        c1 = leakyBucketCapacity;
                        c2 = leakyBucketRefillRate;
                        a1 = "漏桶的容量";
                        a2 = "每秒令牌填充的速度";
                    }
                    limit_div = limitAlgorithm + ':&nbsp;' +
                        '<span style="cursor: pointer;" title="' + a1 + '">(' + c1 + ')</span>&nbsp;&nbsp;' +
                        '<span style="cursor: pointer;" title="' + a2 + '">(' + c2 + ')</span>&nbsp;&nbsp;';
                    limitAlgorithm_div = '" limitAlgorithm="' + row.gateway.limitModel.limitAlgorithm;
                }

                // timeout
                var timeout_div = '';
                if (timeout != null) {
                    timeout_div = '调用超时时间:&nbsp;(' + timeout + ')</span>&nbsp;&nbsp;&nbsp;&nbsp;';
                }

                // Assignment parameters attributes
                const time_attribute = null;
                if (timeout == null) {
                    time_attributes = '<a href="javascript:;" class="openGatewayConfigModelWindow" proxy="' + row.proxy + '" provider="' + row.provider + '" version="' + row.version + limitAlgorithm_div + '" slideDateWindowSize="' + slideDateWindowSize + '"+ slideWindowMaxRequestCount="' + slideWindowMaxRequestCount + '" tokenBucketMaxSize="' + tokenBucketMaxSize + '" tokenBucketRefillRate="' + tokenBucketRefillRate + '" leakyBucketCapacity="' + leakyBucketCapacity + '" leakyBucketRefillRate="' + leakyBucketRefillRate + '">设置</a>&nbsp;&nbsp;';
                } else {
                    time_attributes = '<a href="javascript:;" class="openGatewayConfigModelWindow" proxy="' + row.proxy + '" provider="' + row.provider + '" version="' + row.version + limitAlgorithm_div + '" slideDateWindowSize="' + slideDateWindowSize + '"+ slideWindowMaxRequestCount="' + slideWindowMaxRequestCount + '" tokenBucketMaxSize="' + tokenBucketMaxSize + '" tokenBucketRefillRate="' + tokenBucketRefillRate + '" leakyBucketCapacity="' + leakyBucketCapacity + '" leakyBucketRefillRate="' + leakyBucketRefillRate + '" timeout="' + timeout + '">设置</a>&nbsp;&nbsp;';
                }

                return '<div>' +
                    limit_div +
                    timeout_div +
                    time_attributes +
                    '<a href="javascript:;" class="clear" proxy="' + row.proxy + '" provider="' + row.provider + '" version="' + row.version + '">清空</a>' +
                    '</div>';
            }
        }], "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "每页 _MENU_ 条记录",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 ) 总记录数 _MAX_ ",
            "sInfoEmpty": "无记录",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页", "sPrevious": "上页", "sNext": "下页", "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列", "sSortDescending": ": 以降序排列此列"
            }
        }
    });

    $("#data_list").on('click', '.openGatewayConfigModelWindow', function () {
        var proxy = $(this).attr("proxy");
        var provider = $(this).attr("provider");
        var version = $(this).attr("version");
        var slideDateWindowSize = $(this).attr("slideDateWindowSize");
        var slideWindowMaxRequestCount = $(this).attr("slideWindowMaxRequestCount");
        var tokenBucketMaxSize = $(this).attr("tokenBucketMaxSize");
        var tokenBucketRefillRate = $(this).attr("tokenBucketRefillRate");
        var leakyBucketCapacity = $(this).attr("leakyBucketCapacity");
        var leakyBucketRefillRate = $(this).attr("leakyBucketRefillRate");
        var limitAlgorithm = $(this).attr("limitAlgorithm");
        var timeout = $(this).attr("timeout");
        $("#openGatewayConfigModelWindow .form input[name='proxy']").val(proxy);
        $("#openGatewayConfigModelWindow .form input[name='provider']").val(provider);
        $("#openGatewayConfigModelWindow .form input[name='version']").val(version);
        $("#countLimitOptions").hide();
        $("#tokenLimitOptions").hide();
        $("#leakyLimitOptions").hide();
        if (limitAlgorithm != null) {
            // update
            switch (limitAlgorithm) {
                case '1': // 计数算法
                    $("#countLimitOptions").show();
                    break;
                case '2': // 令牌算法
                    $("#tokenLimitOptions").show();
                    break;
                case '3': // 漏桶
                    $("#leakyLimitOptions").show();
                    break;
                default:
            }
            $("#openGatewayConfigModelWindow .form select[name='limitAlgorithm']").val(limitAlgorithm);
            $("#openGatewayConfigModelWindow .form input[name='slideDateWindowSize']").val(slideDateWindowSize);
            $("#openGatewayConfigModelWindow .form input[name='slideWindowMaxRequestCount']").val(slideWindowMaxRequestCount);
            $("#openGatewayConfigModelWindow .form input[name='tokenBucketMaxSize']").val(tokenBucketMaxSize);
            $("#openGatewayConfigModelWindow .form input[name='tokenBucketRefillRate']").val(tokenBucketRefillRate);
            $("#openGatewayConfigModelWindow .form input[name='leakyBucketCapacity']").val(leakyBucketCapacity);
            $("#openGatewayConfigModelWindow .form input[name='leakyBucketRefillRate']").val(leakyBucketRefillRate);
        }
        $("#openGatewayConfigModelWindow .form input[name='timeout']").val(timeout);
        $('#openGatewayConfigModelWindow').modal({backdrop: false, keyboard: false}).modal('show');
    });

    $("#openGatewayConfigModelWindow").on('hide.bs.modal', function () {
        $("#openGatewayConfigModelWindow .form")[0].reset();
        openGatewayConfigModelWindowValidate.resetForm();
        $("#openGatewayConfigModelWindow .form .form-group").removeClass("has-error");
    });


    var openGatewayConfigModelWindowValidate = $("#openGatewayConfigModelWindow .form").validate({
        errorElement: 'span',
        errorClass: 'help-block',
        focusInvalid: true,
        rules: {},
        messages: {},
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success: function (label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement: function (error, element) {
            element.parent('div').append(error);
        },
        submitHandler: function (form) {
            // 创建formData对象
            var formData = {
                proxy: $(form).find('input[name="proxy"]').val(),
                provider: $(form).find('input[name="provider"]').val(),
                version: $(form).find('input[name="version"]').val(),
                timeout: $(form).find('input[name="timeout"]').val(),
                limit: {
                    limitAlgorithm: $(form).find('#limitAlgorithm').val(),
                    slideDateWindowSize: $(form).find('input[name="slideDateWindowSize"]').val(),
                    slideWindowMaxRequestCount: $(form).find('input[name="slideWindowMaxRequestCount"]').val(),
                    tokenBucketMaxSize: $(form).find('input[name="tokenBucketMaxSize"]').val(),
                    tokenBucketRefillRate: $(form).find('input[name="tokenBucketRefillRate"]').val(),
                    leakyBucketCapacity: $(form).find('input[name="leakyBucketCapacity"]').val(),
                    leakyBucketRefillRate: $(form).find('input[name="leakyBucketRefillRate"]').val()
                }
            };

            // 发送AJAX请求
            $.ajax({
                type: 'POST',
                url: base_url + "/gateway/save",
                contentType: 'application/json', // 指定发送数据的格式为JSON
                data: JSON.stringify(formData), // 将JS对象转换为JSON字符串
                dataType: 'json', // 预期服务器返回的数据类型
                success: function (data) {
                    if (data.code == "00000") {
                        $('#openGatewayConfigModelWindow').modal('hide');
                        layer.open({
                            title: "系统提示",
                            btn: ["确认"],
                            content: "网关限流设置成功",
                            icon: '1',
                            end: function (layero, index) {
                                dataTable.api().ajax.reload();
                            }
                        });
                    } else {
                        layer.open({
                            title: "系统提示",
                            btn: ["确认"],
                            content: (data.msg || "网关限流设置失败"),
                            icon: '2'
                        });
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    layer.open({
                        title: "系统提示",
                        btn: ["确认"],
                        content: (data.msg || "网关限流设置失败"),
                        icon: '2'
                    });
                }
            });
        }
    });

    $("#data_list").on('click', '.clear', function () {
        var proxy = $(this).attr("proxy");
        var provider = $(this).attr("provider");
        var version = $(this).attr("version");
        layer.confirm("确认清空该设置?", {
            icon: 3,
            title: "系统提示",
            btn: ["确认", "取消"]
        }, function (index) {
            layer.close(index);

            $.ajax({
                type: 'POST',
                url: base_url + "/gateway/clear",
                data: {
                    "proxy": proxy,
                    "provider": provider,
                    "version": version
                },
                dataType: "json",
                success: function (data) {
                    if (data.code == "00000") {
                        layer.open({
                            title: "系统提示",
                            btn: ["确认"],
                            content: "清空成功",
                            icon: '1',
                            end: function (layero, index) {
                                dataTable.api().ajax.reload();
                            }
                        });
                    } else {
                        layer.open({
                            title: "系统提示",
                            btn: ["确认"],
                            content: (data.msg || "清空失败"),
                            icon: '2'
                        });
                    }
                }
            });
        });
    });

    /**
     * 服务上下线请求
     */
    $("#popup-list").on('click', '.on_off', function () {
        var proxy = $(this).attr("proxy");
        var provider = $(this).attr("provider");
        var version = $(this).attr("version");
        var ip = $(this).attr("ip");
        var port = $(this).attr("port");
        // true表示要上线, false表示要下线
        var status = $(this).attr("status");
        const text = status == 'true' || status == true ? "上线" : "下线";
        layer.confirm("确认" + text + "此机器?", {
            icon: 3,
            title: "系统提示",
            btn: ["确认", "取消"]
        }, function (index) {
            layer.close(index);

            $.ajax({
                type: 'POST',
                url: base_url + "/registry/on_off",
                data: {
                    "proxy": proxy,
                    "provider": provider,
                    "version": version,
                    "ip": ip,
                    "port": port,
                    "status": status
                },
                dataType: "json",
                success: function (data) {
                    if (data.code == "00000") {
                        layer.open({
                            title: "系统提示",
                            btn: ["确认"],
                            content: text + "成功",
                            icon: '1',
                            end: function (layero, index) {
                                reload(proxy, provider, version);
                            }
                        });
                    } else {
                        layer.open({
                            title: "系统提示",
                            btn: ["确认"],
                            content: (data.msg || text + "失败"),
                            icon: '2'
                        });
                    }
                }
            });
        });
    });

    $("#call-popup-list").on('click', '.clear_click', function () {
        var proxy = $(this).attr("proxy");
        var provider = $(this).attr("provider");
        var version = $(this).attr("version");
        var methodName = $(this).attr("methodName");
        var formData = {
            proxy: proxy,
            provider: provider,
            version: version,
            methodName: methodName
        }
        $.ajax({
            type: 'POST',
            url: base_url + "/call_trend/clear",
            contentType: 'application/json',
            data: JSON.stringify(formData),
            dataType: 'json',
            success: function (data) {
                if (data.code == "00000") {
                    layer.open({
                        title: "系统提示",
                        btn: ["确认"],
                        content: "清空成功",
                        icon: '1',
                        end: function (layero, index) {
                            reloadCallTrend(proxy, provider, version);
                        }
                    });
                } else {
                    layer.open({
                        title: "系统提示",
                        btn: ["确认"],
                        content: (data.msg || "清空失败"),
                        icon: '2'
                    });
                }
            }
        });
    });

    function reloadCallTrend(proxy, provider, version) {
        $.ajax({
            url: base_url + "/call_trend/statistics?proxy=" + proxy + "&provider=" + provider + "&version=" + version,
            method: "GET",
            dataType: "json",
            success: function (response) {
                var tableHtml = call_trend_load_page_html(proxy, provider, version, response.data);
                $('#call-popup-list tbody').html(tableHtml);
            }
        });
    }

    function reload(proxy, provider, version) {
        $.ajax({
            url: base_url + "/registry/server?proxy=" + proxy + "&provider=" + provider + "&version=" + version,
            method: "GET",
            dataType: "json",
            success: function (response) {
                var tableHtml = load_page_html(response.data, proxy, provider, version);
                $('#popup-list tbody').html(tableHtml);
            }
        });
    }

    function call_trend_load_page_html(proxy, provider, version, methods) {
        var tableHtml = "";
        methods.forEach(function (item, index) {
            var methodName = item.methodName;
            var regex = /(.*?)(\((.*)\))/;
            var match = methodName.match(regex);
            if (match) {
                var methodNameWithoutParams = match[1];
                var params = match[3];
                var paramParts = params.split(',');
                var formattedParams = paramParts.map(function (param) {
                    var parts = param.split('.');
                    return parts.map(function (part, i) {
                        if (i === parts.length - 1) {
                            return part;
                        } else {
                            return part.charAt(0);
                        }
                    }).join('.');
                }).join(',');
                methodName = methodNameWithoutParams + '(' + formattedParams + ')';
            }
            tableHtml += '<tr>' +
                '<td>' + methodName + '</td>' +
                '<td style="text-align: center;">' + item.count + '</td>' +
                '<td style="text-align: center;"><a href="javascript:;" class="clear_click" proxy="' + proxy + '" provider="' + provider + '" version="' + version + '" methodName="' + item.methodName + '">clear</a></td>' +
                '</tr>';
        });
        return tableHtml;
    }

    function load_page_html(service_data_list, proxy, provider, version) {
        var tableHtml = "";
        service_data_list.forEach(function (item, index) {
            var statusText = item.status ? "下线" : "上线";
            var statusAction = item.status ? false : true;
            var statusImage = item.status ? "../right.png" : "../wrong.png";

            var operationHtml = '<a href="javascript:;" class="on_off" proxy="' + proxy +
                '" provider="' + provider + '" version="' + version + '" ip="' + item.ip +
                '" port="' + item.port + '" status="' + statusAction + '">' + statusText + '</a>';

            var cpuHtml = item.performance ? 'cpu=' + item.performance.cpu : '-';
            var memoryHtml = item.performance ? 'memory=' + item.performance.memory : '-';
            var ioHtml = item.performance ? 'io=' + item.performance.io : '-';

            tableHtml += '<tr>' +
                '<td rowspan="3" style="vertical-align: middle;">' +
                '<img src="' + statusImage + '" style="height:16px; width:16px; margin-right: 5px;" />' + item.ip +
                '</td>' +
                '<td rowspan="3" style="vertical-align: middle;">' + item.port + '</td>' +
                '<td>' + cpuHtml + '</td>' +
                '<td rowspan="3" style="vertical-align: middle;">' + operationHtml + '</td>' +
                '</tr>';

            tableHtml += '<tr><td>' + memoryHtml + '</td></tr>';
            tableHtml += '<tr><td>' + ioHtml + '</td></tr>';
        });
        return tableHtml;
    }

    $("#data_list").on('click', '.showData', function () {
        var proxy = $(this).attr("proxy");
        var provider = $(this).attr("provider");
        var version = $(this).attr("version");

        function refreshServerList() {
            $.ajax({
                url: base_url + "/registry/server?proxy=" + proxy + "&provider=" + provider + "&version=" + version,
                method: "GET",
                dataType: "json",
                success: function (response) {
                    var tableHtml = load_page_html(response.data, proxy, provider, version);
                    $('#popup-list tbody').html(tableHtml);
                },
                error: function () {
                    // 处理请求失败的情况
                }
            });
        }

        // 打开弹出窗口并首次加载数据
        $.ajax({
            url: base_url + "/registry/server?proxy=" + proxy + "&provider=" + provider + "&version=" + version,
            method: "GET",
            dataType: "json",
            success: function (response) {
                var tableHtml = load_page_html(response.data, proxy, provider, version);
                var refreshInterval;
                layer.open({
                    type: 1,
                    title: '注册服务节点列表',
                    content: $('#popup'),
                    area: ['700px', '700px'],
                    btn: ['关闭'],
                    btnAlign: 'c',
                    success: function (layero, index) {
                        $('#popup-list tbody').html(tableHtml);

                        // 设置定时器每3秒刷新一次数据
                        refreshInterval = setInterval(refreshServerList, 3000);

                        // 在弹出窗口关闭时清除定时器
                        layero.find('.layui-layer-btn0').on('click', function () {
                            clearInterval(refreshInterval);
                            layer.close(index);
                        });

                        // 监听右上角关闭按钮
                        layero.find('.layui-layer-close').on('click', function () {
                            clearInterval(refreshInterval);
                            layer.close(index);
                        });

                        // 确保所有关闭操作清除定时器
                        $(document).on('click', '.layui-layer-close1', function () {
                            clearInterval(refreshInterval);
                        });
                    },
                    cancel: function () {
                        clearInterval(refreshInterval);
                    }
                });
            },
            error: function () {
                // 处理请求失败的情况
            }
        });
    });

    $("#data_list").on('click', '.showCallTrend', function () {
        var proxy = $(this).attr("proxy");
        var provider = $(this).attr("provider");
        var version = $(this).attr("version");

        function refreshCallTrendList() {
            $.ajax({
                url: base_url + "/call_trend/statistics?proxy=" + proxy + "&provider=" + provider + "&version=" + version,
                method: "GET",
                dataType: "json",
                success: function (response) {
                    var tableHtml = call_trend_load_page_html(proxy, provider, version, response);
                    $('#call-popup-list tbody').html(tableHtml);
                },
                error: function () {
                    // 处理请求失败的情况
                }
            });
        }

        $.ajax({
            url: base_url + "/call_trend/statistics?proxy=" + proxy + "&provider=" + provider + "&version=" + version,
            method: "GET",
            dataType: "json",
            success: function (response) {
                var tableHtml = call_trend_load_page_html(proxy, provider, version, response);
                var refreshInterval;
                layer.open({
                    type: 1,
                    title: '[' + proxy + ']' + '[' + provider + ']' + '[' + version + ']' + ' - 方法函数列表',
                    content: $('#call-popup'),
                    area: ['550px', '700px'],
                    btn: ['清空所有', '关闭'],
                    btnAlign: 'c',
                    yes: function (index, layero) {
                        layer.confirm("确认清空所有调用统计数据?", {
                            icon: 3,
                            title: "系统提示",
                            btn: ["确认", "取消"]
                        }, function (index) {
                            layer.close(index);
                            var data = {
                                proxy: proxy,
                                provider: provider,
                                version: version
                            }
                            $.ajax({
                                type: 'POST',
                                url: base_url + "/call_trend/clear",
                                contentType: 'application/json',
                                data: JSON.stringify(data),
                                dataType: 'json',
                                success: function (response) {
                                    layer.open({
                                        title: "系统提示",
                                        btn: ["确认"],
                                        content: "清空成功",
                                        icon: '1',
                                        end: function (layero, index) {
                                            reloadCallTrend(proxy, provider, version);
                                        }
                                    });
                                },
                                error: function () {
                                    layer.open({
                                        title: "系统提示",
                                        btn: ["确认"],
                                        content: (data.msg || "清空失败"),
                                        icon: '2'
                                    });
                                }
                            });
                        });
                    },
                    btn2: function (index, layero) {
                        clearInterval(refreshInterval);
                        layer.close(index);
                    },
                    success: function (layero, index) {
                        $('#call-popup-list tbody').html(tableHtml);
                        refreshInterval = setInterval(refreshCallTrendList, 3000);

                        // 监听右上角关闭按钮
                        layero.find('.layui-layer-close').on('click', function () {
                            clearInterval(refreshInterval);
                            layer.close(index);
                        });

                        // 确保所有关闭操作清除定时器
                        $(document).on('click', '.layui-layer-close1', function () {
                            clearInterval(refreshInterval);
                        });
                    },
                    cancel: function () {
                        clearInterval(refreshInterval);
                    },
                });
            },
            error: function () {
                alert("请求失败，请稍后重试。");
            }
        });
    });


    // search btn
    $('#searchBtn').on('click', function () {
        var proxyValue = $('#proxy').val();
        var providerValue = $('#provider').val();
        var versionValue = $('#version').val();
        dataTable.fnSettings().ajax.data = function (d) {
            d.proxy = proxyValue;
            d.provider = providerValue;
            d.version = versionValue;
        }
        dataTable.api().ajax.reload();
    });
})
;


// Com Alert by Tec theme
var ComAlertTec = {
    html: function () {
        var html = '<div class="modal fade" id="ComAlertTec" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' + '<div class="modal-dialog">' + '<div class="modal-content-tec">' + '<div class="modal-body"><div class="alert" style="color:#fff;"></div></div>' + '<div class="modal-footer">' + '<div class="text-center" >' + '<button type="button" class="btn btn-info ok" data-dismiss="modal" >确认</button>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
        return html;
    }, show: function (msg, callback) {
        // dom init
        if ($('#ComAlertTec').length == 0) {
            $('body').append(ComAlertTec.html());
        }

        // init com alert
        $('#ComAlertTec .alert').html(msg);
        $('#ComAlertTec').modal('show');

        $('#ComAlertTec .ok').click(function () {
            $('#ComAlertTec').modal('hide');
            if (typeof callback == 'function') {
                callback();
            }
        });
    }
};
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
