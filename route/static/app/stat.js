function stat_getToken(update = false) {
	$.post('/stat/get_token', function(data){
		if (data.status) {
			body = "<tr>\
						<td><a href=" + data.data.url + " target=\"_blank\" class='btlinkbed'>" + data.data.url + "</a></td>\
						<td>" + data.data.username + "</td>\
						<td>" + data.data.password + "</td>\
						<td>" + data.data.token + "</td>\
					</tr>"
			if (update) {
				$("#webBody").html(body);
			}
			else {
				$("#webBody").append(body);
			}
		} else {
			layer.open({
				type: 1,
				area: "500px",
				title: data.status ? "成功!" : "错误",
				closeBtn: 1,
				content: `<div style="margin: 20px">${data.msg}</div>`
			});
		}
	},'json');
}
function setXtokenCode(a) {
	if(a == 1) {
		p1 = $("#p1").val();
		p2 = $("#p2").val();
		if(p1 == "" || p1.length < 8) {
			layer.msg('面板tj1736 xtoken不能少于8位!', {icon: 2});
			return
		}
		
		//准备弱口令匹配元素
		var checks = ['admin888','123123123','12345678','45678910','87654321','asdfghjkl','password','qwerqwer'];
		pchecks = 'abcdefghijklmnopqrstuvwxyz1234567890';
		for(var i=0;i<pchecks.length;i++){
			checks.push(pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]+pchecks[i]);
		}
		
		//检查弱口令
		cps = p1.toLowerCase();
		var isError = "";
		for(var i=0;i<checks.length;i++){
			if(cps == checks[i]){
				isError += '['+checks[i]+'] ';
			}
		}
		
		if(isError != ""){
			layer.msg('面板tj1736 xtoken不能为弱口令'+isError,{icon:5});
			return;
		}
			
		if(p1 != p2) {
			layer.msg('两次输入的tj1736 xtoken不一致', {icon: 2});
			return;
		}
		$.post("/stat/set_code", "code1=" + encodeURIComponent(p1) + "&code2=" + encodeURIComponent(p2), function(b) {
			if(b.status) {
				layer.closeAll();
				layer.msg(b.msg, {icon: 1});
				stat_getToken(true);
			} else {
				layer.msg(b.msg, {icon: 2});
			}
		},'json');
		return;
	}

	$.post("/stat/get_code", "", function(result) {
		let resultData = JSON.parse(result);
		layer.open({
			type: 1,
			area: "290px",
			title: '修改tj1736 xtoken',
			closeBtn: 1,
			shift: 5,
			shadeClose: false,
			content: "<div class='bt-form pd20 pb70'>\
					<div class='line'>\
						<span class='tname'>tj1736 xtoken</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='password1' id='p1' value='"+resultData.data+"' placeholder='新的tj1736 xtoken' style='width:100%'/></div>\
					</div>\
					<div class='line'>\
						<span class='tname'>重复</span>\
						<div class='info-r'><input class='bt-input-text' type='text' name='password2' id='p2' value='"+resultData.data+"' placeholder='再输一次' style='width:100%' /></div>\
					</div>\
					<div class='bt-form-submit-btn'>\
						<button type='button' class='btn btn-danger btn-sm' onclick=\"layer.closeAll()\">关闭</button>\
						<button type='button' class='btn btn-success btn-sm' onclick=\"setXtokenCode(1)\">修改</button>\
					</div>\
				</div>"
		});
	});
}

function stat_create() {
  $.post('/stat/create', function(data){
		layer.open({
      type: 1,
      area: "500px",
      title: data.status ? "成功!" : "错误",
      closeBtn: 1,
      content: `<div style="margin: 20px">${data.msg}</div>`,
    });
		if (data.status) {
			setTimeout(function() {
				stat_getToken(true);
			}, 500)
		}
	},'json');
}
