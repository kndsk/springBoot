/**
 * Created by admin on 2017/11/22.
 */
define(function (require, exports, module) {

    function checkInformation() {
        var recorder = $.trim($("#recorder").val());
        var auditor = $.trim($("#auditor").val());
        var phoneNum = $.trim($("#phoneNum").val());
        if (!recorder || !auditor || !phoneNum){
            $(".tip-error>p").html('信息未填写完整！');
            $(".tip-error").show();
            $(".div-shade").show();
            return false;
        }
        //对电话号码进行校验
        var check_phone = /^[1][3,4,5,7,8][0-9]{9}$/;
        var check_tel1 = /^[0][0-9]{2,3}-[0-9]{7,8}$/;
        var check_tel2 = /^[0-9]{1}[0-9]{6,7}$/;
        if (check_phone.test(phoneNum) || check_tel1.test(phoneNum) || check_tel2.test(phoneNum)) {

        }
        else{
            $(".tip-error>p").html('电话号码填写不正确！');
            $(".tip-error").show();
            $(".div-shade").show();
            return false;
        }
        var baseUrl = $("#hd_ctx").val();
        $.post(baseUrl + "/saveRecorderInfo", {
            recorderName: recorder,
            reviewerName: auditor,
            iphone: phoneNum
        }, function (data) {
            //跳转成绩录入页面
            if (data.result) {
                window.location.href = baseUrl + "/homePage";
            }else {
                $(".tip-error>p").html('系统异常，请联系超级管理员！');
                $(".tip-error").show();
                $(".div-shade").show();
            }
        }).error(function (error) {
            $(".tip-error>p").html('系统异常，请联系超级管理员！');
            $(".tip-error").show();
            $(".div-shade").show();
        })

    }
    $(function () {
        $(".begin-write").click(function () {
            checkInformation();
        });
        $("#phoneNum").keypress(function(event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                checkInformation();
            }
        });
        $('#recorder').blur(function () {
            var value = $(this).val();
            $(this).attr('title', value);
        });
        $('#auditor').blur(function () {
            var value = $(this).val();
            $(this).attr('title', value);
        });
        $('.close_button').unbind().click(function () {
            $(".tip-error").hide();
            $(".div-shade").hide();
        })
    })
});
