function init() {
    console.log('init...')
    $.post('/bt/get_progress', '', function(result) {
        let progress = JSON.parse(result);
        if (!progress.data.migration_started) {
            selectProgress(1);
            $('.psync_info').show();
            $('.psync_path').hide();
            $('.psync_data').hide();
        } else {
            selectProgress(4);
            $('.psync_info').hide();
            $('.psync_path').hide();
            $('.psync_data').hide();
            $('.psync_migrate').html(getProgressHtml(progress.data.migration_started));
            $('.psync_migrate').show();
            $('.psync_migrate pre').text(progress.msg);
            let width = progress.data.progress+'%';
            $('.psync_migrate .progress_info_bar').width(width);
            $('.psync_migrate .progress_info').text(width);
            progressInterval();
        }
    });
    


    $('#sites_All').on('click',function(){ 
        var ch = $(this).prop('checked');
        $('#sites_li input').prop('checked',ch);
    });

    $('#db_All').on('click',function(){ 
        var ch = $(this).prop('checked');
        $('#db_li input').prop('checked',ch);
    });

    $('#ftps_All').on('click',function(){ 
        var ch = $(this).prop('checked');
        $('#ftps_li input').prop('checked',ch);
    });
}

function get_summary() {
    var domain_ip = $('input[name="domain_ip"]').val();
    var port = $('input[name="port"]').val();
    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();
    var form = `domain_ip=${domain_ip}&port=${port}&username=${username}&password=${password}`;
    var loadT = layer.msg("正在获取...", { icon: 16, time: 0, shade: 0.3 });
	$.post('/bt/get_summary', form, function(result) {
        layer.close(loadT);
        var info = JSON.parse(result);
        if (info['status'] == false) {
            layer.open({
                type: 1,
                area: "500px",
                title: "错误!",
                closeBtn: 1,
                content: "<p style='margin: 20px;'>"+info['msg']+"<p>"
            })
        } else {
            selectProgress(2);
            $('.psync_info').hide();
            var body = '<div class="divtable">\
                <table class="table table-hover">\
                <thead>\
                    <tr><th style="border-right:1px solid #ddd">服务</th><th>当前服务器</th><th>远程服务器</th></tr>\
                </thead>\
                <tbody>\
                    <tr>\
                        <td style="border-right:1px solid #ddd">网站服务</td>\
                        <td>'+info.data['local_summary']['webserver']+'</td>\
                        <td>'+info.data['remote_summary']['webserver']+'</td>\
                    </tr>\
                    <tr>\
                        <td style="border-right:1px solid #ddd">安装MySQL</td>\
                        <td>'+(info.data['local_summary']['ftps']?'是':'否')+'</td>\
                        <td>'+(info.data['remote_summary']['ftps']?'是':'否')+'</td>\
                    </tr>\
                    <tr>\
                        <td style="border-right:1px solid #ddd">安装PHP</td>\
                        <td>'+(info.data['local_summary']['php'].join('/'))+'</td>\
                        <td>'+(info.data['remote_summary']['php'].join('/')) +'</td>\
                    </tr>\
                    <tr>\
                        <td style="border-right:1px solid #ddd">安装pureftpd</td>\
                        <td>'+(info.data['local_summary']['mysql']?'是':'否')+'</td>\
                        <td>'+(info.data['remote_summary']['mysql']?'是':'否')+'</td>\
                    </tr>\
                </tbody>\
                </table>\
                </div>';
            body += '<div class="line mtb20" style="text-align: left;">\
                <button class="btn btn-default btn-sm mr20 pathTestting">重新检测</button>\
                <button class="btn btn-default btn-sm mr20 pathBcak">上一步</button>\
                <button class="btn btn-success btn-sm psync-next pathNext">下一步</button>\
            </div>';

            $('.psync_path').html(body);
            $('.psync_path').show();
            $('.psync_path').on('click', '.pathTestting', function () {
                get_summary();
            });

            $('.psync_path').on('click', '.pathBcak', function(){
                $('.psync_path').hide();
                $('.psync_info').show();
                selectProgress(1);
            });

            $('.psync_path').on('click', '.pathNext', function(){
                if (!info.data['is_matching']) {
                    layer.open({
                        type: 1,
                        area: "500px",
                        title: "环境不匹配!",
                        closeBtn: 1,
                        content: "<p style='margin: 20px;'>"+info.data['matching_msg']+"<p>"
                    })
                }
                else {
                    chooseData(info.data['remote_result'])
                }
            });
        }
    })
}

