/*
 User: luzhen
 Date: 2015/3/19
 Time: 11:00
 Fun: 分页功能封装
 */
define(function(require, exports, module) {
    exports.paging=page;
    
    //公共的分页控件
    function page() {
        //私有变量
        var pageStart = 1;
        var pageEnd = 10;
        var pageInit = false;
		
        //公共变量
        this.PageSize = 10;
        this.NavigateSize = 10;

        this.initData = function () {
            pageStart = 1;
            pageEnd = 10;
            pageInit = false;
        }
        
        //公共方法
        this.initPage = function (rowNum, index, pageSize) {
			this.PageSize = pageSize;
            index = parseInt(index, 10);
            index = index + 1;
			
            var temp = rowNum % this.PageSize;
            var num = 0;
            if (temp == 0) {
                num = rowNum / this.PageSize;
            } else {
                num = parseInt(rowNum / this.PageSize) + 1;
            }
            if (num > 1) {
                if (!pageInit) { //首页为第一页的时候
                    if (num < this.NavigateSize) {
                        pageStart = 1;
                        pageEnd = num;
                    }
                    else if (num == this.NavigateSize) {
                        pageStart = 1;
                        pageEnd = this.NavigateSize;
                    } else {
                        pageStart = 1;
                        pageEnd = this.NavigateSize - 1;
                    }
                }
                
//                if (pageEnd > num) //这里的逻辑是？
//                {
//                    pageEnd=num;
//                    if(pageStart==pageEnd)
//                    {
//                        if (index == this.NavigateSize) {
//                            pageStart = 1;
//                            pageEnd = index;
//                        } else {
//                            pageEnd = index;
//                            pageStart=index-(this.NavigateSize-2)
//                        }
//                    }
//                }
                
                if (index >= pageStart && index <= pageEnd) {
                    //正常翻页
                    return normalPage(rowNum, index, num, this.NavigateSize);
                } else if (index < pageStart) {
                    //向前翻页
                    return upPage(rowNum, index, num, this.NavigateSize);
                } else if (index > pageEnd) {
                    //向后翻页
                    return nextPage(rowNum, index, num, this.NavigateSize);
                }
            }
            else {
                return "";
            }
        }

        //私有方法
        //正常翻页
        var normalPage = function (rowNum, index, num, navigateSize) {
            var html = [];
            if (index != 1) {// 大于1则显示 "上一页" 按钮
                html.push("<a class='disabled disabled prev_page temp_paging' page_no='"+(index - 1-1) +"' title='上一页' href='javascript:void(0);'>＜</a>");
            }else {
                html.push("");
            }
            //不进行翻页
            if ((pageEnd - pageStart) == (navigateSize - 1)) {
                //没有前后...
            } else if ((pageEnd - pageStart) <= (navigateSize - 2) && pageEnd > navigateSize) {
                html.push("<a class='temp_paging' page_no='" + (pageStart - 1-1)+"' title='" + (pageStart - 1) + "' href='javascript:void(0);' >...</a>");
            }
            
            for (var i = pageStart; i <= pageEnd; i++) {
                if (i == index) {
                    html.push("<a class='active temp_paging' page_no='"+(i-1)+"' title='" + i+ "' href='javascript:void(0);'>" + i + "</a>");
                } else {
                    html.push("<a class='temp_paging' page_no='"+(i-1)+"' title='" + i + "' href='javascript:void(0);'>" + i + "</a>");
                }
            }
            if ((pageEnd - pageStart) == (navigateSize - 1)) {
                //没有前后...
            } else if ((pageEnd - pageStart) == (navigateSize - 2) &&  pageEnd != num) {
                //有后...
                html.push("<a class='temp_paging' page_no='"+ (pageEnd + 1-1)+"' title='" + (pageEnd + 1) + "' href='javascript:void(0);'>...</a>");
            }
//            else if ((pageEnd - pageStart) == (navigateSize - 3)) {
//                //有后...
//                html.push("<a class='temp_paging' page_no='"+ (pageEnd + 1-1)+"' title='" + (pageEnd + 1) + "' href='javascript:void(0);'>...</a>");
//            }
            
            
            if (index != num) { //如果index小于num
                html.push("<a class='next_page temp_paging' page_no='"+ (index + 1-1) +"' title='下一页' href='javascript:void(0);'>＞</a> ");
            }else {
                html.push(" ");
            }
            var htmlContent = html.join(" ");
            return htmlContent;
        }

        //...向下翻页
        var nextPage = function (rowNum, index, num, navigateSize) {
            var html = [];
            html.push("<a class='disabled disabled prev_page temp_paging' page_no='"+(index - 1-1)+"' title='上一页' href='javascript:void(0);'>＜</a>");
            html.push("<a class='temp_paging' page_no='"+(index -1-1)+"' title='" + (index - 1) + "' href='javascript:void(0);' >...</a>");

            if ((index + navigateSize - 1) >= num) { //如果剩余的不够navigateSize-1
                pageStart = index;
                pageEnd = num;
                pageInit = true;
                for (var i = index; i <= num; i++) {
                    if (i == index) {
                        html.push("<a class='active temp_paging' page_no='"+(i-1)+"' title='" + i + "' href='javascript:void(0);'>" + i+ "</a>");
                    } else {
                        html.push("<a class='temp_paging' page_no='"+(i-1)+"' title='" + i + "'>" + i+ "</a>");
                    }
                }
            } else {
                pageStart = index;
                pageEnd = index + navigateSize - 2;
                pageInit = true;
                for (var i = index; i < index + navigateSize - 1; i++) {
                    if (i == index) {
                        html.push("<a class='active temp_paging' page_no='"+(i-1)+"' title='" + i + "' href='javascript:void(0);'>" + i+ "</a>");
                    } else {
                        html.push("<a class='temp_paging' page_no='"+(i-1)+"' title='" + i + "' href='javascript:void(0);'>" + i+ "</a>");
                    }
                }
                html.push("<a class='temp_paging' page_no='"+(index + navigateSize - 1-1)+"' title='" + (index + navigateSize - 1) + "' href='javascript:void(0);' >...</a>");
            }
            if (index != num) {
                html.push("<a class='next_page temp_paging' page_no='"+(index + 1-1)+"' title='下一页' href='javascript:void(0);'>＞</a> ");
            }
            else {
                html.push("<a class='next_page' title='下一页' href='javascript:void(0);'>＞</a> ");
            }
            var htmlContent = html.join(" ");
            return htmlContent;
        }

        //...向上翻页
        var upPage = function (rowNum, index, num, navigateSize) {
            var html = [];
            if (index != 1) {
                html.push("<a class='disabled disabled prev_page temp_paging' page_no='"+(index -1-1)+"' title='上一页' href='javascript:void(0);'>＜</a>");
            }
//            else {
//                html.push("<a class='disabled disabled prev_page' title='上一页' href='javascript::void(0);'>＜</a>");
//            }

            if ((index - (navigateSize - 1)) == 0) {
                pageStart = 1;
                pageEnd = index;
                pageInit = true;
                for (var i = 1; i <= index; i++) {
                    if (i == index) {
                        html.push("<a class='active temp_paging' page_no='"+(i-1)+"' title='" + i + "' href='javascript:void(0);'>" + i + "</a>");
                    } else {
                       html.push("<a class='temp_paging' page_no='"+(i-1)+"' title='" + i + "' href='javascript:void(0);'>" + i + "</a>");
                    }
                }
            } else if ((index - (navigateSize - 1)) > 0) {
                pageStart = index - navigateSize + 2;
                pageEnd = index;
                pageInit = true;
                html.push("<a class='temp_paging' page_no='"+ (index - (navigateSize - 1) -1)+"' title='" + (index - (navigateSize - 1)) + "' href='javascript:void(0);' >...</a>");
                for (var i = index - navigateSize + 2 ; i <= index; i++) {
                    if (i == index) {
                        html.push("<a class='active temp_paging' page_no='"+ (i -1)+"' title='" + i + "' href='javascript:void(0));'>" + i + "</a>");
                    } else {
                        html.push("<a class='temp_paging' page_no='"+ (i -1)+"' title='" + i + "' href='javascript:void(0);'>" + i + "</a>");
                    }
                }
            }
            html.push("<a class='temp_paging' page_no='"+ (index+1 -1)+"' title='" + (index + 1) + "' href='javascript:void(0);' >...</a>");
            if (index != num) {
                html.push("<a class='next_page temp_paging'  page_no='"+ (index+1 -1)+"' title='下一页' href='javascript:void(0);'>＞</a> ");
            }
            else {
                html.push("<a class='next_page' title='下一页' href='javascript:void(0);'>＞</a> ");
            }
            var htmlContent = html.join(" ");
            return htmlContent;
        }
    }

});