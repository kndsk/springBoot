/**
 * Created by luzhen on 2015/3/19.
 */

 define(function(require, exports, module) {

     String.format = function () {
         if (arguments.length == 0)
             return null;

         var str = arguments[0];
         for (var i = 1; i < arguments.length; i++) {
             var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
             str = str.replace(re, arguments[i]);
         }
         return str;
     }
 
 });