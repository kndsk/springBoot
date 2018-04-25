/*
    autor : zyshi
    time : 2016-9-7
    版本1.1.0
*/
;(function( $, window, document, undefined ){
    //入口
    $.fn.dragAll = function(parm){
        var callear = arguments.callee;
        var record = null;
        //记录鼠标的位置
        record = {
            x:0,
            y:0,
            offsetWidth:0,
            offsetHeight:0,
            isDrag:false,
            currentDom:null,
            index:0,
            domLength:0,
            canTransMin:0,
            canTransMax:0,
            wellDom:null
        };
        record.domLength = this.length;
        var _this = this;
        _this.removeAttr('style');
        //默认配置
        var defaultParm = {
            'handle':null
        };
        if(parm){
            $.extend(true,defaultParm,parm);
        }
        var arrH = [];
        for(var i=0;i<record.domLength;i++){
            arrH[i] = _this.eq(i).height();
        }
        //按下鼠标处理事件
        var mousedownFun = function(e){
            if($(e.target).attr('type') == 'range'){
                return;
            }
            record.x = e.clientX;
            record.y = e.clientY;
            record.isDrag = true;
            record.countMove = 0;
            if($(e.target).hasClass(parm.obj.substring(1))){
                record.currentDom = $(e.target);
            }else if($(e.target).parents().hasClass(parm.obj.substring(1))){
                record.currentDom = $(e.target).parents(parm.obj);
            }
            record.currentDom.addClass('drag-bg');
            record.offsetWidth = record.currentDom[0].offsetWidth;
            record.offsetHeight = record.currentDom[0].offsetHeight;
            record.index = $(record.currentDom[0]).index();
            var parentH = $(record.currentDom[0]).parent().height();
            if(record.index == 0){
                record.canTransMin = 0;
                record.canTransMax = parentH - record.offsetHeight;
            }else if(record.index == record.domLength-1){
                record.canTransMin = -(parentH-record.offsetHeight);
                record.canTransMax = 0;
            }else{
                var minH = 0; 
                for(var j=0;j<record.index;j++){
                    minH += arrH[j];
                }
                record.canTransMin = -minH;
                var maxH = 0;
                for(var m=record.index+1;m<record.domLength;m++){
                    maxH += arrH[m];
                }
                record.canTransMax = maxH;
            }
        }
        //鼠标移动事件
        var mousemoveFun = function(e){
            if($(e.target).attr('type') == 'range'){
                return;
            }
            var x = e.clientX;
            var y = e.clientY;
            record.countMove++;
            if(record.countMove > 3){
                if(record.isDrag){
                    _this.css('transition','all .1s');
                    var transY = (y-record.y);
                    if(transY <= record.canTransMin){
                        transY = record.canTransMin;
                    }else if(transY >= record.canTransMax){
                        transY = record.canTransMax;
                    }
                    record.currentDom[0].style.boxShadow = '0 0 1px 1px #ccc';
                    record.currentDom[0].style.transform = 'translate3d(0px,'+ transY +'px,0px) scale(1)';
                    record.currentDom[0].style.position = 'relative';
                    record.currentDom[0].style.zIndex = 2;
                    for(var i=0;i<record.domLength;i++){
                        if(transY >= 0){
                            var moveH = 0;
                            for(var j = record.index+1;j<record.domLength;j++){
                                var base = _this.eq(j).height();//下一个元素高度
                                if(transY > base/2+moveH && transY < base+moveH){
                                    record.wellDom = _this.eq(j);
                                    record.wellDom[0].style.transform = 'translate3d(0px,-'+ _this.eq(record.index).height() +'px,0px)';
                                }
                                if(transY < moveH + base/2 && transY > moveH){
                                    record.wellDom = _this.eq(j);
                                    record.wellDom[0].style.transform = 'translate3d(0px,'+ 0 +'px,0px)';
                                }
                                moveH += _this.eq(j).height();
                            }
                        }else{
                            var moveH1 = 0;
                             for(var m=record.index-1;m >= 0;m--){
                                var base = _this.eq(m).height();//上一个元素高度
                                if(transY < moveH1 - base/2 && transY > moveH1 - base){
                                    record.wellDom = _this.eq(m);
                                    record.wellDom[0].style.transform = 'translate3d(0px,'+ _this.eq(record.index).height() +'px,0px)';
                                }else if(transY > moveH1 - base/2 && transY < moveH1){
                                    record.wellDom = _this.eq(m);
                                    record.wellDom[0].style.transform = 'translate3d(0px,0px,0px)';
                                }
                                moveH1 -= _this.eq(m).height();
                            }
                        }
                    }
                }
            }
            // e.preventDefault();
        }
        //鼠标松开按钮的时候
        var mouseupFun = function(e){
            if($(e.target).attr('type') == 'range'){
                return;
            }
            if(record.isDrag){
                if(!record.wellDom){
                    record.isDrag = false;
                    _this.removeAttr('style');
                }else{
                    var currClone = record.currentDom.clone();
                    var wellClone = record.wellDom.clone();
                    var currIndex = record.currentDom.find('div').eq(0).attr('index');
                    var WellIndex = record.wellDom.find('div').eq(0).attr('index');
                    if(WellIndex > currIndex){
                        record.wellDom.after(currClone);
                        record.currentDom.remove();
                    }else{
                        record.wellDom.before(currClone);
                        record.currentDom.remove();
                    }
                    record.currentDom.removeClass('drag-bg');
                    if(parm.callback){
                        parm.callback(currIndex,WellIndex);
                    }
                    callear.call($(parm.obj),parm);
                    // e.preventDefault();
                }
            }
        }
        //循环数组
        if(!!defaultParm.stop){
            this.each(function () {
                var arrObj = $(this);
                if(!!defaultParm.handle){
                    arrObj = $(this).find(defaultParm.handle).eq(0);
                }
                arrObj.unbind('mousedown');
                $(window).unbind('mousemove');
                $(window).unbind('mouseup');
            });
        }else{
            this.each(function(i){
                var arrObj = $(this);
                if(!!defaultParm.handle){
                    arrObj = $(this).find(defaultParm.handle).eq(0);
                }
                //事件绑定
                arrObj.unbind('mousedown');
                arrObj.bind('mousedown',mousedownFun);
                $(window).unbind('mousemove');
                $(window).bind('mousemove',mousemoveFun);
                $(window).unbind('mouseup');
                $(window).bind('mouseup',mouseupFun);
            });
        }
        return this;
    }
})( jQuery, window, document);