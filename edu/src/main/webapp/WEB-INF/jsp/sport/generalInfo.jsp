<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ include file="../common/headerReadOnly.jsp" %>
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <meta name="keywords" content=""/>
    <meta name="description" content=""/>
    <title>体育测试数据录入系统</title>
    <script src="${ctx}/resources/utils/seajs/sea.js" type="text/javascript"></script>
    <script src="${ctx}/resources/utils/seajs/conf.js" type="text/javascript"></script>
    <script src="${ctx }/resources/js/projectmonitor/progressDetailsReadOnly.js" type="text/javascript"></script>
    <script type="text/javascript">
        seajs.use("${ctx}/resources/js/projectmonitor/progressDetailsReadOnly.js");
    </script>
    <link rel="stylesheet" href="${ctx}/resources/css/common/css/tableCom.css">
</head>
<input type="hidden" id="province" value="${provinceSelect[0].provinceId}"/>
<input type="hidden" id="userLevel" value='${userLevel}'/>
<input type="hidden" id="city" value="${citySelect[0].cityId}"/>
<input type="hidden" id="district" value="${districtSelect[0].districtId}"/>
<input type="hidden" id="school" value=""/>
<div class="container take-box">
    <div class="content" style="min-height: 800px;">
        <%--<h3 class="take-info-tit" id="projectName">请选择测评项目</h3>--%>
        <form action="" method="post">
            <div class="form-group take-form clearfix">
                <section class="selectBox" style="margin-top: 30px;">
                    <div class="form-inline fl mr10">
                        <%--<label for="">测评问卷：</label>--%>
                        <div class="profile fl">
                                <span class="select_ui" style="width: 163px">
                                    <div class="select_arrow"></div>
                                    <div class="select_text_ui">${provinceSelect[0].provinceName}</div>
                                </span>
                        </div>
                    </div>
                    <div class="form-inline fl mr10">
                        <%--<label for="">测评问卷：</label>--%>
                        <div class="profile fl">
                                <span class="select_ui" style="width: 163px">
                                    <div class="select_arrow"></div>
                                    <div class="select_text_ui">${citySelect[0].cityName}</div>
                                    <c:if test="${userLevel < 3}">
                                        <select id="sel_city" class="select_changeProject">
                                            <option value="">请选择地市</option>
                                                <c:forEach items="${citySelect}" var="city" varStatus="p">
                                                    <option value="${city.cityId}">${city.cityName}</option>
                                                </c:forEach>
                                        </select>
                                    </c:if>
                                </span>
                        </div>
                    </div>
                    <div class="form-inline fl mr10">
                        <%--<label for="">测评问卷：</label>--%>
                        <div class="profile fl">
                            <span class="select_ui" style="width: 163px">
                                <div class="select_arrow"></div>
                                <div class="select_text_ui">${districtSelect[0].districtName}</div>
                                <c:if test="${userLevel < 4}">
                                    <select id="sel_district" class="select_changeProject">
                                        <option value="">请选择区县</option>
                                    </select>
                                </c:if>
                            </span>
                        </div>
                    </div>
                    <div class="form-inline fl mr10">
                        <%--<label for="">测评问卷：</label>--%>
                        <div class="profile fl">
                            <span class="select_ui" style="width: 173px">
                                <div class="select_arrow"></div>
                                <div class="select_text_ui"></div>
                                <c:if test="${userLevel > 0}">
                                    <select id="sel_school" class="select_changeProject">
                                        <option value="">请选择学校</option>
                                        <c:if test="${userLevel == 4}">
                                            <c:forEach items="${schoolSelect}" var="school" varStatus="p">
                                                <option value="${school.schoolId}">${school.schoolName}</option>
                                            </c:forEach>
                                        </c:if>
                                    </select>
                                </c:if>
                            </span>
                        </div>
                    </div>
                    <div class="form-inline fl" id="selectState" style="display: none;">
                        <%--<label for="">测评问卷：</label>--%>
                        <div class="profile fl">
                            <span class="select_ui" style="width: 163px">
                                <div class="select_arrow"></div>
                                <div class="select_text_ui"></div>
                                <select id="sel_state">
                                    <option value="">请选择状态</option>
                                    <option value="0">未登录</option>
                                    <option value="1">进行中</option>
                                    <option value="2">已完成</option>
                                </select>
                            </span>
                        </div>
                    </div>
                    <%--<div class="form-inline fl">--%>
                    <%--&lt;%&ndash;<label for="">测评问卷：</label>&ndash;%&gt;--%>
                    <%--<div class="profile fl">--%>
                    <%--<span class="select_ui" style="width: 203px">--%>
                    <%--<div class="select_arrow"></div>--%>
                    <%--<div class="select_text_ui"></div>--%>
                    <%--<select id="sel_project">--%>
                    <%--<option value="">请选择项目</option>--%>
                    <%--</select>--%>
                    <%--</span>--%>
                    <%--</div>--%>
                    <%--</div>--%>
                </section>
                <section class="selectCont">
                    <a href="#" class="btn xq_but fl" id="export_but">导出</a>
                    <a href="#" class="btn xq_but fl" id="reset_but">重置</a>
                    <a href="#" class="btn xq_but btn- fl mr20" id="search_but">搜索</a>
                </section>
            </div>
        </form>
        <div id="tab_progressDetailsDataList"></div>
        <div class="manage-page mt30 clearfix">
            <div class="fl">
                <label for="">
                    共<span id="totalNum"></span>条记录
                </label>
            </div>
            <div class="page-box-li fr" id="progressDetailsDataList_page">
            </div>
        </div>
    </div>
</div>
<div id="mask" style="display: none">
    <div class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    </div>
    <p class="loadingTips">
        正在加载，请稍后...
    </p>
</div>
<%@ include file="../common/footer.jsp" %>
