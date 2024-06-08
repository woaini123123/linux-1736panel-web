function getToken() {
	$.post('/dns/get_token', function(data){
        body = "<tr>\
					<td><a href=" + data.data.url + " target=\"_blank\" class='btlinkbed'>" + data.data.url + "</a></td>\
					<td>" + data.data.username + "</td>\
					<td>" + data.data.password + "</td>\
					<td>" + data.data.token_id + "</td>\
					<td>" + data.data.token + "</td>\
				</tr>"
        $("#webBody").append(body);
	},'json');
}