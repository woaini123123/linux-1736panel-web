var splitList = [
  { start: 0, end: 0.5, label: "<=0.5s", color: "#24aa1d" },
  {
    start: 0.501,
    end: 1,
    label: "0.5s-1s",
    color: "#42dd3f",
  },
  { start: 1.001, end: 3, label: "1s-3s", color: "#bef663" },
  {
    start: 3.001,
    end: 10,
    label: "3s-10s",
    color: "#f69833",
  },
  { start: 10.001, end: 99.999, label: ">10s", color: "#e61610" },
];

var privinceRegex =
  /新疆|西藏|内蒙古|青海|四川|黑龙江|甘肃|云南|广西|湖南|陕西|广东|吉林|河北|湖北|贵州|山东|江西|河南|辽宁|山西|安徽|福建|浙江|江苏|重庆|宁夏|海南|台湾|北京|天津|上海|香港|澳门|台湾/;

var channelColor = {
  电信: "#9ccc65",
  联通: "#ffba57",
  移动: "#00acc1",
};

var echartsDom = document.getElementById('china_map');
var echartsMap = echarts.init(echartsDom);
var echartsData = [];
var tableData = [];
var failureNum = 0;
echartsRender(echartsMap, echartsData);
echartsMap.on('click', function (params) {
  let current = tableData.filter(item => item.name.includes(params.name));
  let result = '';
  current.forEach(item => {
    result += renderTableRow(item);
  });

  if (params.name && current.length > 0) {
    $('#tab-list .tabs-item').removeClass('active');
    $('#tab-list #link-map').html(params.name).removeClass('hide').addClass('active');

    $('#speed-details .tab-con').addClass('hide').removeClass('show').removeClass('w-full');
    $('#current').addClass('show').addClass('w-full');
    $('#current tbody').html(result);
    $('#current .no-data-text').removeClass('show').addClass('hide');
    $('#current .table').removeClass('hide').addClass('show');
  }
  else {
    $('#tab-list .tabs-item').removeClass('active');
    $('#tab-list #link-map').addClass('hide');
    $('#tab-list .tabs-item').first().addClass('active');

    $('#speed-details .tab-con').addClass('hide').removeClass('show').removeClass('w-full');
    $('#current').addClass('hide');
    $('#all').addClass('show').addClass('w-full');
  }
});

$('#tab-list .tabs-item').click(function () {
  var type = $(this).data('name');
  $('#tab-list .tabs-item').removeClass('active');
  $(this).addClass('active');

  $('#speed-details .tab-con').addClass('hide').removeClass('show').removeClass('w-full');
  $('#' + type).addClass('show').addClass('w-full');
});

// 网站测速
function getSiteSpeed(el) {
  $(el).prop('disabled', true);
  restore();

  var domainUrl = $("#domain")
    .val()
    .replace("http://", "")
    .replace("https://", "");
  if (!domainUrl) {
    layer.alert('请填写完整URL,例：http://www.test.com');
    $(el).prop('disabled', false);
    return;
  }

  echartsMap.setOption({
    title: {
      text: '测速网址：' + (domainUrl || ''),
      subtext: '测速时间：' + getCurrentTime() + ', 数据来源'
    }
  });
  loadT = layer.msg('正在处理,请稍候...', { icon: 16, time: 0 })

  $.post('/tools/get_websocket_host', function (res) {
    if (res.status) {
      var ioUrl = res.data.host;
      // 连接ws
      var socket = io.connect(ioUrl, {
        query: {api_key: res.data.api_key}
      });

      socket.emit('start_task', { host: domainUrl });

      socket.on('task_update', function (data) {
        layer.close(loadT);
        $('#check-node-num').html(data.check_node_num + '个监测点参与测试，');
        $('#progress').css({ width: (data.progress ? data.progress.toFixed(2) : 0) + '%' }).html((data.progress ? data.progress.toFixed(2) : 0) + '%');
        if (data.progress && data.progress === 100) {
          $(el).prop('disabled', false);
        }
        if (data.status === 'processing') {
          let res = data.message
          tableData.push({
            name: res.name,
            type: res.type,
            all_time: res.all_time,
            ip: res.ip
          });
          renderTableData(res);
          updateEchartRender(echartsMap, res);
        }
      });
    }
    else {
      layer.close(loadT);
      layer.alert(res.msg);
      $(el).prop('disabled', false);
    }
  }, 'json');
}

function restore() {
  echartsData = [];
  tableData = [];
  echartsRender(echartsMap, echartsData);

  $('#check-node-num').html('');
  $('#progress').css({ width: '0%' }).html('0%');

  $('#all tbody').html('');
  $('#all .no-data-text').removeClass('hide').addClass('show');
  $('#all .table').removeClass('show').addClass('hide');

  $('#dianxin tbody').html('');
  $('#dianxin .no-data-text').removeClass('hide').addClass('show');
  $('#dianxin .table').removeClass('show').addClass('hide');

  $('#liantong tbody').html('');
  $('#liantong .no-data-text').removeClass('hide').addClass('show');
  $('#liantong .table').removeClass('show').addClass('hide');

  $('#yidong tbody').html('');
  $('#yidong .no-data-text').removeClass('hide').addClass('show');
  $('#yidong .table').removeClass('show').addClass('hide');

  $('#others tbody').html('');
  $('#others .no-data-text').removeClass('hide').addClass('show');
  $('#others .table').removeClass('show').addClass('hide');

  $('#current tbody').html('');
  $('#current .no-data-text').removeClass('hide').addClass('show');
  $('#current .table').removeClass('show').addClass('hide');

  failureNum = 0;
  $('#failure-num').html('');
  $('#failure tbody').html('');
  $('#failure .no-data-text').removeClass('hide').addClass('show');
  $('#failure .table').removeClass('show').addClass('hide');
}

