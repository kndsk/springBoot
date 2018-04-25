/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here.
    // For the complete reference:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    config.extraPlugins = 'eqneditor';
    // The toolbar groups arrangement, optimized for two toolbar rows.
    /*config.toolbarGroups = [
        //{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        //{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        //{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        //{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        //{ name: 'links', groups: [ 'links' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'forms', groups: [ 'forms' ] }
        //{ name: 'styles', groups: [ 'styles' ] },
        //{ name: 'tools', groups: [ 'tools' ] },
        //{ name: 'others', groups: [ 'others' ] },
        //{ name: 'about', groups: [ 'about' ] }
    ];*/
    //使用的工具栏 plugins/toolbar/plugin.js
    config.toolbar = 'Full';

    config.toolbar_Full =
    [
        ['Undo','Redo'],
        ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Image','Table','HorizontalRule','SpecialChar','PageBreak'],
        ['Format','Font','FontSize'],
        ['TextColor','BGColor']
    ];



    //config.removeButtons = 'Source,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Checkbox,Radio,Select,Button,ImageButton,HiddenField,Strike,RemoveFormat,NumberedList,BulletedList,Outdent,Indent,Blockquote,CreateDiv,JustifyLeft,JustifyCenter,JustifyRight,JustifyBlock,BidiLtr,BidiRtl,Language,Link,Unlink,Anchor,Flash,Form,HorizontalRule,Smiley,PageBreak,Iframe,Styles,Format,ShowBlocks,About,Textarea,Maximize,NewPage,Preview';
    // config.font_names = 'Arial/Arial, Helvetica, sans-serif;'+'Times New Roman/Times New Roman, Times, serif;'+'Verdana';
    config.font_names = '宋体/SimSun;'+
        '黑体/SimHei;' +
        '微软雅黑/Microsoft YaHei;' +
        '新宋体/NSimSun;' +
        '仿宋/FangSong;' +
        '楷体/KaiTi;' +
        '仿宋_GB2312/FangSongGB2312;' +
        '楷体_GB2312/KaiTiGB2312;';
    config.fontSize_sizes ='8/8px;9/9px;10/10px;11/11px;12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px'
    config.skin = 'office2013';
    // Remove some buttons, provided by the standard plugins, which we don't
    // need to have in the Standard(s) toolbar.
    //config.removeButtons = 'Underline,Subscript,Superscript,SpecialChar,SpecialChar';
    config.removeButtons = 'HorizontalRule';
    // Se the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';

    // Make dialogs simpler.
    config.removeDialogTabs = "image:advanced;image:Link;link:advanced";
    config.image_previewText=' ';

    // var dir = 'http://localhost:8080/CKFinderJava-2.6.2';
    // config.filebrowserBrowseUrl = dir + '/ckfinder/ckfinder.html';
    //    config.filebrowserImageBrowseUrl = dir + '/ckfinder/ckfinder.html?Type=Images';
    config.filebrowserBrowseUrl = basePath + '/resources/editpaper/utils/ckfinder/ckfinder.html';
    config.filebrowserImageBrowseUrl = basePath + '/resources/editpaper/utils/ckfinder/ckfinder.html?Type=Images';
    config.filebrowserUploadUrl = basePath + '/uploadImg?command=QuickUpload&type=Files';
    config.filebrowserImageUploadUrl = basePath + '/uploadImg?command=QuickUpload&type=Images';
    config.filebrowserFlashUploadUrl = basePath + '/uploadImg?command=QuickUpload&type=Flash';
    // config.filebrowserImageUploadUrl = basePath+'/uploadImg';
};