function chooseData(remoteData) {
    var site_li = '';
    var sites = remoteData.webserver.sites;
    for (var i = 0; i < sites.length; i++) {
        site_name = sites[i]['site_name'];
        site_li+='<li>\
            <label>\
                <input type="checkbox" data-id="'+i+'" id="sites_'+site_name+'" value="'+site_name+'" name="sites" checked="">\
                <span title="'+site_name+'">'+site_name+'</span>\
            </label>\
        </li>';
    }

    $('#sites_li').html(site_li);

    var db_li = '';
    for (var i = 0; i < remoteData.database.dbs.length; i++) {
        var db_name = remoteData.database.dbs[i]['name'];
        db_li+='<li>\
            <label>\
            <input type="checkbox" data-id="'+i+'" id="dbs_'+db_name+'" value="'+db_name+'" name="databases" checked="">\
            <span title="'+db_name+'">'+db_name+'</span>\
            </label>\
        </li>';
    }
    $('#db_li').html(db_li);

    var ftp_li = '';
    for (var i = 0; i < remoteData.ftp.ftps.length; i++) {
        var ftp_name = remoteData.ftp.ftps[i]['name'];
        ftp_li+='<li>\
            <label>\
            <input type="checkbox" data-id="'+i+'" id="ftps_'+ftp_name+'" value="'+ftp_name+'" name="ftps" checked="">\
            <span title="'+ftp_name+'">'+ftp_name+'</span>\
            </label>\
        </li>';
    }
    $('#ftps_li').html(ftp_li);

    $('.psync_path').hide();
    selectProgress(3);
    $('.psync_data').show();

    $('.psync_data').on('click', '.dataBack', function(){
        $('.psync_data').hide();
        $('.psync_path').show();
        selectProgress(2);
    });

    $('.psync_data').on('click', '.dataMigrate', function(){ 
        migrate(remoteData);
    });
}

function getProgressHtml(migration_started) {
    return `<div style="margin: 0 40px;">
        <div class="line">
            <div style="text-align:left"><span class="action">--</span>
            <span id="migration_status" style="margin-left: 20px;" class="done">${migration_started ? "当前 <img src='/static/img/ing.gif'>" : "结束"}--</span></div>
            <div class="bt-progress" style="border-radius:0;height:20px;line-height:19px">
                <div class="bt-progress-bar progress_info_bar" style="border-radius: 0px; height: 20px; width: 0%;">
                    <span class="bt-progress-text progress_info"></span></div>
                </div>
            </div>
        </div>
        <pre style="height: 222px;text-align: left;margin:5px 38px 0;font-size: 12px;line-height: 20px;padding: 10px;background-color: #333;color: #fff;"></pre>
    </div>`;
}

function migrate(remoteData) {
    let body = {
        sites: [],
        databases: [],
        ftps: [],
        username: remoteData.database.root,
        password: remoteData.database.password
    };
    $('input[name="sites"]:checked').each(function() {
        body.sites.push(remoteData.webserver.sites[parseInt($(this).data('id'))]);
    });
    $('input[name="databases"]:checked').each(function() {
        body.databases.push(remoteData.database.dbs[parseInt($(this).data('id'))]);
    });
    $('input[name="ftps"]:checked').each(function() {
        body.ftps.push(remoteData.ftp.ftps[parseInt($(this).data('id'))]);
    });
    selectProgress(4);

    var form = `migrate_data=${JSON.stringify(body)}`;
	$.post('/bt/migrate', form, function(result) {
        let progress = JSON.parse(result);
        if (progress.data.migration_started) {
            $('.psync_data').hide();
            $('.psync_migrate').html(getProgressHtml(progress.data.migration_started));
            $('.psync_migrate').show();
            progressInterval();
        }
    });
}

function progressInterval() {
    let progress_interval = setInterval(function(){
        $.post('/bt/get_progress', '', function(result) {
            let progress = JSON.parse(result);
            if (!progress.data.migration_started) {
                clearInterval(progress_interval);
            }
            $('.psync_migrate pre').text(progress.msg);
            let width = progress.data.progress+'%';
            $('.psync_migrate .progress_info_bar').width(width);
            $('.psync_migrate .progress_info').text(width);
            $('#migration_status').html(`${progress.data.migration_started ? "当前 --</span><img src='/static/img/ing.gif'>" : "结束"}`);
        })
    }, 5000);
}

function selectProgress(val){
    $('.step_head li').removeClass('active');
    $('.step_head li').each(function(){
        var v = $(this).find('span').text();
        if (val == v){
            $(this).addClass('active');
        }
    });
}