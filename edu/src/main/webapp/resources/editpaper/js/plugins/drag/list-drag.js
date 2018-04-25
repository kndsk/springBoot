/*
    autor : zyshi
    time : 2016-8-16
    版本1.0.0
*/
;(function( $, window, document, undefined ){
    //入口
    $.fn.drag = function(parm,callback){
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
            marginB:0,
            wellDom:null
        };
        var _this = this;
        _this.removeAttr('style');
        record.domLength = _this.length;
        //默认配置
        var defaultParm = {
            'handle':null
        };
        if(parm){
            $.extend(true,defaultParm,parm);
        }
        //按下鼠标处理事件
        var mousedownFun = function(e){
            record.x = e.clientX;
            record.y = e.clientY;
            record.isDrag = true;
            if(!!defaultParm.handle){
                record.currentDom = $(e.target).parent();
            }else{
                record.currentDom = $(e.target);
            }
            record.offsetWidth = record.currentDom[0].offsetWidth;
            record.offsetHeight = record.currentDom[0].offsetHeight;
            record.index = $(record.currentDom[0]).index();
            record.marginB = parseInt($(record.currentDom[0]).css('margin-bottom'));
            var parentH = $(record.currentDom[0]).parent().height();
            if(record.index == 0){
                record.canTransMin = 0;
                record.canTransMax = parentH - record.offsetHeight;
            }else if(record.index == record.domLength-1){
                record.canTransMin = -(record.marginB+record.offsetHeight)*(record.domLength-1);
                record.canTransMax = 0;
            }else{
                record.canTransMin = -(record.marginB+record.offsetHeight)*record.index;
                record.canTransMax = (record.marginB+record.offsetHeight)*(record.domLength-record.index-1);
            }
            record.currentDom[0].style.transform = 'scale(1.05)';
            record.currentDom[0].style.boxShadow = '0 0 1px 1px #ccc';
            _this.css('transition','all .1s');
            e.preventDefault();
        }
        //鼠标移动事件
        var mousemoveFun = function(e){
            var x = e.clientX;
            var y = e.clientY;
            if(record.isDrag){
                var transY = (y-record.y);
                if(transY <= record.canTransMin){
                    transY = record.canTransMin;
                }else if(transY >= record.canTransMax){
                    transY = record.canTransMax;
                }
                record.currentDom[0].style.transform = 'translate3d(0px,'+ transY +'px,0px)';
                record.currentDom[0].style.position = 'relative';
                record.currentDom[0].style.zIndex = 2;
                var base = record.marginB+record.offsetHeight;
                for(var i=0;i<record.domLength;i++){
                    if(transY >= 0){
                        if(transY > base*i + base/2 && transY < (base*i + base)){
                            record.wellDom = _this.eq(i+record.index+1);
                            record.wellDom[0].style.transform = 'translate3d(0px,-'+ base +'px,0px)';
                        }else if(transY < base*i + base/2 && transY > base*i){
                            record.wellDom = _this.eq(i+record.index+1);
                            record.wellDom[0].style.transform = 'translate3d(0px,0px,0px)';
                        }
                    }else{
                        if(transY < -base*i - base/2 && transY > -base*i - base){
                            record.wellDom = _this.eq(record.index-i-1);
                            record.wellDom[0].style.transform = 'translate3d(0px,'+ base +'px,0px)';
                        }else if(transY > -base*i - base/2 && transY < -base*i){
                            record.wellDom = _this.eq(record.index-i-1);
                            record.wellDom[0].style.transform = 'translate3d(0px,0px,0px)';
                        }
                    }
                }
                
            }
            // e.preventDefault();
        }
        //鼠标松开按钮的时候
        var mouseupFun = function(e){
            if(record.isDrag){
            	if(!record.wellDom){
            		record.isDrag = false;
            		record.currentDom.removeAttr('style');
            		 // e.preventDefault();
            	}else{
	                var currClone = record.currentDom.clone();
	                var wellClone = record.wellDom.clone();
	                var currIndex = record.currentDom.index();
	                var WellIndex = record.wellDom.index();
	                record.currentDom.after(wellClone);
	                record.wellDom.after(currClone);
	                var parent = record.currentDom.parent();
	                record.wellDom.remove();
	                record.currentDom.remove();
	                callear.call(parent.children(),parm);
                    record = null;
                    callback && callback();
            	}
            }
        }
        //循环数组
        this.each(function(i){
            var arrObj = $(this);
            if(!!defaultParm.handle){
                arrObj = $(this).find(defaultParm.handle).eq(0);
            }
            //事件绑定
            arrObj.unbind('mousedown');
            arrObj.bind('mousedown',mousedownFun);
            $('body').unbind('mousemove');
            $('body').bind('mousemove',mousemoveFun);
            $('body').unbind('mouseup');
            $('body').bind('mouseup',mouseupFun);
        });
        return this;
    }
})( jQuery, window, document);