function renderTableRow(data) {
  let time = data.all_time;
  let speed_class = "bg-success";
  if (time >= 10) {
    speed_class = "bg-danger";
  } else if (time >= 3 && time < 10) {
    speed_class = "bg-warning";
  } else if (time >= 1 && time < 3) {
    speed_class = "bg-good";
  }
  else if (!time) {
    speed_class = "bg-danger"
  }

  let result = `
    <tr>
      <td>${data.name}</td>
      <td>${data.type}</td>
      <td><span style="padding: 5px; color: white;" class="${speed_class}">${data.all_time || '--'
    }</span></td>
      <td>${data.ip}</td>
    </tr>
  `;
  return result;
}

function renderTableData(data) {
  let result = renderTableRow(data);

  renderHtml('all', result);
  if (data.name.match(/电信/)) {
    renderHtml('dianxin', result);
  }
  else if (data.name.match(/联通/)) {
    renderHtml('liantong', result);
  }
  else if (data.name.match(/移动/)) {
    renderHtml('yidong', result);
  }
  else {
    renderHtml('others', result);
  }

  if (data.type === 'fail') {
    failureNum += 1;
    if (failureNum > 0) $('#failure-num').html(failureNum);
    renderHtml('failure', result);
  }
}

function renderHtml(type, content) {
  $('#' + type + ' tbody').append(content);
  $('#' + type + ' .no-data-text').removeClass('show').addClass('hide');
  $('#' + type + ' .table').removeClass('hide').addClass('show');
}

function echartsRender(echartsMap, data) {
  $.get("/static/app/china.json", function (geoJson) {
    echarts.registerMap("CHINA", geoJson);
    echartsMap.setOption(
      (option = {
        title: {
          // text: "测速网址：" + (domainUrl || ''),
          // subtext: "数据来源",
        },
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return renderData(params.data);
          },
        },
        visualMap: {
          min: 0,
          max: 10,
          x: "5%",
          splitList,
          outOfRange: { color: "#f00" },
        },
        series: [
          {
            name: "网站测速",
            type: "map",
            map: "CHINA",
            label: {
              show: true,
            },
            backgroudColor: "#fff",
            data: data,
          },
        ],
      })
    );
  });

  window.onresize = function () {
    echartsMap.resize();
  };
}

function renderData(data) {
  var children = "";
  if (!data)
    return '<p style="line-height: 20px; padding: 0 10px;">此区域暂时没有数据</p>';
  data.children.forEach((item) => {
    children += `<p style="line-height: 20px; padding: 0 10px;">
                    ${item.channel
        ? `<font color="${item.color}">[${item.channel}]</font>`
        : ""
      } ${item.name}：${item.value ? item.value + 's' : '--'}
                </p>`;
  });
  return `<div>
          <p style="width:100%;height:30px;background-color:#4680ff;text-align: center;line-height: 30px;">${data.name.match(/香港|澳门|台湾/) ? "中国" + data.name : data.name
    }</p>
          <p style="line-height: 20px; padding: 0 10px;">最快响应：${data.value ? data.value + 's' : '--'
    }</p>
          ${children}
    </div>`;
}

function updateEchartRender(echartsMap, data) {
  echartsMap.setOption({
    series: [{
      data: unifyData(data)
    }]
  });
}

function unifyData(data) {
  var match = data.name.match(privinceRegex);
  if (match) {
    var cmatch = data.name.match(/电信|移动|联通/);
    var sIndex = cmatch
      ? data.name.length - cmatch[0].length
      : data.name.length;
    var split = [data.name.substring(0, sIndex), data.name.substring(sIndex)];
    var child = {
      name: split[0],
      channel: cmatch ? cmatch[0] : null,
      value: data.all_time,
      color: cmatch ? channelColor[cmatch[0]] : "#f00",
    };

    var index = echartsData.findIndex((data) => data.name === match[0]);
    if (index === -1) {
      echartsData.push({
        name: match[0],
        value: data.all_time,
        children: [child],
      });
    } else {
      var value =
        data.all_time * 1000 > echartsData[index].value * 1000
          ? echartsData[index].value
          : data.all_time;
      echartsData[index].value = value;
      echartsData[index].children.push(child);
    }
  }

  return echartsData;
}

function getCurrentTime() {
  var date = new Date();
  var year = date.getFullYear();
  var month = repair(date.getMonth() + 1);
  var day = repair(date.getDate());
  var hour = repair(date.getHours());
  var minute = repair(date.getMinutes());
  var second = repair(date.getSeconds());

  var curTime = [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
  return curTime;
}

function repair(i) {
  if (i >= 0 && i <= 9) {
    return '0' + i;
  } else {
    return i;
  }
}
