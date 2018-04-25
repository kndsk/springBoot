/**
 * @description: 配置文件
 * @author：smchen2
 * @time: 陈世敏(2016-08-4)
 */
var requireConfig = {

    baseUrl: basePath + '/resources/editpaper/js/apps/',
    // baseUrl: "../../../js/apps/",

    paths: {
        jquery: '../plugins/jquery-1.10.2',
        utils:'common/common',
        imageCtrl:'../plugins/demo/imageCtrl',
        plugin:'../plugins/demo/plugin',
        pasteImgText:'../plugins/demo/pasteImgText',
        ckeditor:'../plugins/ckeditor/ckeditor',
        textCode:'../plugins/ckeditor/TexCode',
        index:'../plugins/demo/index',
        knockout:'../plugins/knockoutJs/knockout-3.3.0',
        mapping:'../plugins/knockoutJs/knockout.mapping',
        template:'../plugins/template',
        selectui:'../plugins/jquery.selectui',
        popbox:'../plugins/artDialog/popBox',
        listDrag:'../plugins/drag/list-drag',
        previewDrag:'../plugins/drag/preview-drag',
        wholeDrag:'../plugins/drag/whole-drag',
        dropListSave:'../plugins/dropListSave/drop-list-save',
        mpt:'../plugins/mpt',
        tpl:'../../templ/preview-paper/tpl'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        lightBootStrap:{
            deps:['jquery','bootstrap'],
            exports:'lightBootStrap'
        },
        selectui: {
            deps: ['jquery'],
            exports: 'selectui'
        },
        popbox: {
            deps: ['jquery'],
            exports: 'popbox'
        },
        index: {
            deps: ['ckeditor'],
            exports: 'index'
        },
        listDrag: {
            deps: ['jquery'],
            exports: 'listDrag'
        },
        previewDrag: {
            deps: ['jquery'],
            exports: 'previewDrag'
        },
        dropListSave: {
            deps: ['jquery'],
            exports: 'dropListSave'
        },
        wholeDrag: {
            deps: ['jquery'],
            exports: 'wholeDrag'
        },
        tpl: {
            deps: ['mpt'],
            exports: 'tpl'
        }
    }
};

var globalConfig = {
		requestBase:basePath+'/',
		req:{
			login:'login',
	        getpaper:'paper/getpaper',
	        getpaperitems:'paperitem/getanswerpaperitems',
			sumit:''
		}
	}