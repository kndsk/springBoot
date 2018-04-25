MPT.addTmpl('t_tmplete_dialog',function(data){
    var a = [];
	a.push('<div class="dialog-box">');
	a.push('<div class="tab-box">');
	if(data.paperItemDTO.type === 2 || data.paperItemDTO.type === 5 ){
		a.push('<span class="show-logic tab-selected" type="show">显示逻辑设置</span>');
	}else{
		a.push('<span type="site" class="tab-selected">跳转逻辑设置</span>');
		a.push('<span class="show-logic" type="show">显示逻辑设置</span>');
	}
	a.push('</div>');
	// 设置逻辑
	a.push('  <div class="site-wrapper">');
	a.push('    <input id="code" type="hidden" value="'+data.paperItemDTO.id+'">');
	a.push('    <div class="left-panple">');
	a.push('      <label>当用户选择本项:</label>');
	a.push('      <ul>');
	if(!!data.jumpLogic){
		for(var i = 0;i < data.paperItemDTO.options.length;i++){
			var flag = false;
			if (i == 0){
				a.push('<li class="sigle-option selected" name="'+data.paperItemDTO.options[i].name+'">'+data.paperItemDTO.options[i].name+'.'+data.paperItemDTO.options[i].value+'</li>');
			}else{
			   a.push('<li class="sigle-option" name="'+data.paperItemDTO.options[i].name+'">'+data.paperItemDTO.options[i].name+'.'+data.paperItemDTO.options[i].value+'</li>');
			}
		}
	}else{
		for(var n=0;n<data.paperItemDTO.options.length;n++){
			a.push('<li class="sigle-option" name="'+ data.paperItemDTO.options[n].name +'">'+ data.paperItemDTO.options[n].name +'.'+ data.paperItemDTO.options[n].value +'</li>');
		}
	}
	a.push('      </ul>');
	a.push('</div>');
	for(var i=0;i<data.paperItemDTO.options.length;i++){
		if(i == 0){
			a.push('<div class="right-panple show">');
		}else{
			a.push('<div class="right-panple">');
		}
		a.push('	<label>显示题目:</label>');
		a.push('	<ul class="fl main-ul">');
		if(data.jumpLogic != null){
			for(var j=0;j<data.paperItemDTOList.length;j++){
				var flag = false;
				for(var m=0;m<data.jumpLogic.sts.length;m++){
					 if(data.paperItemDTOList[j].id === data.jumpLogic.sts[m].targetQuestionNumber && i === m){
						a.push('<li class="sigle-theme selected">');
						a.push('<span targetId="'+ data.paperItemDTOList[j].id +'"></span>');
						a.push(data.paperItemDTOList[j].questionTitle);
						a.push('</li>');
						flag = true;
					 }
				}
				if(!flag){
					a.push('<li class="sigle-theme">');
					a.push('<span targetId="'+ data.paperItemDTOList[j].id +'"></span>');
					a.push(data.paperItemDTOList[j].questionTitle);
					a.push('</li>');
				}
			}
		}else{
			for(var j=0;j<data.paperItemDTOList.length;j++){
				a.push('<li class="sigle-theme">');
				a.push('<span targetId="'+ data.paperItemDTOList[j].id +'"></span>');
				a.push(data.paperItemDTOList[j].questionTitle);
				a.push('</li>');
			}
		}
		a.push('</ul>');
		a.push('</div>');
	}
	a.push('  </div>');
	// 显示逻辑
	a.push('  <div class="show-wrapper" style="display:none">');
	a.push('    <input id="code" type="hidden" value="'+data.paperItemDTO.id+'">');
	a.push('    <div class="left-panple">');
	a.push('      <label>当用户选择本项:</label>');
	a.push('      <ul>');
	if(!!data.displayLogic){
		for(var i = 0;i < data.paperItemDTO.options.length;i++){
			if (i == 0){
				a.push('<li class="sigle-option selected" name="'+data.paperItemDTO.options[i].name+'">'+data.paperItemDTO.options[i].name+'.'+data.paperItemDTO.options[i].value+'</li>');
			}else{
			   a.push('<li class="sigle-option" name="'+data.paperItemDTO.options[i].name+'">'+data.paperItemDTO.options[i].name+'.'+data.paperItemDTO.options[i].value+'</li>');
			}
		}
	}else{
		for(var n=0;n<data.paperItemDTO.options.length;n++){
			a.push('<li class="sigle-option" name="'+ data.paperItemDTO.options[n].name +'">'+ data.paperItemDTO.options[n].name +'.'+ data.paperItemDTO.options[n].value +'</li>');
		}
	}
	a.push('      </ul>');
	a.push('</div>');
	for(var i=0;i<data.paperItemDTO.options.length;i++){
		if(i == 0){
			a.push('<div class="right-panple show">');
		}else{
			a.push('<div class="right-panple">');
		}
		a.push('	<label>显示题目:</label>');
		a.push('	<ul class="fl main-ul">');
		if(data.displayLogic != null){
			for(var j=0;j<data.paperItemDTOList.length;j++){
				var flag = false;
				for(var m=0;m<data.displayLogic.displayQN.length;m++){
					for(var n=0;n<data.displayLogic.displayQN[m].qn.length;n++)
					 if(data.paperItemDTOList[j].id === data.displayLogic.displayQN[m].qn[n].targetQuestionNumber && i === m){
						a.push('<li class="sigle-theme selected">');
						a.push('<span targetId="'+ data.paperItemDTOList[j].id +'"></span>');
						a.push(data.paperItemDTOList[j].questionTitle);
						a.push('</li>');
						flag = true;
					 }
				}
				if(!flag){
					a.push('<li class="sigle-theme">');
					a.push('<span targetId="'+ data.paperItemDTOList[j].id +'"></span>');
					a.push(data.paperItemDTOList[j].questionTitle);
					a.push('</li>');
				}
			}
		}else{
			for(var j=0;j<data.paperItemDTOList.length;j++){
				a.push('<li class="sigle-theme">');
				a.push('<span targetId="'+ data.paperItemDTOList[j].id +'"></span>');
				a.push(data.paperItemDTOList[j].questionTitle);
				a.push('</li>');
			}
		}
		a.push('</ul>');
		a.push('</div>');
	}
	a.push('  </div>');
	a.push('  <div class="dialog-button clearfix">');
	a.push('    <button class="fl dialog-cancle">取消</button>');
	a.push('    <button class="fl dialog-ok" data-id="'+data.paperItemDTO.paperId+'">确定</button>');
	a.push('  </div>');
	a.push('</div>');
    return a.join('');
});
