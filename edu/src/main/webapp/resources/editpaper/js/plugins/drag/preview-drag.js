/*
    autor : zyshi
    time : 2016-8-25
    版本1.0.2
*/
;(function( $, window, document, undefined ){
    var dragList = this.dragList = function(elm){
        return elm;
    }
    dragList.record = null;
    dragList.mousemove = function(e){
        if($(e.target).attr('type') == 'range' || !dragList.record){
            return;
        }
        if(dragList.record.type == 'mouseleave'){
            //鼠标移动事件
            var x = e.clientX;
            var y = e.clientY;
            if(dragList.record.isDrag){
                var transY = (y-dragList.record.y);
                var transX = (x-dragList.record.x);
                var moveY = (y-dragList.record.y);
                if(transY <= dragList.record.canTransMin){
                    transY = dragList.record.canTransMin;
                }else if(transY >= dragList.record.canTransMax){
                    transY = dragList.record.canTransMax;
                }
                dragList.record.currentDom[0].style.transform = 'translate3d('+ transX +'px,'+ moveY +'px,0px)';
                dragList.record.currentDom[0].style.position = 'relative';
                dragList.record.currentDom[0].style.zIndex = 2;
                var base = dragList.record.marginB+dragList.record.offsetHeight;
                if(transX > dragList.record.offsetWidth/2){
                    dragList.record.isDragLeave = true;
                }else{
                    dragList.record.isDragLeave = false;
                }
                for(var i=0;i<dragList.record.domLength;i++){
                    if(transY >= 0){
                        if(transY > base*i + base/2 && transY < (base*i + base)){
                            dragList.record.wellDom = dragList.record.domArr.eq(i+dragList.record.index+1);
                            dragList.record.wellDom[0].style.transform = 'translate3d(0px,-'+ base +'px,0px)';
                        }else if(transY < base*i + base/2 && transY > base*i){
                            dragList.record.wellDom = dragList.record.domArr.eq(i+dragList.record.index+1);
                            dragList.record.wellDom[0].style.transform = 'translate3d(0px,0px,0px)';
                        }
                    }else{
                        if(transY < -base*i - base/2 && transY > -base*i - base){
                            dragList.record.wellDom = dragList.record.domArr.eq(dragList.record.index-i-1);
                            dragList.record.wellDom[0].style.transform = 'translate3d(0px,'+ base +'px,0px)';
                        }else if(transY > -base*i - base/2 && transY < -base*i){
                            dragList.record.wellDom = dragList.record.domArr.eq(dragList.record.index-i-1);
                            dragList.record.wellDom[0].style.transform = 'translate3d(0px,0px,0px)';
                        }
                    }
                }
                
            }
        }else{
            var x = e.clientX;
            var y = e.clientY;
            if(dragList.record.isDrag){
                var transY = (y-dragList.record.y);
                var transX = (x - dragList.record.x);
                dragList.record.currentDom[0].style.transform = 'translate3d('+ transX +'px,'+ transY +'px,0px)';
                dragList.record.currentDom[0].style.position = 'relative';
                dragList.record.currentDom[0].style.zIndex = 2;
            }
        }
        // e.preventDefault();
    };
    dragList.mouseup = function(e){
        if(!dragList.record){
            return;
        }
        if(dragList.record.type == 'mouseleave'){
            if(dragList.record.isDrag){
                if(dragList.record.isDragLeave){
                    var currClone = dragList.record.currentDom.clone();
                    var currIndex = dragList.record.currentDom.index();
                    var parent = dragList.record.currentDom.parent();
                    dragList.record.currentDom.remove();
                    parent.children().dragLeave(dragList.record.parm);
                    dragList.record.parm.rightDom.append(currClone);
                    dragList.record.parm.rightDom.children().dragNew(dragList.record.parm);
                }else{
                    if(dragList.record.domLength <= 1){
                        dragList.record.currentDom.removeAttr('style');
                        return false;
                    }
                    var currClone = dragList.record.currentDom.clone();
                    var wellClone = dragList.record.wellDom.clone();
                    var currIndex = dragList.record.currentDom.index();
                    var WellIndex = dragList.record.wellDom.index();
                    //此处开始颠倒顺序
                    dragList.record.currentDom.after(wellClone);
                    dragList.record.wellDom.after(currClone);
                    var parent = dragList.record.currentDom.parent();
                    dragList.record.wellDom.remove();
                    dragList.record.currentDom.remove();
                    parent.children().dragLeave(dragList.record.parm);
                }
            }
        }else{
            if(dragList.record.isDrag && dragList.record.canDrag){
                var currClone = dragList.record.currentDom.clone();
                currClone.removeAttr('style');
                currClone.unbind('mousedown');
                dragList.record.currentDom.remove();
                dragList.record.leftDom.append(currClone);
                dragList.record.leftDom.children().dragLeave(dragList.record.parm);
            }else{
                if(!!dragList.record.currentDom){
                    dragList.record.currentDom.removeAttr('style');
                }
            }
        }
        dragList.record = null;
        // e.preventDefault();
    }

    $.fn.dragLeave = function(parm){
        var _this = this;
        _this.removeAttr('style');
        //默认配置
        var defaultParm = {'handle':null};
        if(parm)
            $.extend(true,defaultParm,parm);
        //按下鼠标处理事件
        var mousedownFun = function(e){
            dragList.record = {
                x:0,
                y:0,
                offsetWidth:0,
                offsetHeight:0,
                isDrag:true,
                currentDom:null,
                index:0,
                domLength:0,
                canTransMin:0,
                canTransMax:0,
                marginB:0,
                wellDom:null,
                isDragLeave:false,
                type:'mouseleave',
                parm:parm,
                domArr:_this
            };
            dragList.record.domLength = _this.length;
            dragList.record.x = e.clientX;
            dragList.record.y = e.clientY;
            dragList.record.isDrag = true;
            if(!!defaultParm.handle){
                dragList.record.currentDom = $(e.target).parent();
            }else{
                dragList.record.currentDom = $(e.target);
            }
            dragList.record.offsetWidth = dragList.record.currentDom[0].offsetWidth;
            dragList.record.offsetHeight = dragList.record.currentDom[0].offsetHeight;
            dragList.record.index = $(dragList.record.currentDom[0]).index();
            dragList.record.marginB = parseInt($(dragList.record.currentDom[0]).css('margin-bottom'));
            var parentH = (dragList.record.offsetHeight+dragList.record.marginB)*dragList.record.domLength - dragList.record.marginB;
            if(dragList.record.index == 0){
                dragList.record.canTransMin = 0;
                dragList.record.canTransMax = parentH - dragList.record.offsetHeight;
            }else if(dragList.record.index == dragList.record.domLength-1){
                dragList.record.canTransMin = -(dragList.record.marginB+dragList.record.offsetHeight)*(dragList.record.domLength-1);
                dragList.record.canTransMax = 0;
            }else{
                dragList.record.canTransMin = -(dragList.record.marginB+dragList.record.offsetHeight)*dragList.record.index;
                dragList.record.canTransMax = (dragList.record.marginB+dragList.record.offsetHeight)*(dragList.record.domLength-dragList.record.index-1);
            }
            dragList.record.currentDom[0].style.transform = 'scale(1.05)';
            dragList.record.currentDom[0].style.boxShadow = '0 0 1px 1px #ccc';
            _this.css('transition','all .1s');
            // e.preventDefault();
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
        });
        return this;
    }

    //左右拖拽入口
    $.fn.dragNew = function(parm){
        var _this = this;
            canFlag = false;
        _this.removeAttr('style');
        //按下鼠标处理事件
        var mousedownFun = function(e){
            dragList.record = {
                x:0,
                y:0,
                isDrag:false,
                currentDom:null,
                index:0,
                domLength:0,
                leftDomW:0,
                leftDomH:0,
                leftDomL:0,
                leftDomT:0,
                canDrag:true,
                leftDom:parm.leftDom,
                handle:parm.handle,
                parm:parm,
                type:'mousenew'
            };
            dragList.record.domLength = _this.length;
            if(dragList.record.parm){
                $.extend(true,dragList.record,parm);
            }
            if(dragList.record.parm.listNum - dragList.record.parm.rightDom.children().length >= dragList.record.parm.maxNum){
                return false;
            }
            dragList.record.x = e.clientX;
            dragList.record.y = e.clientY;
            dragList.record.isDrag = true;
            if(!!dragList.record.handle){
                dragList.record.currentDom = $(e.target).parent();
            }else{
                dragList.record.currentDom = $(e.target);
            }
            dragList.record.marginB = parseInt($(dragList.record.currentDom[0]).css('margin-bottom'));
            var parentH = $(dragList.record.currentDom[0]).parent().height();
            dragList.record.currentDom[0].style.transform = 'scale(1.05)';
            dragList.record.currentDom[0].style.boxShadow = '0 0 1px 1px #ccc';
            _this.css('transition','all .1s');
            dragList.record.leftDomW = dragList.record.leftDom.width();
            dragList.record.leftDomH = dragList.record.leftDom.height();
            dragList.record.leftDomL = dragList.record.leftDom.offset().left;
            dragList.record.leftDomT = dragList.record.leftDom.offset().top;
            if(e.clientX > dragList.record.leftDomL && e.clientY > dragList.record.leftDomT && e.clientX < (dragList.record.leftDomL+dragList.record.leftDomW) && e.clientY < (dragList.record.leftDomT+dragList.record.leftDomH)){
                dragList.record.canDrag = true;
            }
            dragList.record.canDrag = true;
            // e.preventDefault();
        }
        //循环数组
        this.each(function(i){
            var arrObj = $(this);
            if(!!parm.handle){
                arrObj = $(this).find(parm.handle).eq(0);
            }
            //事件绑定
            arrObj.unbind('mousedown');
            arrObj.bind('mousedown',mousedownFun);
        });
        return this;
    }

    $(document).bind('mousemove',dragList.mousemove);
    $(document).bind('mouseup',dragList.mouseup);
})( jQuery, window, document);