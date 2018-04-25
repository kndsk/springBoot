var dynamicSelected = {
        //保存后的对象
        saveObj:{},
        //简答的对象保存
        saveSimpleObj:null,
        //滑块模式
        isRang:false,
        //预存储滑块
        rangObj:null,
        //保存后的对象的数量
        saveObjL:0,
        //添加填空按钮
        // addObj:$('#addInput'),
        //可编辑div盒子
        // editDiv:$('.fill-theme'),
        //约束下拉列表框
        // blankNumber:$('#blankNumber'),
        //下拉列表的数量
        bankLength:0,
        //是否带简答
        isSimple:false,
        //加载约束下拉模板
        loadSelect:function(length){
            var tmpl = '<option value="-1">请选择</option>';
            for(var i=0;i<length;i++){
                tmpl += '<option value="'+ (i+1) +'">填空'+ (i+1) +'</option>';
                if(!dynamicSelected.saveObj[(i+1)]){ // 不存在赋值
                    dynamicSelected.saveObj[(i+1)] = {};
                    dynamicSelected.saveObj[(i+1)].eName = null;
                }
            }
            if(length != -1){
                dynamicSelected.saveObjL = length;
            }
            if(dynamicSelected.isSimple){
                tmpl += '<option value="'+ (dynamicSelected.saveObjL+1) +'">简答</option>';
                if(!dynamicSelected.saveSimpleObj){ // 不存在赋值
                    dynamicSelected.saveSimpleObj = {};
                    dynamicSelected.saveSimpleObj.eName = '0';
                }
            }
            $('#blankNumber').html(tmpl);
            //约束下拉框事件绑定
            $('#blankNumber').unbind('change');
            $('#blankNumber').bind('change',function(){
                var val = $(this).val();
                if(val == dynamicSelected.saveObjL+1){
                    if(dynamicSelected.isSimple){
                        if(!!dynamicSelected.saveSimpleObj){
                            $('#word').show().siblings('.limit-box').hide();
                            $('#word .min-value').val(dynamicSelected.saveSimpleObj.minNum);
                            $('#word .max-value').val(dynamicSelected.saveSimpleObj.maxNum);
                            $('#limitType').hide().prev().hide();
                        }else{
                            $('#limitType').hide().prev().hide();
                            $('#word').show().siblings('.limit-box').hide();
                            dynamicSelected.saveSimpleObj = {};
                            dynamicSelected.saveSimpleObj.eName = '0';
                        }
                    }
                    return false;
                }
                if(val != '-1'){
                    if(!!dynamicSelected.saveObj[val]){
                        if(!dynamicSelected.saveObj[val].eName){
                            dynamicSelected.clear();
                            $('#limitType').show().prev().show();
                        }else{//查找保存的值
                            if(dynamicSelected.saveObj[val].eName == '0'){
                                $('#limitType').show().prev().show();
                                $('#word').show().siblings('.limit-box').hide();
                                $('#word .min-value').val(dynamicSelected.saveObj[val].minNum);
                                $('#word .max-value').val(dynamicSelected.saveObj[val].maxNum);
                                $('#limitType option').get(1).selected = true;
                            }else if(dynamicSelected.saveObj[val].eName == '1'){
                                $('#limitType').show().prev().show();
                                $('.limit-box').hide();
                                $('#limitType option').get(2).selected = true;
                            }else if(dynamicSelected.saveObj[val].eName == '2'){
                                $('#limitType').show().prev().show();
                                $('#decimal').show().siblings('.limit-box').hide();
                                $('#decimal .min-value').val(dynamicSelected.saveObj[val].minNum);
                                $('#decimal .max-value').val(dynamicSelected.saveObj[val].maxNum);
                                $('#decimal .decimal-num').val(dynamicSelected.saveObj[val].pointNumLen);
                                $('#limitType option').get(3).selected = true;
                            }else if(dynamicSelected.saveObj[val].eName == '3'){
                                $('#limitType').show().prev().show();
                                $('#integer').show().siblings('.limit-box').hide(); 
                                $('#integer .min-value').val(dynamicSelected.saveObj[val].minNum);
                                $('#integer .max-value').val(dynamicSelected.saveObj[val].maxNum);
                                $('#limitType option').get(4).selected = true;
                            }
                        }
                    }else{
                        dynamicSelected.clear();
                    }
                }else{
                    dynamicSelected.clear();
                    $('#limitType').show().prev().show();
                }
            });
        },
        //清空数据
        clear:function(){
            $('#word input').val('');
            $('#decimal input').val('');
            $('#integer input').val('');
            $('#limitType option').get(0).selected = true;
            $('.limit-box').hide();
        },
        //清除滑块数据
        clearRang:function () {
          this.rangObj = null;
          $("#range input.max-value").val(100);
          $("#range input.min-value").val(0);
          $("#range input.step-value").val(1);
        },
        //init rang input
        initRangInput: function () {
            if(dynamicSelected.isRang){
                $('#range .min-value').val(dynamicSelected.rangObj.minNum);
                $('#range .max-value').val(dynamicSelected.rangObj.maxNum);
                $('#range .step-value').val(dynamicSelected.rangObj.range);
                $('#openRange').addClass('checkbox-selected');
                $('.normal-input-box').hide();
                $('.range-switch-box').show();
            }
        },
        //创建Rang
        createRang:function (obj) {
            if(!!obj && obj instanceof Object && obj.rangeFlag === 'true'){
                this.rangObj = {
                    eName: 4,
                    maxNum: obj.maxNum,
                    minNum: obj.minNum,
                    range: obj.range,
                    rangeFlag: true
                };
                this.isRang = true;
            }else{
                this.rangObj = {
                    eName: 4,
                    maxNum: 100,
                    minNum: 0,
                    range: 1,
                    rangeFlag: true
                };
            }
        },
        //事件绑定
        eventbind:function(){
            //添加按钮事件绑定
            $('#addInput').click(function(){
                var tmpl = '___';
                $('.fill-theme').html($('.fill-theme').html().replace('<br>', ''));
                //处理填空
                /*
                * TODO
                *  矩阵题处理
                * */
                $('.fill-theme').find('p:last').append(tmpl);
                var text = $('.fill-theme').text();
                var pattern = /____*/g;
                if(pattern.test(text)){
                    var transtext = text.replace(/____*/g,'<span class="countNumlist"></span>');
                    var tmpl = '<div id="countNumlist" style="display:none;">';
                    tmpl += transtext;
                    tmpl += '</div>';
                    $('body').append(tmpl);
                    var newL = $('#countNumlist .countNumlist').length;
                    dynamicSelected.loadSelect(newL);
                    $('#countNumlist').remove();
                }else{
                	dynamicSelected.loadSelect(0);
                }
            });
            //开启滑块事件
            $(".open-range-wrap").off('click').on('click',function (e) {
                var $this = $(e.target).parents('.open-range-wrap').find('#openRange');
                if($this.hasClass('checkbox-selected')){
                    dynamicSelected.isRang = false;
                    $this.removeClass('checkbox-selected');
                    $('.range-switch-box').hide();
                    $('.normal-input-box').show();
                    dynamicSelected.clearRang();
                }else{
                    dynamicSelected.isRang = true;
                    $this.addClass('checkbox-selected');
                    $('.normal-input-box').hide();
                    $('.range-switch-box').show();
                    dynamicSelected.createRang();
                }
            });
            //可编辑div事件绑定
            $('.fill-theme').keyup(function(){
                var text = $(this).text();
                var pattern = /____*/g;
                if(pattern.test(text)){
                    var transtext = text.replace(/____*/g,'<span class="countNumlist"></span>');
                    var tmpl = '<div id="countNumlist" style="display:none;">';
                    tmpl += transtext;
                    tmpl += '</div>';
                    $('body').append(tmpl);
                    var newL = $('#countNumlist .countNumlist').length;
                    dynamicSelected.loadSelect(newL);
                    $('#countNumlist').remove();
                }else{
                	dynamicSelected.loadSelect(0);
                }
            });
            //输入限制事件绑定
            $('#limitType').change(function(){
                var val = $(this).val();//当前的值
                var selVal = $('#blankNumber').val();//当前选中的下拉
                if(val != '-1'){
                    if(selVal != '-1'){
                        switch(val){
                            case '1':
                                dynamicSelected.saveObj[selVal].eName = '0';
                                $('#word').show().siblings('.limit-box').hide();
                            break;
                            case '2':
                                dynamicSelected.saveObj[selVal].eName = '1';
                                $('.limit-box').hide();
                            break;
                            case '3':
                                dynamicSelected.saveObj[selVal].eName = '2';
                                $('#decimal').show().siblings('.limit-box').hide();                 
                            break;
                            case '4':
                                dynamicSelected.saveObj[selVal].eName = '3';
                                $('#integer').show().siblings('.limit-box').hide(); 
                            break;
                            default:
                            break;
                        }
                    }
                }
            });
            //字数限制框事件绑定
            $('#word .min-value,#word .max-value').blur(function(){
                var val = $(this).val();
                var selVal = $('#blankNumber').val();//当前选中的下拉
                if(selVal != dynamicSelected.saveObjL+1){
                    if(selVal != '-1'){
                        if($(this).hasClass('min-value')){
                            if(val != ''){
                                dynamicSelected.saveObj[selVal].minNum = val;
                            }else{
                                dynamicSelected.saveObj[selVal].minNum = '';
                            }
                        }else if($(this).hasClass('max-value')){
                            if(val != ''){
                                dynamicSelected.saveObj[selVal].maxNum = val;
                            }else{
                                dynamicSelected.saveObj[selVal].maxNum = '';
                            }
                        }
                    }
                }else{
                    if(dynamicSelected.isSimple){
                        if(selVal == dynamicSelected.saveObjL+1){
                            if($(this).hasClass('min-value')){
                                if(val != ''){
                                    dynamicSelected.saveSimpleObj.minNum = val;
                                }else{
                                    dynamicSelected.saveSimpleObj.minNum = '';
                                }
                            }else if($(this).hasClass('max-value')){
                                if(val != ''){
                                    dynamicSelected.saveSimpleObj.maxNum = val;
                                }else{
                                    dynamicSelected.saveSimpleObj.maxNum = '';
                                }
                            }
                        }
                    }
                }
            });
            //整形限制框事件绑定
            $('#integer .min-value,#integer .max-value').blur(function(){
                var val = $(this).val();
                var selVal = $('#blankNumber').val();//当前选中的下拉
                if(selVal != '-1'){
                    if($(this).hasClass('min-value')){
                        if(val != ''){
                            dynamicSelected.saveObj[selVal].minNum = val;
                        }else{
                            dynamicSelected.saveObj[selVal].minNum = '';
                        }
                    }else if($(this).hasClass('max-value')){
                        if(val != ''){
                            dynamicSelected.saveObj[selVal].maxNum = val;
                        }else{
                            dynamicSelected.saveObj[selVal].maxNum = '';
                        }
                    }
                }
            });
            //小数限制框事件绑定
            $('#decimal .min-value,#decimal .max-value,#decimal .decimal-num').blur(function(){
                var val = $(this).val();
                var selVal = $('#blankNumber').val();//当前选中的下拉
                if(selVal != '-1'){
                    if($(this).hasClass('min-value')){
                        if(val != ''){
                            dynamicSelected.saveObj[selVal].minNum = val;
                        }else{
                            dynamicSelected.saveObj[selVal].minNum = '';
                        }
                    }else if($(this).hasClass('max-value')){
                        if(val != ''){
                            dynamicSelected.saveObj[selVal].maxNum = val;
                        }else{
                            dynamicSelected.saveObj[selVal].maxNum = '';
                        }
                    }else if($(this).hasClass('decimal-num')){
                        if(val != ''){
                            dynamicSelected.saveObj[selVal].pointNumLen = val;
                        }else{
                            dynamicSelected.saveObj[selVal].pointNumLen = '';
                        }
                    }
                }
            });
            //滑块设置
            $('#range .min-value, #range .max-value , #range .step-value').blur(function () {
                var val = $(this).val();
                if(dynamicSelected.isRang){
                    if($(this).hasClass('min-value')){
                        if(val != ''){
                            dynamicSelected.rangObj.minNum = val;
                        }else{
                            dynamicSelected.rangObj.minNum = '';
                        }
                    }else if($(this).hasClass('max-value')){
                        if(val != ''){
                            dynamicSelected.rangObj.maxNum = val;
                        }else{
                            dynamicSelected.rangObj.maxNum = '';
                        }
                    }else if($(this).hasClass('step-value')){
                        if(val != ''){
                            dynamicSelected.rangObj.range = val;
                        }else{
                            dynamicSelected.rangObj.range = '';
                        }
                    }
                }
            })
        },
        //获取最终计算后的数据对象
        getCountObj:function(){
            var obj = [];
            if(dynamicSelected.isRang){
                for(var i = 1; i <= dynamicSelected.saveObjL; i++){
                    var _obj_ = $.extend({index: i},dynamicSelected.rangObj);
                    obj.push(_obj_);
                }

                return obj;
            }else{
                if(dynamicSelected.saveObjL == 0){
                    if(!!dynamicSelected.saveSimpleObj){
                        obj[0]=dynamicSelected.saveSimpleObj;
                        obj[0].index = 1;
                        return obj;
                    }
                    return [];
                }else{
                    for(var i=1;i <= dynamicSelected.saveObjL;i++){
                        if(!!dynamicSelected.saveObj[i]){
                            obj[i-1] = {};
                            obj[i-1] = dynamicSelected.saveObj[i];
                            obj[i-1].index = i;
                        }else{
                            obj[i-1] = {};
                            obj[i-1].index = i;
                        }
                    }
                    if(!!dynamicSelected.saveSimpleObj){
                        obj[obj.length] = dynamicSelected.saveSimpleObj;
                        obj[obj.length-1].index = obj.length;
                    }
                    return obj;
                }
            }
        },
        //重置初始值
        resetConfig:function(obj){
            dynamicSelected.saveObj = {};
            dynamicSelected.saveSimpleObj = null;
            dynamicSelected.saveObjL = 0;
            dynamicSelected.bankLength= 0;
            dynamicSelected.isSimple = false;
            if(!!obj && obj instanceof Array){
                dynamicSelected.createRang(obj[0]);
            }
        },
        //初始化
        init:function(obj,i){
            this.isRang = false;
            this.rangObj = null;
            this.resetConfig(obj);
            this.initRangInput();
            if(this.isRang){
                arguments[0].forEach(function (ob) {
                   delete ob.minNum;
                   delete ob.maxNum;
                   delete ob.range;
                   delete ob.rangeFlag;
                   ob.eName = null;
                });
            }
            if(arguments.length == 1){
                if(typeof arguments[0] == "number"){
                    dynamicSelected.isSimple = true;
                    dynamicSelected.loadSelect(-1);
                }
                if(typeof arguments[0] == "object"){
                    for(var i=1;i<=arguments[0].length;i++){
                        dynamicSelected.saveObj[i] = arguments[0][i-1];
                    }
                    dynamicSelected.loadSelect(arguments[0].length);
                }
            }else if(arguments.length == 2){
                if(typeof arguments[1] == "number"){
                    dynamicSelected.isSimple = true;
                }
                if(typeof arguments[0] == "object"){
                    for(var i=1;i<=arguments[0].length-1;i++){
                        dynamicSelected.saveObj[i] = arguments[0][i-1];
                    }
                    dynamicSelected.saveSimpleObj = arguments[0][arguments[0].length-1];
                    dynamicSelected.loadSelect(arguments[0].length-1);
                }
            }
            dynamicSelected.eventbind();
        }
    };