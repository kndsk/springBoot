<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../inc/taglibs.jsp"%>    
<!DOCTYPE html>
<html>
<head lang="en">
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
    <meta charset="UTF-8">
    <meta name="keywords" content="" />
    <meta name="description" content="" />
    <title>登录</title>
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/sport/css/base.css" />
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/sport/css/comment.css" />
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/login/css/login.css" />
    <script src="${ctx }/resources/libs/jquery-1.9.1.js" type="text/javascript"></script>
    <script src="${ctx }/resources/js/login/login.js" type="text/javascript"></script>
</head>
<body>
<input type="hidden" id="hd_ctx" value="${ctx}"/>

<div class="header">
	<div class="header-top">
		<img src="${ctx}/resources/css/common/images/last_login_logo.png">
		<div class="fr">
			<a href="javascript:void(0)" class="help fl mr20" style="cursor: default">帮助</a>
		</div>
	</div>
</div>
	<div class="login-mid clearfix">
		<img src="${ctx }/resources/css/login/images/logo-big.png" class="fl"/>
		<div class="login-box fr">
			<h3 class="login-tit">用户登录</h3>
			<form action="" method="post">
				<div class="loing-form">
					<div class="user-input">
						<input type="text" name="loginname" id="loginname" placeholder="用户名"/>
					</div>
					<div class="user-input">
						<input type="password" name="password" id="password" placeholder="密码"/>
						<div class="login-tips"></div>
					</div>
					<a id="loginBtn" style="cursor: pointer;" class="sibmit-btn">登 录</a>
				</div>
			</form>
		</div>
	</div>
	<div class="footer">
		<p style="margin: 13px 0 2px;">©版权所有 教育部基础教育质量监测中心</p>
		<p style="margin-bottom: 13px">地址：北京市海淀区新街口外大街19号 联系电话：010-58800032 传真：58800031 Email：naeqdata@163.com 邮编：100875</p>
	</div>
</body>
</html>