//seajs 的简单配置
seajs.config({
  base: $("#hd_ctx").val()+"/resources/",
  alias: {
	"jquery":"libs/jquery-1.9.1.js", 
    "paging":"utils/page/pageControl.js",
    "highchart":"utils/highcharts/highcharts.js",
    "highcharts-more":"utils/highcharts/highcharts-more.js",
    "format":"utils/format/format.js",
    "ajaxfileupload": "utils/ajaxfileupload/ajaxfileupload.js",
    "mustache": "utils/mustache/mustache.min.js"
  },
  preload: ['jquery']
});