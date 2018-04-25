<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../common/headerAdmin.jsp" %>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta name="keywords" content=""/>
    <meta name="description" content=""/>
    <title>测试数据录入监控</title>
    <script src="${ctx}/resources/utils/seajs/sea.js" type="text/javascript"></script>
    <script src="${ctx}/resources/utils/seajs/conf.js" type="text/javascript"></script>
    <link rel="stylesheet" href="${ctx }/resources/css/sport/css/inputControl.css">
    <link rel="stylesheet" href="${ctx }/resources/css/sport/css/selectui.css">
    <script type="text/javascript">
        // 加载入口模块
        seajs.use("${ctx}/resources/js/sport/inputControl");
    </script>
</head>
<body>
    <div class="main-content" >
        <input id="project_id" type="hidden" value="${projectId}"/>
        <input id="sysProvinceId" type="hidden" value="${sysUser.provinceId}"/>
        <input id="sysCountryId" type="hidden" value="${sysUser.districtId}"/>
        <input type="hidden" class="totalStudents" value=""/>
        <div class="system-position">
            <p class="position-word">
                <img src="${ctx }/resources/css/sport/img/home.png" alt="icon">
                任务列表>体育测试数据录入><span>测试数据录入监控</span>
            </p>
        </div>
        <div class="slsect-area clearfix">
            <div class="fl profile">省份：
                <span class="select_ui">
                    <div class="select_arrow"></div>
                    <div class="select_text_ui"></div>
                    <select id="select_province" title="暂无">
                        <option value=''>暂无</option>
                    </select>
                </span>
            </div>
            <div class="fl profile">区县：
                <span class="select_ui">
                    <div class="select_arrow"></div>
                    <div class="select_text_ui"></div>
                    <select id="select_area" title="暂无">
                        <option style="display: none" value=''>暂无</option>
                    </select>
                </span>
            </div>
            <div class="fl profile">学校：
                <span class="select_ui">
                    <div class="select_arrow"></div>
                    <div class="select_text_ui"></div>
                    <select id="select_school" title="暂无">
                        <option style="display: none" value=''>暂无</option>
                    </select>
                </span>
            </div>
            <div class="fl profile">状态：
                <span class="select_ui">
                    <div class="select_arrow"></div>
                    <div class="select_text_ui"></div>
                    <select id="select_state">
                        <option value='0'>全部</option>
                        <option value='1'>已完成</option>
                        <option value='2'>未完成</option>
                    </select>
                </span>
            </div>
        </div>
        <div class="button-area">
            <input id="determine" type="button" value="确定">
            <input id="reset_select"type="button" value="重置">
            <input id="export" type="button" value="导出">
        </div>
        <p class="summary show1 summaryResult">汇总：</p>
        <div id="tBody"></div>
        <div id="projectlist_page"></div>
    </div>
    <div class="div-shade"></div>
    <div class="tip-select tac">
        <span class="close_button"></span>
        <%--<img src="${ctx }/resources/css/sport/img/tip-uncommitted.png" alt="icon">--%>
        <p>错误</p>
    </div>
</body>
</html>
<%@ include file="../common/footer.jsp" %>
