<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../inc/taglibs.jsp"%>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    <meta charset="UTF-8">
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <title>基础教育质量监测体育测试数据录入系统</title>
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/sport/css/base.css">
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/sport/css/comment.css">
    <script src="${ctx }/resources/libs/jquery-1.9.1.js" type="text/javascript"></script>
    <script src="${ctx }/resources/utils/artDialog/popBox.js" type="text/javascript"></script>
    <script src="${ctx }/resources/css/common/js/jquery.selectui.js" type="text/javascript"></script>
</head>
<body>
<input type="hidden" id="hd_ctx" value="${ctx}"/>	
<div class="header">
	<div class="header-top">
		<img src="${ctx}/resources/css/sport/img/last_login_logo.png">
		<div class="fr">
			<a href="javascript:void(0)" class="admin fl mr20" style="cursor: default">欢迎您，${schoolUser.school_name}${sysUser.school_name}管理员</a>
			<a href="${ctx }/logout?baseurl=${ctx }"  class="quit fl">退出</a>
			<a href="javascript:void(0)" style="cursor: default" class="help fl mr20">帮助</a>
		</div>
	</div>
</div>
</body>