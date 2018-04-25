/**
 * Created by admin on 2017/11/28.
 */
define(function (require, exports, module) {

    var gradeList = ['四', '八','4','8'];

    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj){
                return true;
            }
        }
        return false;
    };

    var eventController = {

        /**
         * 小数点控制
         * @param val
         * @returns {boolean}
         */
        decimalPointCtrl: function (val) {
            var reg = new RegExp("^(-1)$|^([1-9]\\d*|0)(\\.\\d{1})?$");
            return reg.test(val);
        },

        /**
         * 条形码控制
         * @param val
         */
        barcodeCtrl: function (val) {
            if (val.length != 15) return false;
            var regExp = new RegExp("^\\d{15}$");
            return regExp.test(val);
        },

        /**
         * 班级名称校验
         * @param val
         */
        classNameCtrl: function (val) {
            if (val.length < 5) return false;
            if (val.trim().substring(1, 3) !== "年级") {
                return false;
            }
            if (val.trim().substring(val.length - 1) !== "班") {
                return false;
            }
            var result = false;
            var gradeName = val.trim().substring(0, 1);
            if (gradeList.contains(gradeName)) {
                result = true;
            }else {
                result = false;
            }
            if (result){
                if (!val.trim().substring(3, val.length - 1)) {
                    result = false;
                }else {
                    result = true;
                }
            }
            return result;
        },

        /**
         * 视力控制
         */
        visionInputCtrl: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^4\\.\\d$|^5\\.[0123]$");
            return regExp.test(val);
        },

        /**
         * 视力控制2
         * @param val
         */
        visionRangeCtrl: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^0\\.[1-9]$|^2\\.[0]$");
            return regExp.test(val);
        },

        /**
         * 四年级身高控制
         * @param val
         */
        heightInputCtrl4: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^9\\d\\.\\d$|^1\\d\\d\\.\\d$|^200.0$");
            return regExp.test(val);
        },

        /**
         * 八年级身高控制
         * @param val
         */
        heightInputCtrl8: function (val) {
            // val = String(val);
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^1\\d\\d\\.\\d$|^2[012]\\d\\.\\d$|^230.0");
            return regExp.test(val);
        },

        /**
         * 四年级体重控制
         * @param val
         */
        weightInputCtrl4: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^1[56789]\\.\\d$|^[23456789]\\d\\.\\d$|^100.0$");
            return regExp.test(val);
        },
        /**
         * 八年级体重控制
         * @param val
         */
        weightInputCtrl8: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^[23456789]\\d\\.\\d$|^1[012]\\d\.\\d$|^130.0$");
            return regExp.test(val);
        },

        /**
         * 四年级50米跑控制
         * @param val
         */
        fiftyMeterCtrl4: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^[56789]\\.\\d$|^1\\d\\.\\d$|^20.0$");
            return regExp.test(val);
        },

        /**
         * 八年级50米跑控制
         * @param val
         */
        fiftyMeterCtrl8: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^[56789]\\.\\d$|^1\\d\\.\\d$|^20.0$");
            return regExp.test(val);
        },

        /**
         * 四年级男生15米折返跑控制
         * @param val
         */
        fifthBoyCtrl4: function (val) {
            var regExp = new RegExp("^-1$|^\\d$|^[123]\\d$|^4[01234]$");
            return regExp.test(val);
        },

        /**
         * 八年级男生15米折返跑控制
         * @param val
         */
        fifthBoyCtrl8: function (val) {
            var regExp = new RegExp("^-1$|^\\d$|^[123456]\\d$|^70$");
            return regExp.test(val);
        },

        /**
         * 四年级女生15米折返跑控制
         * @param val
         */
        fifthGirlCtrl4: function (val) {
            var regExp = new RegExp("^-1$|^\\d$|^[12]\\d$|^3[012345]$");
            return regExp.test(val);
        },

        /**
         * 八年级女生15米折返跑控制
         * @param val
         */
        fifthGirlCtrl8: function (val) {
            var regExp = new RegExp("^-1$|^\\d$|^[123]\\d$|^4[012]$");
            return regExp.test(val);
        },

        /**
         * 四年级握力控制
         * @param val
         */
        gripCtrl4: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^\\d\\.\\d$|^[1234]\\d\\.\\d$|^50.0$");
            return regExp.test(val);
        },

        /**
         * 八年级男生握力控制
         * @param val
         */
        gripBoyCtrl8: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp('^-1.0$|^\\d\\.d\\$|^[0123456]\\d\.\\d$|^70.0$');
            return regExp.test(val);
        },

        /**
         * 八年级女生握力控制
         * @param val
         */
        gripGirlCtrl8: function (val) {
            if (val.indexOf('.') <= 0){
                val = val + '.0';
            }
            var regExp = new RegExp("^-1.0$|^\\d\\.\\d$|^[0123456]\\d\.\\d$|^70.0$");
            return regExp.test(val);
        },

        /**
         * 四年级肺活量控制
         * @param val
         */
        vitalCapacityCtrl4: function (val) {
            var regExp = new RegExp("^-1$|^[789]\\d\\d$|^[123456]\\d\\d\\d$|^7000$");
            return regExp.test(val);
        },

        /**
         * 八年级男生肺活量控制
         * @param val
         */
        vitalCapacityBoyCtrl8: function (val) {
            var regExp = new RegExp("^-1$|^[12345678]\\d\\d\\d$|^9000$");
            return regExp.test(val);
        },

        /**
         * 八年级女生肺活量控制
         * @param val
         */
        vitalCapacityGirlCtrl8: function (val) {
            var regExp = new RegExp("^-1$|^[12345678]\\d\\d\\d$|^9000$");
            return regExp.test(val);
        },

        /**
         * 四年级男生立定跳远控制
         * @param val
         */
        jumpBoyCtrl4: function (val) {
            var regExp = new RegExp("^-1$|^[789]\\d$|^1\\d\\d$|^2[01234]\\d$|^250$");
            return regExp.test(val);
        },

        /**
         * 四年级女生立定跳远控制
         * @param val
         */
        jumpGirlCtrl4: function (val) {
            var regExp = new RegExp("^-1$|^[789]\\d$|^1\\d\\d$|^2[01234]\\d$|^250$");
            return regExp.test(val);
        },

        /**
         * 八年级男生立定跳远控制
         * @param val
         */
        jumpBoyCtrl8: function (val) {
            var regExp = new RegExp("^-1$|^[789]\\d$|^1\\d\\d$|^2\\d\\d$|^300$");
            return regExp.test(val);
        },

        /**
         * 八年级女生立定跳远控制
         * @param val
         */
        jumpGirlCtrl8: function (val) {
            var regExp = new RegExp("^-1$|^[789]\\d$|^1\\d\\d$|^2\\d\\d$|^300$");
            return regExp.test(val);
        },

        /**
         * 身高初步判断
         * @param grade
         * @param data
         */
        heightFirstCtrl: function (grade, data) {
            if (data === '-1') {
                return true;
            }
            if (grade === '4' || grade === '5') {
                if (data >= 90 && data <= 200) {
                    return true;
                }else {
                    return false;
                }
            } else if (grade === '8' || grade === '9') {
                if (data >= 100 && data <= 230) {
                    return true;
                }else {
                    return false;
                }
            }else {
                return false;
            }
        },

        /**
         * 体重初步控制
         * @param grade
         * @param data
         */
        weightFirstCtrl: function (grade, data) {
            if (data === '-1') {
                return true;
            }
            if (grade === '4' || grade === '5') {
                if (data >= 15 && data <= 100) {
                    return true;
                }else {
                    return false;
                }
            } else if (grade === '8' || grade === '9') {
                if (data >= 20 && data <= 130) {
                    return true;
                }else {
                    return false;
                }
            }else {
                return false;
            }
        },

        /**
         * 视力的初步控制
         * @param data
         * @returns {boolean}
         */
        visionFirstCtrl: function (data) {
            if (data === '-1') {
                return 4;
            }
            if (data >= 0.1 && data <= 2) {
                return 1;
            }

            if (data >= 3 && data <= 5.3) {
                var result = eventController.decimalPointCtrl(data);
                if (!result) {
                    return 3;
                }else {
                    return 4;
                }
            }else {
                return 2;
            }
        },

        /**
         * 握力初步控制
         * @param grade
         * @param sex
         * @param data
         * @returns {boolean}
         */
        powerFirstCtrl: function (grade, sex, data) {
            if (data === '-1') {
                return true;
            }

            if (grade === '4' || grade === '5') {
                if (data >= 0 && data <= 50) {
                    return true;
                } else {
                    return false;
                }
            } else if (grade === '8' || grade === '9') {
                if (data >= 0 && data <= 70) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        /**
         * 50米跑初步控制
         * @param grade
         * @param data
         * @returns {boolean}
         */
        runningFirstCtrl: function (grade, data) {
            if (data === '-1') {
                return true;
            }
            if (data >= 5 && data <= 20) {
                return true;
            } else {
                return false;
            }
        }
    };

    return eventController;
});