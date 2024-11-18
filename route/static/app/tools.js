$(document).ready(function () {
  getToolList();
});
// 获取工具列表
function getToolList() {
  $.post(
    "/tools/get_tool_list",
    function (data) {
      var rdata = data || [];
      var list = "";
      for (var i = 0; i < rdata.length; i++) {
        list += `<div class="col-xs-6">
          <div class="media deploy-tmpl">
            <div class="media-left">
              <div class="cms-icon">
                <img src=${rdata[i].logo || "/static/images/site_speed.svg"} />
              </div>
            </div>
            <div class="media-body">
              <h4 class="media-heading">${rdata[i].title}</div>
              <p class="text-right">
                <a class="btn btn-success btn-sm btn-title" href="/site_speed">测速</a>
              </p>
            </div>
          </div>
        </div>`;
      }

      $("#tools-list").html(list);
    },
    "json"
  );
}
