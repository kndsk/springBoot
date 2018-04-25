/*
 Equation Editor Plugin for CKEditor v4
 Version 1.4

 This plugin allows equations to be created and edited from within CKEditor.
 For more information goto: http://www.codecogs.com/latex/integration/ckeditor_v4/install.php

 Copyright CodeCogs 2006-2013
 Written by Will Bateman.

 Special Thanks to:
  - Kyle Jones for a fix to allow multiple editor to load on one page
*/
window.CCounter=0;
CKEDITOR.dialog.add( 'eqneditorDialog', function(editor)
{
	var http = ('https:' == document.location.protocol ? 'https://' : 'http://');
	window.CCounter++;

	return {
		//title : editor.lang.eqneditor.title,
		title:"公式编辑器",
		minWidth : 500,
		minHeight : 200,
		resizable: CKEDITOR.DIALOG_RESIZE_NONE,
		contents : [
			{
				id : 'CCEquationEditor',
				label : 'EqnEditor',
				elements : [
				            /*
	  			{
							type: 'html',
							html: '<div id="CCtoolbar'+window.CCounter+'"></div>',
							style: 'margin-top:-9px'
					},*/
					{
						id: 'texCodeKeyBtn',
						type: 'html',
						html: 	
					'<div class="equation_sel">'+
	            	'		<div class="editor1">'+
	            	'	        <table>'+
	            	'	           <tr>'+
	            	'	                <td onclick="insertAtCursor(this,0)"><i class="formula1"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,1)"><i class="formula2"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,2)"><i class="formula3"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,3)"><i class="formula4"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,4)"><i class="formula5"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,5)"><i class="formula6"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,6)"><i class="formula7"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,7)"><i class="formula8"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,8)"><i class="formula9"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,9)"><i class="formula10"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,10)"><i class="formula11"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,11)" class="width1"><i class="formula12"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,12)" class="width2"><i class="formula13"></i></td>'+
	            	'	                <td onclick="insertAtCursor(this,13)" class="width2"><i class="formula14"></i></td>'+
	            	'	           </tr>'+
	            	'	       </table>'+
				    '        </div>'+
				    '        <div class="editor2 clearfix">'+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∞</a>'+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">±</a>'+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">≤</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">≥</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">≠</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∩</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∪</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">¬</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∋</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∈</a>  '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∃</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∧</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∀</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">≈</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">≅</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∫</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">°</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">℃</a>  '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">℉</a>  '+
				    '        </div>                                              '+
				    '        <div class="editor2 clearfix">                      '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">α</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">β</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">γ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">δ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">ε</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">ζ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">η</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">θ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">ϑ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">λ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">μ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">ξ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">o</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">ρ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">φ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">Φ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">Ψ</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">ω</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">Ω</a>    '+
				    '        </div>                                              '+
				    '        <div class="editor2 pl75 clearfix">                      '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∠</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∵</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∴</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">⊥</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">‖</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">⊙</a>   '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">□</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">■</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">△</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">≡</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">≅</a>    '+
				    '            <a onclick="insertAtCursor(this,36)" class="" href="javascript:void(0);">∼</a>    '+
				    '        </div>                                              '+
				    '    </div>                                                  '
							
					},
					/*
					{
							type: 'html',
							html: '<label for="CClatex'+window.CCounter+'" style="display:none;">Equation (LaTeX):</label>',
					},
					*/
					{
							type: 'html',
							html: '<textarea id="CClatex'+window.CCounter+'" rows="3"></textarea>',
							style:'border:1px solid #8fb6bd; width:500px;height:60px; font-size:16px; padding:5px; background-color:#ffc',
					},
					/*
					{
						 	type: 'html',
							html: '<label for="CCequation'+window.CCounter+'" style="display:none;">Preview:</label>'
					},
					*/
					{
							type :'html',
							html: '<div style="position:absolute;display:none; left:5px; bottom:0; z-index:999"><a href="http://www.codecogs.com" target="_blank"><img src="'+http+'latex.codecogs.com/images/poweredbycc.gif" data-latex="Powered by CodeCogs" style="vertical-align:-4px; border:none"/></a> &nbsp; <a href="http://www.codecogs.com/latex/about.php" target="_blank">About</a> | <a href="http://www.codecogs.com/latex/popup.php" target="_blank">Install</a> | <a href="http://www.codecogs.com/pages/forums/forum_view.php?f=28" target="_blank">Forum</a> | <a href="http://www.codecogs.com" target="_blank">CodeCogs</a> &copy; 2007-2014</div><div style="text-align:center;"> <img id="CCequation'+window.CCounter+'" src="'+http+'www.codecogs.com/images/spacer.gif" style="margin-top: 10px;" /></div>'
					}
					
				]
			}
		],

		onLoad : function() {
			
		},

		onShow : function() {
			//EqEditor.embed('CCtoolbar'+window.CCounter,'','efull');
 			//EqEditor.add(new EqTextArea('CCequation'+window.CCounter, 'CClatex'+window.CCounter),false);
			var count =$("textarea:visible").attr("id").substr(7);
			EqEditor.embed('CCtoolbar'+count,'','efull');
 			EqEditor.add(new EqTextArea('CCequation'+count, 'CClatex'+count),false);
			var dialog = this,
				  sel = editor.getSelection(),
				  image = sel.getStartElement().getAscendant('img',true);

			// has the users selected an equation. Make sure we have the image element, include itself
			if(image)
			{
//				var sName = image.getAttribute('src').match( /(gif|svg)\.latex\?(.*)/ );
//				if(sName!=null) EqEditor.getTextArea().setText(sName[2]);
				
//				var sName = image.getAttribute('src').match(  /latex\?(.*)/  );
//				if(sName!=null) EqEditor.getTextArea().setText(sName[1]);
				
				var sName = image.getAttribute('data-latex');
				if(sName!=null) EqEditor.getTextArea().setText(sName);
				
				dialog.insertMode = true;
			}else{
				
				 	//EqEditor.getTextArea().setText("");		
					dialog.insertMode = true;
//					var count =$("textarea:visible").attr("id").substr(7);
//					EqEditor.embed('CCtoolbar'+count,'','efull');
//		 			EqEditor.add(new EqTextArea('CCequation'+count, 'CClatex'+count),false);
			}

			// set-up the field values based on selected or newly created image
			dialog.setupContent( dialog.image );
		},

		onOk : function() {
			var eqn = editor.document.createElement( 'img' );
			//eqn.setAttribute( 'data-latex', EqEditor.getTextArea().getLaTeX());
			eqn.setAttribute( 'data-latex', encodeURI(EqEditor.getTextArea().getLaTeX()).replace(/\+/g, '&plus;'));
			eqn.setAttribute( 'src', EqEditor.getTextArea().exportEquation('urlencoded'));
			editor.insertElement(eqn);
			Example.add_history(EqEditor.getTextArea().getLaTeX());
		}
	};
});



