/**
 * @description: 公共的方法
 * @author：liyang3
 * @time: 杨丽(2016-01-12)
 */
requirejs.config(requireConfig);
define(function (require, exports, module) {
    require('imageCtrl');
    require('plugin');
    require('pasteImgText');
    require('ckeditor');
    require('textCode');
    require('index');
    var $ = require('jquery'),
        Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1],// 加权因子
        ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
    var utils = {

        //ajax请求封装
        ajax: {
            /**
             * post请求
             * @param  {[string]} url      [请求接口地址]
             * @param  {[object]} data     [请求参数]
             * @param  {[function]} handler  [处理句柄]
             * @param  {[string]} dataType [交互数据类型]
             * @return {[Deferd]}          [Deferd对象]
             */
            ajaxPost: function (url, data, handler, dataType) {
                var dtd = $.Deferred(),
                    data;
                $.ajax({
                    url: url,
                    data: data || {},
                    type: 'POST',
                    dataType: dataType || 'json'
                }).done(function (data) {
                    data = handler ? handler(data) : data;
                    dtd.resolve(data);
                }).fail(function () {
                    dtd.reject(data);
                });
                return dtd.promise();
            },
            /**
             * post请求
             * @param  {[string]} url      [请求接口地址]
             * @param  {[object]} data     [请求参数]
             * @param  {[function]} handler  [处理句柄]
             * @param  {[string]} dataType [交互数据类型]
             * @return {[Deferd]}          [Deferd对象]
             */
            ajaxGet: function (url, handler, dataType) {
                var dtd = $.Deferred(),
                    data;
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: dataType || 'json'
                }).done(function (data) {
                    data = handler ? handler(data) : data;
                    dtd.resolve(data);
                }).fail(function () {
                    dtd.reject(data);
                });
                return dtd.promise();
            }
        },

        /**
         * 将json转换为object
         * 部分请求得到的是标准json字符串，需要做一步转换
         * @method toObj
         * @namespace Util
         */
        toJsonObj: function (json) {
            var data = json;
            if (typeof(data) == "string" &&
                (data.indexOf('{') == 0 || data.indexOf('[') == 0)) {
                data = eval('(' + data + ')');
            }
            return data;
        },

        popUpWindowByParams: function (URLStr, data, name, loc) {
            var name = name || '';
            var width, height, left, top;
            if (loc) {
                width = loc.width;
                height = loc.height;
                left = loc.left;
                top = loc.top;
            }
            width = width || "940";
            height = height || "500";
            left = left || "180";
            top = top || "15";
            var opW =
                window.open(
                    URLStr,
                    name,
                    'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=yes,width=' + width + ',height=' + height + ',left=' + left + ', top=' + top + ',screenX=' + left + ',screenY=' + top + '');
            if (data) {
                opW.window.activeData = data;
            }
            return opW;
        },
        /**
         * 避免resize多次触发
         * @param  {[string]}  []
         * @param  {[number]}  []
         * @return {[object]}         []
         */
        debounce: function (func, threshold, execAsap) {
            var timeout;
            return function debounced() {
                var obj = this,
                    args = arguments;

                function delayed() {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                };
                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);
                timeout = setTimeout(delayed, threshold || 100);
            };
        },

        /**TODO
         * 计算表单内容字数
         * @param  {[string]} objId   [表单id]
         * @param  {[string]} showId [展示位置id 可能写死]
         */
        EnglishCompositionWords: function () {
            var content = $('#compositionContent').val(),
                arr = new Array();
            arr = content.match(/([a-zA-Z'\d]+[a-zA-Z'\d-]*[a-zA-Z'\d]+|[a-zA-Z'\d]+)/g);
            arr === null ? $('#wordsNumber').text(0) : $('#wordsNumber').text(arr.length);
        },
        /**
         * 获取url参数值
         * @param  {[type]} name [description]
         * @return {[type]}      [description]
         */
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), //构造一个含有目标参数的正则表达式对象
                r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         * 截取url字符
         * @param  {[string]} name   [截取的字符]
         * return
         */
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        },
        /**
         * 返回无数据
         * @param  {[number]} col   [截取的字符]
         * return
         */
        getNoData: function (col) {
            return "<tr><td colspan='" + col + "' class='text-center'>没有记录</td></tr>";
        },
        /**
         * 获取初始化时间
         * @param  {[string]} beginId   [开始时间id]
         * @param  {[string]} endId   [结束时间id]
         * return
         */
        getNowMonth: function (beginId, endId) {
            var firstDate = new Date(), // 当前时间
                currentMonth = firstDate.getMonth(), // 当前月份
                nextMonth = ++currentMonth, //
                nextMonthFirstDay = new Date(firstDate.getFullYear(),
                    nextMonth, 1), // 下个月第一天
                oneDay = 1000 * 60 * 60 * 24,
                endTime = new XDate(nextMonthFirstDay - oneDay)
                    .toString('yyyy/MM/dd'), // 月底时间
                beginTime = new XDate(firstDate.setDate(1))
                    .toString('yyyy/MM/dd'); // 月初时间
            $(beginId).val(beginTime);
            $(endId).val(endTime);
        },
        /**
         * post导出文件
         * @param options
         * options:{
		 * url:'',  //下载地址
		 * data:{name:value}, //要发送的数据
		 * }
         */
        downLoadFile: function (options) {
            var config = $.extend(true, {
                method: 'post'
            }, options);
            var $iframe = $('<iframe id="down-file-iframe"/>');
            var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
            $form.attr('action', config.url);
            for (var key in config.data) {
                $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
            }
            $iframe.append($form);
            $(document.body).append($iframe);
            $form[0].submit();
            $iframe.remove();
        },
        /**
         * [requestNoData 后台请求无数据]
         * @param  {String} appendId [对应渲染数据的模块的id]
         * @return null
         */
        requestNoData: function (appendId) {
            $(appendId).empty().append('<div class="request-data-none">暂无数据</div>');
        },
        /**
         * [获得Iframe高度]
         * @return null
         */
        getIframeHeight: function () {
            var mainheight = window.$('.frame-content').height();
            window.parent.$('#frame').height(mainheight);
        },

        /**
         * 判断身份证号码为18位时最后的验证位是否正确
         * @param a_idCard 身份证号码数组
         * @return
         */
        isTrueValidateCodeBy18IdCard: function (a_idCard) {
            var sum = 0; // 声明加权求和变量
            if (a_idCard[17].toLowerCase() == 'x') {
                a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
            }
            for (var i = 0; i < 17; i++) {
                sum += Wi[i] * a_idCard[i]; // 加权求和
            }
            valCodePosition = sum % 11; // 得到验证码所位置
            if (a_idCard[17] == ValideCode[valCodePosition]) {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 验证18位数身份证号码中的生日是否是有效生日
         * @param idCard 18位书身份证字符串
         * @return
         */
        isValidityBrithBy18IdCard: function (idCard18) {
            var year = idCard18.substring(6, 10);
            var month = idCard18.substring(10, 12);
            var day = idCard18.substring(12, 14);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 这里用getFullYear()获取年份，避免千年虫问题
            if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * 验证15位数身份证号码中的生日是否是有效生日
         * @param idCard15 15位书身份证字符串
         * @return
         */
        isValidityBrithBy15IdCard: function (idCard15) {
            var year = idCard15.substring(6, 8);
            var month = idCard15.substring(8, 10);
            var day = idCard15.substring(10, 12);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            // 对于老身份证中的年龄则不需考虑千年虫问题而使用getYear()方法
            if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        },

        // 是否为有效身份证号
        isValidCard: function (idCard) {
            //去掉字符串头尾空格
            idCard = $.trim(idCard);
            //进行15位身份证的验证
            if (idCard.length == 15 && utils.isValidityBrithBy15IdCard(idCard)) {
                return true;
            }
            var a_idCard = idCard.split("");
            //进行18位身份证的基本验证和第18位的验证
            if (idCard.length == 18 && utils.isValidityBrithBy18IdCard(idCard) && utils.isTrueValidateCodeBy18IdCard(a_idCard)) {
                return true
            }
            return false;
        },
        /**
         * [initRichEditor 文本编辑器初始化加载]
         * pre-name        timeout
         */
        initRichEditor: function (obj) {
            // DomCtrl._addLayer();
            var $child = obj.find('.content-edit');
            CKEDITOR.disableAutoInline = false;
            /*$child.each(function (index, item) {
                /!*
                 if (CKEDITOR.instances[$(item).attr('id')]) {
                 // return;
                 CKEDITOR.remove(CKEDITOR.instances[$(item).attr('id')]);
                 }
                 *!/
                /!*if (CKEDITOR.instances[$(item).attr('class')]) {
                 // return;
                 CKEDITOR.instances[$(item).attr('class')].destroy(true);
                 }*!/
                if (CKEDITOR.instances[$(item).attr('id')]) {
                    // return;
                    CKEDITOR.instances[$(item).attr('id')].destroy(true);
                    $(item).attr('contenteditable', false);
                }
            });*/
            for(var name in CKEDITOR.instances){
                CKEDITOR.instances[name].destroy(true);
            }

            $child.each(function (index, item) {
                var id = $(item).attr('type') + index;
                $(item).attr('id', id);
                var id = $(item).attr('id'),
                    pasteData = ''; //拷贝的内容
                if (id && !CKEDITOR.instances[$(item).attr('id')]) {
                    $(item).attr('contenteditable', true);
                    var editor = CKEDITOR.inline(id);
                    editor.on('afterPaste', function () {
                        if (ImageCtrl.isDataContainImg(pasteData)) {
                            uploadWordImages(editor, pasteData);
                        }
                        ImageCtrl.divImageAdaptive($(item));
                        // uploadWordImagesFromCKEditor(editor, '', pasteData);
                    });
                    // 拷贝内容，移除内容的样式
                    editor.on('paste', function (e) {
                        // DomCtrl._addLayer();
                        var data = e.data.dataValue;
                        e.data.dataValue = '';
                        pasteData = DomCtrl.clearHtml(data);
                        e.data.dataValue = pasteData;
                    });
                }
                // 注册粘贴事件,并上传图片。
                $(item).on('paste', ImageCtrl.pasteImage);
            })
        },
        /**
         * [removeRichEditor 文本编辑器remove]
         * pre-name        timeout
         */
        removeRichEditor: function (obj) {
            // DomCtrl._addLayer();
            /*var $child = obj.find('.content-edit');
            $child.each(function (index, item) {
                if (CKEDITOR.instances[$(item).attr('id')]) {
                    // return;
                    CKEDITOR.remove(CKEDITOR.instances[$(item).attr('id')]);
                    $(item).attr('contenteditable', false);
                }
            });*/
            for(var name in CKEDITOR.instances){
                CKEDITOR.instances[name].destroy(true);
            }
        },
        getImgData: function () {
            $('img').each(function (index, item) {
                var $item = $(item),
                    itemWidth = $item.width(),
                    itemHeight = $item.height(),
                    parentWidth = $item.parent().width(),
                    parentHeight = $item.parent().height();
                if (itemWidth > parentWidth) {
                    $item.width('100%');
                    $item.height('100%');
                }
            });
        }
    };
    return utils;

});