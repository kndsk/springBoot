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
    <title>基础教育质量监测问卷调查系统</title>
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/common/css/base.css" />
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/common/css/pop.css" />
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/common/css/common.css" />
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/common/css/selectui.css"/>
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/css/manage/css/manage.css"/>
    <script src="${ctx }/resources/libs/jquery-1.9.1.js" type="text/javascript"></script>
    <script src="${ctx }/resources/utils/artDialog/popBox.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="${ctx }/resources/utils/artDialog/pop.css" />
    <script src="${ctx }/resources/css/common/js/jquery.selectui.js" type="text/javascript"></script>
</head>
<body>
<input type="hidden" id="hd_ctx" value="${ctx}"/>
<div class="header">
	<div class="header-top">
		<div class="container">
			<a href="" class="logo fl">
				<img src="${ctx}/resources/css/common/images/firstlogoone.png">
			</a>
			<div class="fr">
				<a href="javascript:void(0)" class="admin fl mr20">欢迎您，${user.name }</a>
				<a href="${ctx }/systemmanager/usehelp" class="help fl mr20">帮助中心</a>
				<a href="${ctx }/logout?baseurl=${ctx }"  class="quit fl">退出</a>
			</div>
		</div>
	</div>
	<div class="header-bottom">
		<div class="container">
			<ul class="nav fl mr20">
				<c:forEach items="${rightVoList }" var="rightVo" varStatus="r">
						<li class="rightVoEnName" id="${rightVo.enName }">
							<a class="head_menu" href="${ctx }${rightVo.url }">${rightVo.name }</a>
							<c:if test="${empty rightVo.sonRightVoList == false}">
								<ul class="sub-nav">
									<li>
										<em></em>
										<c:forEach items="${rightVo.sonRightVoList }" var="sonRightVo" varStatus="sr">
											<a class="head_menu" href="${ctx }${sonRightVo.url }">${sonRightVo.name }</a>
										</c:forEach>
									</li>
								</ul>
							</c:if>
						</li>
				</c:forEach>
			</ul>
		</div>
	</div>
</div>
</body>

