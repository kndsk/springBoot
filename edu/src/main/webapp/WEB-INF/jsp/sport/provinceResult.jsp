
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="../inc/taglibs.jsp"%>
<!DOCTYPE html>
<table class="table-statistics show1">
    <tr>
        <th width="98">序号</th>
        <th width="141">省份</th>
        <th width="153">应测学生数量</th>
        <th width="203">已录入学生数量</th>
        <th width="203">缺测学生数量</th>
        <th width="143">已录入百分比（%）</th>
        <th width="143">状态</th>
    </tr>
    <c:forEach items="${sportStatisticsList}" var="data" varStatus="p">
        <tr>
            <td class="td-index">${p.index + 1}</td>
            <td>${data.province_name}</td>
            <td>${data.stuTotal}</td>
            <td>${data.finishedCount}</td>
            <td>${data.missingCount}</td>
            <td>${data.percent}</td>
            <c:if test="${data.statisticsStatus == 0}">
                <td>未完成</td>
            </c:if>
            <c:if test="${data.statisticsStatus == 1}">
                <td>已完成</td>
            </c:if>
        </tr>
    </c:forEach>
</table>