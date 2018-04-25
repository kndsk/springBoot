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
    <link rel="stylesheet" href="${ctx }/resources/css/sport/css/inputScore.css">
   	<script type="text/javascript">
		// 加载入口模块
		seajs.use("${ctx}/resources/js/sport/homePage");
	</script>
</head>
<body>
	<div class="main-content" >
		<input type="hidden" id="school_account" value="${account}"/>
		<div class="system-position">
			<p class="position-word">
				<img src="${ctx }/resources/css/sport/img/home.png" alt="icon">
				任务列表>体育测试数据录入><span>测试数据录入</span>
			</p>
		</div>
        <div class="text-prompt">
            <b>身高(厘米)：</b>保留一位小数<b style="margin-left: 30px">体重(千克)：</b>保留一位小数<b style="margin-left: 30px">肺活量(毫升)：</b>测试两次,每次间隔15秒,保留整数<b style="margin-left: 30px">立定跳远(厘米)：</b>依学生自愿情况,每人可以跳三次,保留整数
            <br><b>50米跑(秒)：</b>保留一位小数<b style="margin-left: 30px">握力(千克)：</b>测试两次,保留一位小数<b style="margin-left: 30px">视力：</b>使用标准对数视力表,采取五分记法<b style="margin-left: 30px">15米折返跑(次)：</b>记录结果为累积完成的次数(即记录单程次数)
            <br><b>如该生全部项目缺测，则勾选该生相对应的“全部缺失”复选框，如部分项目缺测，则缺测项目测试数据处填写-1，其他项目测试数据正常填写。</b>
            <br><b>如果该测试教室某项目全体学生缺测，则勾选该项目下的复选框。</b>
        </div>
		<div class="switch-area">
			<div class="limit-length">
				<ul class="area-tab" id="area_tab">
					<c:forEach items="${examRooms}" var="room" varStatus="p">
						<li school_code="${room.school_code}" exam_room="${room.exam_room}" status="${room.status >= 1}"></li>
					</c:forEach>
				</ul>
			</div>
			<span class="turn-left turn-left1"></span>
			<span class="turn-right turn-right2"></span>
		</div>
		<div id="tBody">
			<table class="table-inputScore">
				<tr>
					<th rowspan="2" width="148">条形码</th>
					<th rowspan="2" width="88">姓名</th>
					<th rowspan="2" width="50">全部<br>缺失<br><br><input type="text" unselectable="on" readonly id="isAll_miss" class="span-checkbox-all check-no"></th>
					<th rowspan="2" width="53">性别</th>
					<th rowspan="2" width="115">班级</th>
					<th rowspan="2" width="62">身高<br>（厘米）<br><br><input type="text" unselectable="on" readonly id="height_miss" class="span-checkbox-all check-no"></th>
					<th rowspan="2" width="62">体重<br>（千克）<br><br><input type="text" unselectable="on" readonly id="weight_miss" class="span-checkbox-all check-no"></th>
					<th colspan="2" width="116" height="36">握力<br>（千克）</th>
					<th colspan="2" width="100">视力</th>
					<th colspan="2" width="116">肺活量<br>（毫升）</th>
					<th rowspan="2" width="59">50米跑<br>（秒）<br><br><input type="text" unselectable="on" readonly id="fifty_miss" class="span-checkbox-all check-no"></th>
					<th colspan="3" width="174">立定跳远<br>（厘米）</th>
					<th rowspan="2" width="56">15米折返跑<br>（次）<br><input type="text" unselectable="on" readonly id="fifth_miss" class="span-checkbox-all check-no">
					</th>
				</tr>
				<tr>
					<th width="58" height="36">第一次<br><input unselectable="on" readonly type="text" id="power_first_miss" class="span-checkbox-all check-no"></th>
					<th width="58">第二次<br><input unselectable="on" readonly type="text" id="power_second_miss" class="span-checkbox-all check-no"></th>
					<th width="50">左眼<br><input unselectable="on" readonly type="text" id="left_eye_miss" class="span-checkbox-all check-no"></th>
					<th width="50">右眼<br><input unselectable="on" readonly type="text" id="right_eye_miss" class="span-checkbox-all check-no"></th>
					<th width="58">第一次<br><input unselectable="on" readonly type="text" id="breath_first_miss" class="span-checkbox-all check-no"></th>
					<th width="58">第二次<br><input unselectable="on" readonly type="text" id="breath_second_miss" class="span-checkbox-all check-no"></th>
					<th width="58">第一次<br><input unselectable="on" readonly type="text" id="jump_first_miss" class="span-checkbox-all check-no"></th>
					<th width="58">第二次<br><input unselectable="on" readonly type="text" id="jump_second_miss" class="span-checkbox-all check-no"></th>
					<th width="58">第三次<br><input unselectable="on" readonly type="text" id="jump_third_miss" class="span-checkbox-all check-no"></th>
				</tr>
			</table>
		</div>
	</div>
	<div class="div-shade"></div>
	<div class="tip-uncommitted pop-tip tac">
		<span id="data-error" class="close_button"></span>
		<%--<img src="${ctx }/resources/css/sport/img/tip-uncommitted.png" alt="icon">--%>
		<p>您还未提交，请提交后再进行其他操作</p>
	</div>
	<div class="tip-submitted pop-tip tac">
        <span id="submit-success" class="close_button"></span>
		<img src="${ctx }/resources/css/sport/img/tip-submitted.png" alt="icon">
		<p>提交成功</p>
	</div>
	<div class="tip-all-submitted pop-tip tac">
		<span id="all-submit-success" class="close_button"></span>
		<img src="${ctx }/resources/css/sport/img/tip-submitted.png" alt="icon">
		<p>全部测试教室数据提交成功</p>
	</div>
	<%--<div class="tip-selection pop-tip">--%>
        <%--<span class="close_button"></span>--%>
		<%--<p class="tac">数据未录完，确认关闭？</p>--%>
		<%--<button class="sure">确定</button>--%>
		<%--<button class="cancel">取消</button>--%>
	<%--</div>--%>
</body>
</html>
<%@ include file="../common/footer.jsp" %>
