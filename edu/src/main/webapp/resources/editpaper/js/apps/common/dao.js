/**
 * @authors smchen2 (you@example.org)
 * @date    2016-08-8
 * @version $Id$
 */

define(function(require, exports, module) {

    var utils = require('common/common');

    module.exports = {
        
        // 请求模板
        requestListTmpl: function(url) {
            return utils.ajax.ajaxGet(url, function(data) {
                return data;
            },'text');
        },
        // 请求数据
        requestListData: function(url,data) {
            return utils.ajax.ajaxPost(url, data, function(data) {
                return data;
            },'json');
        }
    };

});