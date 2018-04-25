/*
	*  模板系统 MPT
	*/
	var $$ = window;
    $$.MPT = new function() {
   		/*
   		* 存储模板的对象
		* 结构：{
			actionName:fnname 这里保存的是指针 调用的时候传dom对象
		}
   		*/
        var tmplobj = {};
        /*
			*  事件绑定
			*  elm 要绑定事件的dom元素
			*  eventName 事件名
			*  fn 需要执行的方法
		*/
        $$.bind = this.bind = function(elm, eventName, fn) {
	        if (elm.attachEvent) {
	            elm.attachEvent("on" + eventName, fn);
	        } else {
	            elm.addEventListener(eventName, fn, false);
	        }
	    };
	    /*
	    *  模板的入口方法
	    *  actionName 入口方法名
	    *  fn 需要执行的方法
	    */
        this.addAction = function(actionName, fn) {
            if (tmplobj[actionName]) {
                alert("[错误]您新增的动作名已经存在！");
                return;
            } else {
                tmplobj[actionName] = fn;
            }
        };
        /*
        *  执行模板的入口方法
        *  elm 需要执行方法dom元素
        */
        this.excAction = function(elm) {
            var actionArr = getElmAction(elm);
            for (var i = 0; i < actionArr.length; i++) {
            	//执行方法  actionName(elm);
                tmplobj[actionArr[i]["action_name"]](actionArr[i]["element"]);
            }
        };
    	/*
    	*  获取绑定入口方法的elm元素
    	*  elm 在哪一个父元素查找
    	*  返回值 数组 包含入口方法名和包含入口方法的dom元素
    	*/
        var getElmAction = function(elm) {
            var elmArr = [];
            if (elm.getElementsByClassName) {
                var domArr = elm.getElementsByClassName("mpt");
            } else {
                var domArr = elm.getElementsByTagName("*");
            }
            var domArrL = domArr.length;
            for (var i = 0; i < domArrL; i++) {
                var className = domArr[i].getAttribute("class") || domArr[i].getAttribute("classname");
                if (!className) {
                    continue;
                }
                var pattern = /\sa_(\w+)/;
                var clanaFil = className.match(pattern);
                if (clanaFil && clanaFil[1]) {
                    if (tmplobj[clanaFil[1]]) {
                        elmArr.push({
                            action_name: clanaFil[1],
                            element: domArr[i]
                        });
                    } else {
                        alert("[错误]动作列表中未找到" + clanaFil[1] + "方法");
                    }
                }
            }
            return elmArr;
        };
		/*
			结构{
				//模板名：回调模板函数
				tmplName:fnName（需要生成模板的函数返回拼接的html）这里只保留指针
			}
		*/
        var saveTmplD = {};//存储模板对象
        /*
       	* 添加模板
		* tmplName 模板名
		* fnName  绑定的回调函数（指针地址）
        */
        this.addTmpl = function(tmplName, fnName) {
            judgeTmname(saveTmplD, tmplName, 'addTmpl("' + tmplName + '", ...) 添加模板重名！',function() {
                saveTmplD[tmplName] = fnName;
            });
        };
        /*
        *	获取模板
		*   tmplName 获取的模板名
		*   bindData 模板绑定的数据 对象格式
        */
        this.getTmpl = function(tmplName, bindData) {
            return saveTmplD[tmplName]((!bindData ? {}: bindData));
        };
        /*
        * 判断添加模板的名称是否重复
        * saveTmplD 保存模板名及模板函数的对象
        * tmplName  模板名称
        * errorMsg  错误提示
        * fn 如果不重名需要执行的方法
        */
        var judgeTmname = function(saveTmplD, tmplName, errorMsg, fn) {
            if (saveTmplD.hasOwnProperty(tmplName)) {
                throw errorMsg;
                return;
            } else {
                fn();
            }
        }
    };
    /*默认执行页面绑定入口的方法*/
    $$.MPT.bind($$, "load",function() {
        $$.MPT.excAction(document);
    });