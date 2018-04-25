<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../inc/taglibs.jsp"%>
<!DOCTYPE html>
<script src="${ctx}/resources/utils/seajs/sea.js" type="text/javascript"></script>
<script src="${ctx}/resources/utils/seajs/conf.js" type="text/javascript"></script>
<script type="text/javascript">
// 加载入口模块
seajs.use("${ctx}/resources/js/sport/studentTable", function (studentTable) {  
	//绑定点击事件
    studentTable.initClick();
    //绑定数据
    studentTable.bindData();
    //初始化数据数据
    studentTable.initData('${studentsJson}', '${missColumn}');

    //渲染数据
    studentTable.buildPageData();

    //初始化录入员信息
	studentTable.initRecorderInfo('${schoolRecorder}');
});
</script>
<input type="hidden" id="stu_json" value="<%=request.getAttribute("studentsJson")%>"/>
<div class="write-num-area clearfix">
	<p class="fl" style="width: 446px;">信息录入员（信息员）：<input type="text" id="recorder" maxlength="100"></p>
	<p class="fl">联系方式（信息员）：<input type="text" id="phoneNum" maxlength="20"></p>
	<p class="fr">审核员（体育监测员）：<input type="text" id="auditor" maxlength="100"></p>
</div>
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
<c:forEach items="${students}" var="stu" varStatus="p">
	<tr class="tr_students" student_id="${stu.id}" student_sex="${stu.sex}" school_code="${stu.school_code}" exam_code="${stu.exam_room}" student_grade="${stu.className}">
        <td class="td_barcode"><input type="text" class="barcode" barcode="${stu.barcode}" value="${stu.barcode}" disabled="disabled"></td>
        <td class="td-name"><p class="p-name">${stu.student_name}</p><input class="input_name" maxlength="20" student_name="${stu.student_name}" title="${stu.student_name}" type="text" style="display: none"></td>
        <td><span student_miss="${stu.is_empty}" class="span-checkbox <c:if test="${stu.is_empty == 1}">check-yes</c:if> <c:if test="${stu.is_empty != 1}">check-no</c:if>"></span></td>
        <td class="td_sex"><input type="text" class="sex" <c:if test="${stu.sex == 1}"> value="女"</c:if> <c:if test="${stu.sex == 0}"> value="男"</c:if>></td>
        <td class="td_className"><input type="text" maxlength="20" class="className" grade_class="${stu.className}" value="${stu.className}"></td>
        <td><input type="text" class="height" value="${stu.height}"></td>
        <td><input type="text" class="weight" value="${stu.weight}"></td>
        <td><input type="text" class="power_first" value="${stu.power_first}"></td>
        <td><input type="text" class="power_second" value="${stu.power_second}"></td>
        <td><input type="text" class="left_eye" value="${stu.left_eye}"></td>
        <td><input type="text" class="right_eye" value="${stu.right_eye}"></td>
        <td><input type="text" class="breath_first" value="${stu.breath_first}"></td>
        <td><input type="text" class="breath_second" value="${stu.breath_second}"></td>
        <td><input type="text" class="fifty_meter" value="${stu.fifty_meter}"></td>
        <td><input type="text" class="jump_first" value="${stu.jump_first}"></td>
        <td><input type="text" class="jump_second" value="${stu.jump_second}"></td>
        <td><input type="text" class="jump_third" value="${stu.jump_third}"></td>
        <td><input type="text" class="fifth_meter" value="${stu.fifth_meter}"></td>
	</tr>
</c:forEach>
</table>
<p class="commit-button clearfix">
    <input id="commit" type="button" value="提交" class="commit input-btn fr can-click">
	<input id="save" type="button" value="保存" class="save input-btn fr can-click">
</p>
<script type="text/javascript">

</script>
