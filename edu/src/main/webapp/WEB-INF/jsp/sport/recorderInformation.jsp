<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../common/headerReadOnly.jsp" %>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta name="keywords" content=""/>
    <meta name="description" content=""/>
    <title>测试数据录入</title>
    <script src="${ctx}/resources/utils/seajs/sea.js" type="text/javascript"></script>
    <script src="${ctx}/resources/utils/seajs/conf.js" type="text/javascript"></script>
    <link rel="stylesheet" href="${ctx }/resources/css/sport/css/inputInformation.css">
    <script type="text/javascript">
	// 加载入口模块
	seajs.use("${ctx}/resources/js/sport/recorderInformation");
	</script>
</head>
<body>
<input type="hidden" id="hd_ctx" value="${ctx}"/>
<div class="main-content">
    <div class="system-position">
        <p class="position-word">
            <img src="${ctx }/resources/css/sport/img/home.png" alt="icon">
            任务列表><span>体育测试数据录入</span>
        </p>
    </div>
    <div class="input-information">
        <div style="padding-top: 30px;"><p>信息录入员：</p><input type="text" id="recorder" maxlength="100"></div>
        <div><p>信息审核员：</p><input type="text" id="auditor" maxlength="100"></div>
        <div style="padding-bottom: 15px"><p>联系电话：</p><input type="text" id="phoneNum" maxlength="20"></div>
        <p class="tac"><button class="begin-write">开始录入测试数据</button></p>
    </div>
</div>

<div class="div-shade"></div>
<div class="tip-error tac">
    <span class="close_button"></span>
    <%--<img src="${ctx }/resources/css/sport/img/tip-uncommitted.png" alt="icon">--%>
    <p>录入信息不能为空！</p>
</div>
</body>
</html>
<%@ include file="../common/footer.jsp" %>
