/**
 * @description: 表格
 * @author：smchen2
 * @time: 陈世敏(2016-08-05)
 */
require.config(requireConfig);
define(function(require, exports, module) {
   	var util = require('common/common'),
        dao = require('common/dao'),
        template = require('template');
	  require('imageCtrl');
	  require('plugin');
	  require('pasteImgText');
	  require('ckeditor');
	  require('textCode');
    require('popbox');
    require('dropListSave'); //记录下拉框数值
    require('listDrag'); //拖拽js
    require('wholeDrag'); //整题拖拽js
    require('radio-choice/main');//单选题js
    require('multiple-choice/main');//多选题js
    require('fill-blank/main');//填空题js
    require('short-answer/main');//简答题js
    require('paragraph-statement/main');//段落题js
    require('sort/main');//排序题js
    require('table/main');//表格题js
    require('scale/main');//量表题js
    require('combin/main');//组合题js
    require('dialog/main');//弾框js

    var combination = false,//组合标志位
        paperId = $('#hdPaperId').val(),
        okType = true;//是否点击确定按钮
        pageIndex = 1; //新增页码
    var addEvents = function(){
        // 导航切换
        $(document).on('click','.nav-warpper li:not(.no-click)',eventController.navSwitch);
        //预览
        $(document).on('click', '#paperPreview', eventController.preview);
        //保存
        $(document).on('click', '#paperSave', eventController.save);
        // 增加分页
        $(document).on('click', '.page-add-btn',eventController.addPage);
        // tab切换
        $(document).on('click','.tab-ul li',eventController.tabSwitch);
        // 轮播
        $(document).on('click', '.pre-btn',eventController.carouselPage);
        $(document).on('click', '.next-btn',eventController.carouselPage);
        //删除一页
        $(document).on('click', '.item-tab a',eventController.deletePge);
        //编辑状态时除列表元素外其余停止拖动
        $(document).on('click','.view-edit' , function () {
            $('.darg-box').dragAll({
                obj:'.darg-box',
                stop:true
            })
        });
        //编辑结束之后添加拖动事件
        $(document).on('click','.ok' , function (e) {
            if(!window.combination){
                $('.darg-box').dragAll({
                    obj:'.darg-box',
                    stop:false,
                    callback:dragAllCB
                })
            }else{
            //    组合题
                if($(e.target).hasClass('.ok-combin')){
                    $('.darg-box').dragAll({
                        obj:'.darg-box',
                        stop:false,
                        callback:dragAllCB
                    })
                }else{
                    $('.darg-box').dragAll({
                        obj:'.darg-box',
                        stop:true
                    })
                }
            }
        });
    };
    //页面渲染
    var renderView = {
        /**
         * [renderRadioChose 加载单选题模板]
         * @return {[type]} [description]
         */
        renderRadioChose:function(){
          var url = basePath + '/resources/editpaper/templ/radio-chose/radio-chose-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              $('.radio-wrapper .option-box .item-option').drag({ //选项拖拽
                  'handle':'.option-handle'
              },function(){
                util.initRichEditor($('.radio-wrapper'));
              });
              dynamicSelected.init();
              util.initRichEditor($('.radio-wrapper'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载多选题模板]
         * @return {[type]} [description]
         */
        renderMultipleChose:function(){
          var url = basePath + '/resources/editpaper/templ/multiple-choice/multiple-choice-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              $('.multiple-wrapper .option-box .item-option').drag({ //选项拖拽
                  'handle':'.option-handle'
              },function(){
                util.initRichEditor($('.multiple-wrapper'));
              });
              dynamicSelected.init();
              util.initRichEditor($('.multiple-wrapper'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载填空题模板]
         * @return {[type]} [description]
         */
        renderFillBlank:function(){
          var url = basePath + '/resources/editpaper/templ/fill-blank/fill-blank-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              dynamicSelected.init();
              util.initRichEditor($('.fill'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载j简答题模板]
         * @return {[type]} [description]
         */
        renderShortAnswer:function(){
          var url = basePath + '/resources/editpaper/templ/short-answer/short-answer-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              dynamicSelected.init(1);
              util.initRichEditor($('.short-answer'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载段落题模板]
         * @return {[type]} [description]
         */
        renderParagraphStatement:function(){
          var url = basePath + '/resources/editpaper/templ/paragraph-statement/paragraph-statement-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              util.initRichEditor($('.paragraph-statement'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载排序题模板]
         * @return {[type]} [description]
         */
        renderSort:function(){
          var url = basePath + '/resources/editpaper/templ/sort/sort-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              $('.option-box .item-option').drag({ //选项拖拽
                  'handle':'.option-handle'
              },function(){
                util.initRichEditor($('.sort-wrapper'));
              });
              util.initRichEditor($('.sort-wrapper'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载表格题模板]
         * @return {[type]} [description]
         */
        renderTable:function(){
          var url = basePath + '/resources/editpaper/templ/table/table-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              $('.option-li').drag({ //选项拖拽
                  'handle':'.option-handle'
              },function(){
                util.initRichEditor($('.table-wrapper'));
              });
              util.initRichEditor($('.table-wrapper'));
              dynamicSelected.init();
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载量表题模板]
         * @return {[type]} [description]
         */
        renderScale:function(){
          var url = basePath + '/resources/editpaper/templ/scale/scale-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
              if(window.combination === false){
                  $('.theme-box').append(render(data));
              }else{
                  $('.combin-box-wrapper').each(function(index,item){ //查找哪个组合题可添加
                    if($(item).find('.button-box').is(':visible')){
                      $(item).find('.combin-box').append(render(data));
                      return false;
                    }
                  });
              }
              $('.option-li').drag({ //选项拖拽
                  'handle':'.option-handle'
              },function(){
                util.initRichEditor($('.scale-wrapper'));
              });
              util.initRichEditor($('.scale-wrapper'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderRadioChose 加载组合题模板]
         * @return {[type]} [description]
         */
        renderCombin:function(){
          var url = basePath + '/resources/editpaper/templ/combin/combin-edit.html';
          $.when(dao.requestListTmpl(url)).done(function(templ){
              var data = {},
                  render = template.compile(templ);
                  $('.theme-box').append(render(data));
              util.initRichEditor($('.combin-wrapper'));
          }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
          });
        },
        /**
         * [renderTitle 加载]标题
         * @return {[type]} [description]
         */
        renderTitle:function(){
            var dataUrl = basePath + '/paper/getpaperdto',
                parmes = {
                    paperId:paperId
                };
            $.when(dao.requestListData(dataUrl,parmes)).done(function(data){
                if(data.flag === 1){
                    if(data.data != null){
                        $("#paperTitle").html(data.data.paper.name);
                        $("#paperInstruction").html(data.data.paper.guideLanguage);
                        pageIndex = data.data.totalPage;
                        for(var i=2;i<=pageIndex;i++){
                          html = '<li class="item-tab" page="'+i+'"><span>第'+i+'页</span><a class="page-remove" href="javascript:void(null)">&#10005;</a></li>'; 
                          $('.tab-ul').append(html);
                        }
                        $('.tab-ul').width(98*(pageIndex+1));
                    }else{
                        alert('网络错误！');
                    }
                }else{
                    jnoButtonConfirm(data.flagMsg, '','',1);
                }
            }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
            });
        },
        /**
         * [renderTheme 记载描述]
         * @return {[type]} [description]
         */
        renderTheme:function(page){
            var dataUrl = basePath + '/paperitem/getpagepaperitems',
                tempUrl = basePath + '/resources/editpaper/templ/preview-paper/edit-preview-paper-templ.html',
                parmes = {
                    paperId:paperId,
                    page:page
                };
            $.when(dao.requestListTmpl(tempUrl),dao.requestListData(dataUrl,parmes)).done(function(templ,data){
                if(data.flag === 1){
                    if(data.data != null){
                        var render = template.compile(templ);
                        $('.theme-box').empty().append(render(data.data));

                        $('.darg-box').dragAll({ //整体拖拽
                          'obj':'.darg-box',
                          'callback':dragAllCB
                        });

                        eventController.initRangeEvent();

                        util.getImgData();
                    }else{
                        jnoButtonConfirm('暂无数据！', '','',1);
                    }
                }else{
                    jnoButtonConfirm(data.flagMsg, '','',1);
                }
            }).fail(function(){
              jnoButtonConfirm('网络错误！', '','',1);
            });
        }
    };
    //事件控制器
    var eventController = {
      /**
       * [navSwitch 导航切换]
       * @return {[type]} [description]
       */
        navSwitch:function(){
          var type = $(this).attr('data-type');
          switch (type) {
              case 'radio-chose':
                  if(window.okType === true){
                    renderView.renderRadioChose();
                    window.okType = false;
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
              case 'multiple-chose':
                  if(window.okType === true){
                    renderView.renderMultipleChose();
                    window.okType = false;
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
              case 'fill':
                  if(window.okType === true){
                    window.okType = false;
                    renderView.renderFillBlank();
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
              case 'short-answer':
                  if(window.okType === true){
                    window.okType = false;
                    renderView.renderShortAnswer();
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
              case 'paragraph-statement':
                  if(window.okType === true){
                    window.okType = false;
                    renderView.renderParagraphStatement();
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
              case 'sequence':
                  if(window.okType === true){
                    window.okType = false;
                    renderView.renderSort();
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
              case 'table':
                  if(window.okType === true){
                    window.okType = false;
                    renderView.renderTable();
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
              case 'scale':
                  if(window.okType === true){
                    window.okType = false;
                    renderView.renderScale();
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
               case 'combination':
                  if (window.combination === true){
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                    return;
                  }else {
                    window.combination = true;
                  }
                  if(window.okType === true){
                    window.okType = false;
                    renderView.renderCombin();
                  }else{
                    jnoButtonConfirm('保存后才能增加下一题！', '','',1);
                  }
                  break;
          };
        },
        /**
         * [preview 预览跳转]
         * @return {[type]} [description]
         */
        preview:function(){
        	//将本作答数据相关本地缓存清除
			if(window.localStorage){
				localStorage.removeItem(paperId+'_currentpage');
				localStorage.removeItem(paperId+'_userBehaviorPath');
				localStorage.removeItem(paperId+'_displayObj');
				localStorage.removeItem(paperId+'_result');
			}
        	window.location.href = basePath + "/paperitem/previewpaper?paperId="+window.paperId+"&edit=true";
        },
        /**
         * [save 保存]
         * @return {[type]} [description]
         */
        save:function(){
        	window.location.href = basePath + "/papermanager/paperlist";
        },
        /**
         * [tabSwitch 分页切换]
         * @return {[type]} [description]
         */
        tabSwitch:function(){
          var $this = $(this),
              page = $this.attr('page');
          $this.addClass('page-seletced').siblings().removeClass('page-seletced');
          if(page === '-1'){ //点击的为首页
            $('.title-box').show();
            $('.theme-box').hide();
            $('.nav-warpper li').addClass('no-click');
          }else{
            $('.title-box').hide();
            $('.theme-box').show();
            renderView.renderTheme(page);
            window.okType = true;
            $('.nav-warpper li').removeClass('no-click')
          }
        },
        /**
         * [addPage 增加一页]
         */
        addPage:function(){
          pageIndex++;
          var $this = $('.tab-ul'),
              thiswidth = $this.width();
              html = '<li class="item-tab" page="'+pageIndex+'"><span>第'+pageIndex+'页</span><a class="page-remove" href="javascript:void(null)">&#10005;</a></li>';
          $this.width(thiswidth+98);//改变宽度
          $this.append(html);
        },
        /**
         * [carouselPage tab轮播]
         */
        carouselPage:function(){
          var $this = $('.tab-ul'),
              style = $(this).attr('style');
          if(style === 'pre'){ //上一页
              var thisLeft = parseInt($this.css('margin-left'))-98+'px';  
              if($this.parent().width() > 588){ //判断是否有隐藏的页数
                  $this.animate({marginLeft:thisLeft});
                }
          }else{ 
            var thisLeft = parseInt($this.css('margin-left'))+98+'px';
            if(parseInt($this.css('margin-left')) < 0){ //判断是否有隐藏的页数
                $this.animate({marginLeft:thisLeft});
              }
          }
        },
        /**
         * [deletePge 删除一页]
         * @return {[type]} [description]
         */
        deletePge:function(){
          var $this = $(this),
              page = parseInt($this.parent().attr('page'));
          jConfirm('删除会删除当前页的数据','警告',function(){
            var thiswidth = $('.tab-ul').width(),
                parmes = {
                    paperId:paperId,
                    page:page
                },
                dataUrl = basePath + '/paperitem/deletepage';
            $.when(dao.requestListData(dataUrl,parmes)).done(function(data){
              if(data.flag === 1){
                  $this.parent().remove();
                  $('.tab-ul').width(thiswidth-98); //减少分页ul的宽度
                  if(page === pageIndex){ //判断删除页是否为最后一页
                    renderView.renderTheme(page-1);
                  }else{                    
                    renderView.renderTheme(page);
                  }
                  $('.tab-ul').empty().append('<li class="item-tab" page="-1"><span>首页</span></li>');
                  for(var i=1;i<=pageIndex-1;i++){
                    if(page === pageIndex){ //判断删除页是否为最后一页
                      if(i === page-1){
                        html = '<li class="item-tab page-seletced" page="'+i+'"><span>第'+i+'页</span><a class="page-remove" href="javascript:void(null)">&#10005;</a></li>';
                      }else{
                        html = '<li class="item-tab" page="'+i+'"><span>第'+i+'页</span><a class="page-remove" href="javascript:void(null)">&#10005;</a></li>';
                      }
                      $('.tab-ul').append(html);
                    }else{
                      if(i === page){
                        html = '<li class="item-tab page-seletced" page="'+i+'"><span>第'+i+'页</span><a class="page-remove" href="javascript:void(null)">&#10005;</a></li>';
                      }else{
                        html = '<li class="item-tab" page="'+i+'"><span>第'+i+'页</span><a class="page-remove" href="javascript:void(null)">&#10005;</a></li>';
                      }
                      $('.tab-ul').append(html);
                    }
                  }
                  pageIndex--; //总页数减一
              }
            }).fail(function(){
              jnoButtonConfirm('网络错误!','','',1);
            });
          })
        },
        /**
         * [initRangeEvent 初始化滑块拖动事件]
         * @return {[type]} [description]
         */
        initRangeEvent: function () {
            $("input.hk").each(function (index,input) {
                $('.range-result').eq(index).text($(input).val());
                (function (index,input) {
                    $(input).off('input').on('input',function () {
                        $('.range-result').eq(index).text($(this).val());
                    });
                })(index,input);
            });
        }
    };
    
    var init = function() {
      addEvents();
      window.combination = combination;//是否为组合题标志
      window.paperId = paperId; //问卷id
      window.okType = okType; // 是否保存标志
      renderView.renderTitle();
      $('.header').find(".rightVoEnName").each(function() { 
			$(this).removeClass("active");
		});
		$('#PaperManager').addClass("active");
    }
    function dragAllCB(currindex,wellIndex){
        var dataUrl = basePath + '/paperitem/move',
            parmes = {
                paperId:paperId,
                sourceIndex:parseInt(currindex),
                targetIndex:parseInt(wellIndex),
                pageIndex:$('.tab-ul li').index($('.page-seletced'))
            }
        $.when(dao.requestListData(dataUrl,parmes)).done(function(data){ //拖拽后重新排序
            if(data.flag === 0){
                jnoButtonConfirm(data.flagMsg, '','',1);
            }else{
                renderView.renderTheme(parmes.pageIndex);
                window.okType = true;
            }
        }).fail(function(){
            jnoButtonConfirm('网络错误！', '','',1);
        });
    }

  $(function() {
      init();
  });
})