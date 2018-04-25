/**
 * @author gangwu3
 * 
 */
(function(win) {
	win.Login = win.Login || {};

	var baseUrl = $("#hd_ctx").val();
	// 登录
	Login.login = function() {
		var loginname = $.trim($("#loginname").val());
		var password = $.trim($("#password").val());
		if (!loginname || !password) {
			$(".login-tips").html("请输入相关登录信息!");
			return false;
		}
		$.post(baseUrl + '/login', {
			name : loginname,
			passwd : password
		}, function(data) {
			if (data.result == true) {
				window.location.href = baseUrl + data.message;
			} else {
				$(".login-tips").html("登录名或密码错误！");
			}
		}).error(function() {
		});
	}
	
	jQuery.fn.placeholder = function(){
	    var i = document.createElement('input'),        
	    placeholdersupport = 'placeholder' in i;    
	    if(!placeholdersupport){
	        var inputs = jQuery(this);        
	        inputs.each(function(){            
	            var input = jQuery(this),                
	            text = input.attr('placeholder'),                
	            pdl = 0,                
	            height = input.outerHeight(),                
	            width = input.outerWidth(),                
	            placeholder = jQuery('<span class="phTips">'+text+'</span>');
	            try{                
	                pdl = input.css('padding-left').match(/\d*/i)[0] * 1;
	            }catch(e){
	                pdl = 5;            
	            }            
	            placeholder.css({
	                'margin-left': 30,
	                'margin-top': -40,
	                'height':height,
	                'line-height':height+"px",
	                'position':'absolute', 
	                'color': "#cecfc9",
	                'font-size' : "12px"
	            });
	            placeholder.click(function(){
	                input.focus();            
	            });            
	            if(input.val() != ""){
	                placeholder.css({display:'none'});            
	            }else{                
	                placeholder.css({display:'inline'});            
	            }            
	            placeholder.insertAfter(input);            
	            input.keyup(function(e){                
	                if(jQuery(this).val() != ""){
	                    placeholder.css({display:'none'});
	                }else{
	                    placeholder.css({display:'inline'});
	                }            
	            });        
	        });    
	    }    
	    return this;
	    };

	$(function() {
		baseUrl = $("#hd_ctx").val();
		
		jQuery('input[placeholder]').placeholder();

		$("body").undelegate("#loginBtn", "click").delegate("#loginBtn",
				"click", function() {
					Login.login();
				})
		$("#loginname").keypress(function(event) {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode == '13') {
				Login.login();
			}
		});

		$("#password").keypress(function(event) {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode == '13') {
				Login.login();
			}
		});
	});

})(window);