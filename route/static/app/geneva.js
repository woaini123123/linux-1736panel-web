function updateBtnStatus(status) {
    if (status) {
        $('#start_btn').addClass('hide');
        $('#stop_btn').removeClass('hide');
    } else {
        $('#start_btn').removeClass('hide');
        $('#stop_btn').addClass('hide');
    }
}

function getStatus() {
	$.post('/geneva/get_status', function(data){
        updateBtnStatus(data.status);
	},'json');
}

function start() {
	$.post('/geneva/start', function(data){
        updateBtnStatus(JSON.parse(data).status);
    });
}

function stop() {
    $.post('/geneva/stop', function(data){
        updateBtnStatus(JSON.parse(data).status);
    });
}