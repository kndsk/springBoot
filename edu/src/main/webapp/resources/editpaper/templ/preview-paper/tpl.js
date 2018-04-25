//单选题 模板
MPT.addTmpl('t_radio_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="radio-box">');
    a.push('    <div class="preview-wrapper radio-view '+ list.id +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'">');
    a.push('        <div>');
    a.push('             <div class="title-view">');
    a.push('                <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                <div class="title-content">'+ list.questionTitle +'</div>');
    a.push('            </div>');
    a.push('            <div class="view-option-box">');
    for(var j=0;j<list.options.length;j++){
        var list1 = list.options[j];
        a.push('<div class="item-view-option" style="width:'+ (100/list.showColumnNum) +'%">');
        a.push('    <i class="radio-normal" value="'+ list1.name +'"></i>');
        a.push('    <div class="option-content" name="'+ list1.name +'" target="">'+ list1.value +'</div>');
        a.push('</div>');
    }
    a.push('            </div>');
    a.push('        </div>');
    a.push('    </div>');
    a.push('</div>');
    return a.join('');
});
//多选题模板
MPT.addTmpl('t_multiple_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="multiple-box">');
    a.push('    <div class="preview-wrapper multiple-view '+ list.id +'" maxChoiceNum="'+ list.maxChoiceNum +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'">');
    a.push('        <div>');
    a.push('            <div class="title-view">');
    a.push('                <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                <div class="title-content">'+ list.questionTitle +'</div>');
    a.push('                <span class="theme-type">[多选题]</span>');
    a.push('            </div>');
    a.push('            <div class="view-option-box" maxchoice="'+ list.maxChoiceNum +'">');
    for(var j=0;j<list.options.length;j++){
        var list1 = list.options[j];
        a.push('<div class="item-view-option" style="width:'+ (100/list.showColumnNum) +'%" data-rule="'+list1.magicRules+'">');
        a.push('    <i class="checkbox-normal" value="'+ list1.name +'"></i>');
        a.push('    <div class="option-content" name="'+ list1.name +'">'+ list1.value +'</div>');
        a.push('</div>');
    }
    a.push('            </div>');
    a.push('        </div>');
    a.push('    </div>');
    a.push('</div>');
    return a.join('');
});
//填空题模板
MPT.addTmpl('t_fill_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="fill-box">');
    a.push('    <div class="preview-wrapper fill-view '+ list.id +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'">');
    a.push('        <div>');
    a.push('            <div class="title-view">');
    a.push('                <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                <div class="title-content">');
    a.push('                    <p>'+ list.questionTitle +'</p>');
    a.push('                </div>');
    a.push('            </div>');
    a.push('        </div>');
    a.push('    </div>');
    a.push('</div>');
    return a.join('');
});
//表格题模板
MPT.addTmpl('t_table_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="table-box">');
    a.push('    <div class="preview-wrapper table-view '+ list.id +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'" maxChoiceNum="'+ list.maxChoiceNum +'">');
    a.push('        <div>');
    a.push('            <div class="title-view">');
    a.push('                <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                <div class="title-content">');
    a.push('                    <p>'+ list.questionTitle +'</p>');
    a.push('                </div>');
    a.push('            </div>');
    a.push('        </div>');
    if(list.complex === false){
        a.push('<table class="table-style">');
        a.push('  <thead>');
        a.push('        <tr class="table-header">');
        a.push('           <th style="width: 40%"></th>');
        for(var m=0;m<list.optionArray.length;m++){
            var listm = list.optionArray[m];
            a.push('<th>'+ listm.value +'</th>');
        }
        a.push('        </tr>');
        a.push('  </thead>');
        a.push('  <tbody>');
        for(var n=0;n<list.subTitles[0].titles.length;n++){
            var listn = list.subTitles[0].titles[n];
            a.push('<tr class="table-body">');
            a.push('    <td>'+ listn.leftTitle +'</td>');
            for(var g=0;g<list.optionArray.length;g++){
                var listg = list.optionArray[g];
                //判断多选
                if(list.maxChoiceNum > 1){
                    a.push('    <td class="radio-view-option combine-td"><i class="checkbox-normal" value="'+ listg.name +'"></td>');
                }
                else{
                    a.push('    <td class="radio-view-option combine-td"><i class="radio-normal" value="'+ listg.name +'"></td>');
                }
                // a.push('    <td class="radio-view-option combine-td"><i class="radio-normal" value="'+ listg.name +'"></td>');
            }
            a.push('</tr>');
        }
        a.push('    </tbody>');
        a.push('</table>');
    }else{
        a.push('<table class="table-style">');
        a.push('  <thead>');
        a.push('        <tr class="table-header">');
        a.push('            <th style="width: 30%"></th>');
        a.push('            <th></th>');
        for(var m=0;m<list.optionArray.length;m++){
            var listm = list.optionArray[m];
            a.push('<th>'+ listm.value +'</th>');
        }
        a.push('        </tr>');
        a.push('  </thead>');
        a.push('  <tbody>');
        for(var m=0;m<list.subTitles.length;m++){
    		var listn = list.subTitles[m];
    		a.push('<tr class="table-body">');
    		a.push('   <td rowspan="'+listn.titles.length+'">'+ listn.groupTitle +'</td>');
    		a.push('   <td class="combine-td">'+ listn.titles[0].leftTitle +'</td>');
    		for(var g=0;g<list.optionArray.length;g++){
    			var listg = list.optionArray[g];
                //判断多选
                if(list.maxChoiceNum > 1){
                    a.push('    <td class="radio-view-option combine-td"><i class="checkbox-normal" value="'+ listg.name +'"></td>');
                }
                else{
                    a.push('    <td class="radio-view-option combine-td"><i class="radio-normal" value="'+ listg.name +'"></td>');
                }
    			// a.push('    <td class="radio-view-option combine-td"><i class="radio-normal" value="'+ listg.name +'"></td>');
    		}
    		a.push('</tr>');
    		for(var k=1;k<listn.titles.length;k++){
    			var listk = listn.titles[k];
    			a.push('<tr class="table-body">');
    			a.push('    <td class="combine-td">'+ listk.leftTitle +'</td>');
    			for(var g=0;g<list.optionArray.length;g++){
    				var listg = list.optionArray[g];
                    //判断多选
                    if(list.maxChoiceNum > 1){
                        a.push('    <td class="radio-view-option combine-td"><i class="checkbox-normal" value="'+ listg.name +'"></td>');
                    }
                    else{
                        a.push('    <td class="radio-view-option combine-td"><i class="radio-normal" value="'+ listg.name +'"></td>');
                    }
    				// a.push('    <td class="radio-view-option combine-td"><i class="radio-normal" value="'+ listg.name +'"></td>');
    			}
    			a.push('</tr>');
    		}
        }
        a.push('    </tbody>');
        a.push('</table>');
    }
    a.push('</div>');
    a.push('</div>');
    return a.join('');
});
//排序题模板
MPT.addTmpl('t_sort_tpl',function(data){
    var list = data;
    var a = [];
    a.push('    <div class="sort-box">');
    a.push('        <div class="preview-wrapper sort-view '+ list.id +'" maxInputNum="'+ list.maxInputNum +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'">');
    a.push('            <div>');
    a.push('                <div class="title-view">');
    a.push('                <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                    <div class="title-content">');
    a.push('                        <p>'+ list.questionTitle +'</p>');
    a.push('                    </div>');
    a.push('                    <div class="title-remark">');
    a.push('                        <require>*</require>');
    a.push('                        <span>拖动右侧的选项</span>');
    a.push('                    </div>');
    a.push('                </div>');
    a.push('            </div>');
    a.push('            <div class="answer-box">');
    a.push('                <div class="sort-input"></div>');
    a.push('                <div class="sort-options">');
    for(var c=0;c<list.sortOptions.length;c++){
        var listC = list.sortOptions[c];
        a.push('                <li class="list" value="'+ listC.name +'">');
        a.push(listC.value.questionTitle);
        a.push('                        <span class="option-handle"></span>');
        a.push('                     </li>');
    }
    a.push('                </div>');
    a.push('            </div>');
    a.push('        </div>');
    a.push('    </div>');
    return a.join('');
});
//简答题模板
MPT.addTmpl('t_shortAnswer_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="short-answer-box">');
    a.push('    <div class="preview-wrapper short-answer-view '+ list.id +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'">');
    a.push('        <div>');
    a.push('            <div class="title-view">');
    a.push('            <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                <div class="title-content">');
    a.push('                    <p>'+ list.questionTitle +'</p>');
    a.push('                </div>');
    a.push('            </div>');
    a.push('        </div>');
    a.push('    </div>');
    a.push('</div>');
    return a.join('');
});
//量表题模板
MPT.addTmpl('t_sacleBox_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="sacle-box">');
    a.push('    <div class="preview-wrapper sacle-view '+ list.id +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'">');
    a.push('        <div>');
    a.push('            <div class="title-view">');
    a.push('            <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                <div class="title-content">');
    a.push('                    <p>'+list.questionTitle+'</p>');
    a.push('                </div>');
    a.push('            </div>');
    a.push('            <table class="table-style">');
    a.push('                <thead>');
    a.push('                    <tr class="table-header">');
    a.push('                        <th style="width: 20%"></th>');
    for(var x=0;x<list.optionArray.length;x++){
        var listX = list.optionArray[x];
        a.push('<th>'+ listX.value +'</th>');
    }
    a.push('                        <th style="width: 20%"></th>');
    a.push('                    </tr>');
    a.push('                </thead>');
    a.push('                <tbody>');
    for(var y=0;y<list.subTitles[0].titles.length;y++){
        var listY = list.subTitles[0].titles[y];
        a.push('                <tr class="table-body">');
        a.push('                    <td>'+ listY.leftTitle +'</td>');
        for(var y1=0;y1<list.optionArray.length;y1++){
            var listY1 = list.optionArray[y1];
            if(list.choiceFlag == 2 ){

                a.push('               <td class="radio-view-option"><i class="checkbox-normal" value="'+ listY1.name +'"></i></td>');

            }   else    {

                a.push('               <td class="radio-view-option"><i class="radio-normal" value="'+ listY1.name +'"></i></td>');
            }

        }
         a.push('                   <td>'+ listY.rightTitle +'</td>');
         a.push('               </tr>');
    }
    a.push('                </tbody>');
    a.push('            </table>');
    a.push('        </div>');
    a.push('    </div>');
    a.push('</div>');
    return a.join('');
});
//段落题模板
MPT.addTmpl('t_paragraph_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="paragraph-box">');
    a.push('    <div class="preview-wrapper paragraph-statement-view '+ list.id +'" itemId="'+ list.id +'" index="'+ list.index +'" type="'+ list.type +'">');
    a.push('        <div>');
    a.push('            <div class="title-view">');
    a.push('                <input type="hidden" class="hd-paperitem-id" value="'+ list.id +'" />');
    a.push('                <div class="title-content">');
    a.push('                    <p>'+ list.questionTitle +'</p>');
    a.push('                </div>');
    a.push('            </div>');
    a.push('        </div>');
    a.push('    </div>');
    a.push('</div>');
    return a.join('');
});
//组合题模板
MPT.addTmpl('t_group_tpl',function(data){
    var list = data;
    var a = [];
    a.push('<div class="combin-box-wrapper">');
    a.push('    <input type="hidden" class="hd-parentid"/>');
    a.push('    <input type="hidden" class="hd-paperitem-id"/>');
    a.push(MPT.getTmpl('t_paragraph_tpl',list));
    if(!!list.subPaperItemDTOs){
    	for(var i=0;i<list.subPaperItemDTOs.length;i++){
    		var listC = list.subPaperItemDTOs[i];
    		if(!controlManager.displayObj[listC.id].isShow){
    			continue;
    		}
    		if(listC.type == 1 || listC.type == 4){
    			a.push(MPT.getTmpl('t_radio_tpl',listC));
    		}
    		if(listC.type == 2 || listC.type == 5){
    			a.push(MPT.getTmpl('t_multiple_tpl',listC));
    		}
    		if(listC.type == 3){
    			a.push(MPT.getTmpl('t_fill_tpl',listC));
    		}
    		if(listC.type == 6){
    			a.push(MPT.getTmpl('t_table_tpl',listC));
    		}
    		if(listC.type == 7){
    			a.push(MPT.getTmpl('t_sort_tpl',listC));
    		}
    		if(listC.type == 9){
    			a.push(MPT.getTmpl('t_shortAnswer_tpl',listC));
    		}
    		if(listC.type == 10){
    			a.push(MPT.getTmpl('t_sacleBox_tpl',listC));
    		}
    		if(listC.type == 11){
    			a.push(MPT.getTmpl('t_paragraph_tpl',listC));
    		}
    	}
    }
    a.push('</div>');
    return a.join('');
});
//页面习题模板
MPT.addTmpl('T_tmplete',function(data){
	var a = [];
	a.push('<div class="main-panple">');
	for(var i=0;i<data.paperItemDTOs.length;i++){
		var list = data.paperItemDTOs[i];
        if(!controlManager.displayObj[list.id].isShow){
            continue;
        }
		if(list.type == 1 || list.type == 4){
			a.push(MPT.getTmpl('t_radio_tpl',list));
		}
        if(list.type == 2 || list.type == 5){
            a.push(MPT.getTmpl('t_multiple_tpl',list));
        }
        if(list.type == 3){
            a.push(MPT.getTmpl('t_fill_tpl',list));
        }
        if(list.type == 6){
           a.push(MPT.getTmpl('t_table_tpl',list));
        }
        if(list.type === 7){
           a.push(MPT.getTmpl('t_sort_tpl',list));
        }
        if(list.type === 9){
           a.push(MPT.getTmpl('t_shortAnswer_tpl',list));
        }
        if(list.type === 10){
           a.push(MPT.getTmpl('t_sacleBox_tpl',list));
        }
        if(list.type === 11){
            if(list.combine === false){
                 a.push(MPT.getTmpl('t_paragraph_tpl',list));
            }else{
               a.push(MPT.getTmpl('t_group_tpl',list));
            }
        }
	}
    a.push('</div>');
	return a.join('');
});
//分页跳转模板
MPT.addTmpl('T_pageJump',function(data){
    var a = [];
    a.push('<div class="page-box">');
    if(data.index == 1 && data.index < data.totalPage){
        a.push('    <button class="next-page">下一页</button>');
    }else if(data.index >1 && data.index < data.totalPage){
        a.push('    <button class="pre-page">上一页</button>');
        a.push('    <button class="next-page">下一页</button>');
    }else if(data.index == data.totalPage){
    	if(data.totalPage > 1){
    		a.push('    <button class="pre-page">上一页</button>');
    	}
        a.push('    <button id="submitAnswer">提交</button>');
    }
    a.push('</div>');
    return a.join('');
});