//wqyan 扩展
    $.fn.setCursorPosition = function(option) {
		var settings = $.extend({
			index: 0
		}, option)
		return this.each(function() {
			var elem  = this
			var val   = elem.value
			var len   = val.length
			var index = settings.index
	 
			// 非input和textarea直接返回
			var $elem = $(elem)
			if (!$elem.is('input,textarea')) return
			// 超过文本长度直接返回
			if (len < index) return
	 
			setTimeout(function() {
				elem.focus()
				if (elem.setSelectionRange) { // 标准浏览器
					elem.setSelectionRange(index, index)   
				} else { // IE9-
					var range = elem.createTextRange()
					range.moveStart("character", -len)
					range.moveEnd("character", -len)
					range.moveStart("character", index)
					range.moveEnd("character", 0)
					range.select()
				}
			}, 10)
		})
    }
	
	function getCursortPosition (ctrl) {
		var CaretPos = 0;   // IE Support
		if (document.selection) {
		ctrl.focus ();
			var Sel = document.selection.createRange ();
			Sel.moveStart ('character', -ctrl.value.length);
			CaretPos = Sel.text.length;
		}
		// Firefox support
		else if (ctrl.selectionStart || ctrl.selectionStart == '0')
			CaretPos = ctrl.selectionStart;
		return (CaretPos);
    }

var cursorIndex =0;

function  insertAtCursor(dom,texCodeIndex){
	
	console.log(dom);
	console.log($(dom).parents("table").find("textarea").val());
		//var codeValue ="\\"+$(dom).attr("data-value")+" ";
	    var codeValue ;
		if(texCodeIndex ==36){
			 codeValue =$(dom).html();
		}else{
			codeValue =texCodeArray[texCodeIndex];
		}
		
		var len = codeValue.length;
		var textInput =$(dom).parents("table").find("textarea");
		cursorIndex=getCursortPosition(textInput[0]);
		var oldValue =textInput.val();
		var newValue ="";
		var strArray = oldValue.split("");
		if(oldValue.length!=0){
			for(var i=0;i<strArray.length;i++){
				if(i+1==cursorIndex){
					newValue += strArray[i];
					newValue += codeValue;
				}else{
					newValue += strArray[i];
				}
							
			}
		}else{
			newValue += codeValue;
		}

		cursorIndex += len;
		
		textInput.val(newValue);
		
		textInput.setCursorPosition({index:cursorIndex+1});
		EqEditor.textchanged();
        EqEditor.autorenderEqn(10);
	//$("textarea").click();
	
}

