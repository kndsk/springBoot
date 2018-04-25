package com.ly.edu.util;

import com.ly.edu.dto.SportResultDTO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 数据校验类
 */
public class DataVerificationUtill {
    //视力数据校验范围
    static String eye_regx = "^-1.0$|^-2.0$|^[34]\\.\\d$|^5\\.[0123]$";
    //小学身高数据校验范围
    static String primSch_hight_regx = "^-1.0$|^-2.0$|^9\\d\\.\\d$|^1\\d\\d\\.\\d$|^200.0$";
    //小学体重数据校验范围
    static String primSch_weight_regx = "^-1.0$|^-2.0$|^1[56789]\\.\\d$|^[23456789]\\d\\.\\d$|^100.0$";
    //小学握力数据校验范围
    static String primSch_power_regx = "^-1.0$|^-2.0$|^\\d\\.\\d$|^[1234]\\d\\.\\d$|^50.0$";
    //小学肺活量数据校验范围
    static String primSch_breath_regx = "^-1$|^-2$|^[789]\\d\\d$|^[123456]\\d\\d\\d$|^7000$";
    //小学50米短跑数据校验范围
    static String primSch_fifty_metre_regx = "^-1.0$|^-2.0$|^[56789]\\.\\d$|^1\\d\\.\\d$|^20.0$";
    //小学男生立定跳远数据校验范围
    static String primSch_jump_boy_regx = "^-1$|^-2$|^[789]\\d$|^1\\d\\d$|^2[01234]\\d$|^250$";
    //小学女生立定跳远数据校验范围
    //static String primSch_jump_girl_regx = "^-99$|^7[56789]$|^[89]\\d$|^1\\d\\d$|^2[01]\\d$|^220$";
    //小学15米折返跑男生数据校验范围
    static String primSch_fifthBackRun_boy_regx = "^-1$|^-2$|^\\d$|^[123]\\d$|^4[01234]$";
    //小学15米折返跑女生数据校验范围
    static String primSch_fifthBackRun_girl_regx = "^-1$|^-2$|^\\d$|^[12]\\d$|^3[012345]$";
    //中学身高数据校验范围
    static String seconSch_hight_regx = "^-1.0$|^-2.0$|^1\\d\\d\\.\\d$|^2[012]\\d\\.\\d$|^230.0";
    //中学体重数据校验范围
    static String seconSch_weight_regx = "^-1.0$|^-2.0$|^[23456789]\\d\\.\\d$|^1[012]\\d\\.\\d$|^130.0$";
    //中学男生握力数据校验范围
    static String seconSch_power_boy_regx = "^-1.0$|^-2.0$|^\\d\\.\\d$|^[123456]\\d\\.\\d$|^70.0$";
    //中学女生握力书据校验范围
    //static String seconSch_power_girl_regx = "^-99.0$|[56789]\\.\\d$|^[1234]\\d\\.\\d$|^50.0$";
    //中学男生肺活量数据校验范围
    static String seconSch_breath_boy_regx = "^-1$|^-2$|^[12345678]\\d\\d\\d$|^9000$";
    //中学女生肺活量数据校验范围
    //static String seconSch_breath_girl_regx = "^-99$|^[123]\\d\\d\\d$|^4[01234]\\d\\d$|^4500$";
    //中学50米短跑数据校验范围
    static String seconSch_fifty_metre_regx = "^-1.0$|^-2.0$|^[56789]\\.\\d$|^1\\d\\.\\d$|^20.0$";
    //中学男生立定跳远数据校验范围
    static String seconSch_jump_boy_regx = "^-1$|^-2$|^[789]\\d$|^1\\d\\d$|^2\\d\\d$|^300$";
    //中学女生立定跳远数据校验范围
    //static String seconSch_jump_girl_regx = "^-99$|^8[56789]$|^9\\d$|^1\\d\\d$|^2[01234]\\d$|^250$";
    //中学男生15米折返跑数据校验范围
    static String seconSch_fifthBackRun_boy_regx = "^-1$|^-2$|^\\d$|^[123456]\\d$|^70$";
    //中学女生15米折返跑数据校验范围
    static String seconSch_fifthBackRun_girl_regx = "^-1$|^-2$|^\\d$|^[123]\\d$|^4[012]$";
    //验证手机号
    public static boolean isMobile(String str){
        String string = str.trim();
        Pattern p = Pattern.compile("^[1][3,4,5,6,7,8][0-9]{9}$"); // 验证手机号
        Matcher m = p.matcher(string);
        return m.matches();
    }
    //验证座机号 分两种一种加区号，一种不加区号
    public static boolean isPhone(String str){
        boolean b = false;
        String string = str.trim();
        Pattern p1 = Pattern.compile("^[0][0-9]{2,3}-[0-9]{7,8}$"); // 验证带区号的座机号码
        Pattern p2 = Pattern.compile("^[0-9]{1}[0-9]{6,7}$"); // 验证不带区号的座机号码
        if (str.length() > 9){
            Matcher m = p1.matcher(string);
            b = m.matches();
        }
        else{
            Matcher m = p2.matcher(string);
            b = m.matches();
        }
        return b;
    }
    //验证录入体育成绩数据 浮点型
    public static boolean sportData(float data, String regx){
        String str = data + "";
        String string = str.trim();
        Pattern p = Pattern.compile(regx);
        //Pattern p1 = Pattern.compile("^-1.0$|^-2.0$|^[789]\\d$|^1\\d\\d$|^2[01234]\\d$|^250.0$");
        Matcher m = p.matcher(string);
        return  m.matches();
    }
    //验证录入体育成绩数据 整型
    public static boolean sportData1(int data, String regx){
        String str = data + "";
        String string = str.trim();
        Pattern p = Pattern.compile(regx);
        Matcher m = p.matcher(string);
        return  m.matches();
    }
    //验证录入成绩是否在正常范围内
    public static Map<String, Object> dataVerif(List<SportResultDTO> sportResultDTOList, int gradeType){
        Map<String, Object>map = new HashMap<String, Object>();
        String str = "";
        Pattern p;
        Matcher m;
        for (SportResultDTO sportResultDTO : sportResultDTOList){
            if (sportResultDTO.getIs_empty() == 0){
                if (!sportData(sportResultDTO.getLeft_eye(), eye_regx)){
                    map.put("result", false);
                    map.put("eye", sportResultDTO.getStuName()+"的视力不能超出正常范围");
                    return map;
                }
                if (!sportData(sportResultDTO.getRight_eye(), eye_regx)){
                    map.put("result", false);
                    map.put("eye", sportResultDTO.getStuName() + "的视力不能超出正常范围");
                    return map;
                }
                if (gradeType == 4 || gradeType == 5){
                    if (!sportData(sportResultDTO.getHeight(), primSch_hight_regx)){
                        map.put("result", false);
                        map.put("hight", sportResultDTO.getStuName() + "的身高不能超出正常范围");
                        return map;
                    }
                    if (!sportData(sportResultDTO.getWeight(), primSch_weight_regx)){
                        map.put("result", false);
                        map.put("weight", sportResultDTO.getStuName() + "的体重不能超出正常范围");
                        return map;
                    }
                    if (!sportData(sportResultDTO.getPower_first(), primSch_power_regx)){
                        map.put("result", false);
                        map.put("power", sportResultDTO.getStuName() + "的握力不能超出正常范围");
                        return map;
                    }
                    if (!sportData(sportResultDTO.getPower_second(), primSch_power_regx)){
                        map.put("result", false);
                        map.put("power",  sportResultDTO.getStuName() + "的握力不能超出正常范围");
                        return map;
                    }
                    if (!sportData1(sportResultDTO.getBreath_first(), primSch_breath_regx)){
                        map.put("result", false);
                        map.put("breath", sportResultDTO.getStuName() + "的肺活量不能超出正常范围");
                        return map;
                    }
                    if (!sportData1(sportResultDTO.getBreath_second(), primSch_breath_regx)){
                        map.put("result", false);
                        map.put("breath", sportResultDTO.getStuName() + "的肺活量不能超出正常范围");
                        return map;
                    }
                    if (!sportData(sportResultDTO.getFifty_meter(), primSch_fifty_metre_regx)){
                        map.put("result", false);
                        map.put("fifty_meter", sportResultDTO.getStuName() + "的50米短跑不能超出正常范围");
                        return map;
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getJump_first(), primSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getJump_second(), primSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getJump_third(), primSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getJump_first(), primSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getJump_second(), primSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getJump_third(), primSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getFifth_meter(), primSch_fifthBackRun_boy_regx)){
                            map.put("result", false);
                            map.put("fifthBackRun", sportResultDTO.getStuName() + "的15米折返跑次数不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getFifth_meter(), primSch_fifthBackRun_girl_regx)){
                            map.put("result", false);
                            map.put("fifthBackRun", sportResultDTO.getStuName() + "的15米折返跑次数不能超出正常范围");
                            return map;
                        }
                    }
                }
                if (gradeType == 8 || gradeType == 9){
                    if (!sportData(sportResultDTO.getHeight(), seconSch_hight_regx)){
                        map.put("result", false);
                        map.put("hight", sportResultDTO.getStuName() + "的身高不能超出正常范围");
                        return map;
                    }
                    if (!sportData(sportResultDTO.getWeight(), seconSch_weight_regx)){
                        map.put("result", false);
                        map.put("weight", sportResultDTO.getStuName() + "的体重不能超出正常范围");
                        return map;
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData(sportResultDTO.getPower_first(), seconSch_power_boy_regx)){
                            map.put("result", false);
                            map.put("power", sportResultDTO.getStuName() + "的握力不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData(sportResultDTO.getPower_second(), seconSch_power_boy_regx)){
                            map.put("result", false);
                            map.put("power", sportResultDTO.getStuName() + "的握力不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData(sportResultDTO.getPower_first(), seconSch_power_boy_regx)){
                            map.put("result", false);
                            map.put("power", sportResultDTO.getStuName() + "的握力不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData(sportResultDTO.getPower_second(), seconSch_power_boy_regx)){
                            map.put("result", false);
                            map.put("power", sportResultDTO.getStuName() + "的握力不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getBreath_first(), seconSch_breath_boy_regx)){
                            map.put("result", false);
                            map.put("breath", sportResultDTO.getStuName() + "的肺活量不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getBreath_second(), seconSch_breath_boy_regx)){
                            map.put("result", false);
                            map.put("breath", sportResultDTO.getStuName() + "的肺活量不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getBreath_first(), seconSch_breath_boy_regx)){
                            map.put("result", false);
                            map.put("breath", sportResultDTO.getStuName() + "的肺活量不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getBreath_second(), seconSch_breath_boy_regx)){
                            map.put("result", false);
                            map.put("breath", sportResultDTO.getStuName() + "的肺活量不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getFifty_meter() > 0){
                        if (!sportData(sportResultDTO.getFifty_meter(), seconSch_fifty_metre_regx)){
                            map.put("result", false);
                            map.put("fifty_meter", sportResultDTO.getStuName() + "的50米短跑不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getJump_first(), seconSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getJump_second(), seconSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getJump_third(), seconSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getJump_first(), seconSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getJump_second(), seconSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getJump_third(), seconSch_jump_boy_regx)){
                            map.put("result", false);
                            map.put("jump", sportResultDTO.getStuName() + "的立定跳远不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 0){
                        if (!sportData1(sportResultDTO.getFifth_meter(), seconSch_fifthBackRun_boy_regx)){
                            map.put("result", false);
                            map.put("fifthBackRun", sportResultDTO.getStuName() + "的15米折返跑次数不能超出正常范围");
                            return map;
                        }
                    }
                    if (sportResultDTO.getSex() == 1){
                        if (!sportData1(sportResultDTO.getFifth_meter(), seconSch_fifthBackRun_girl_regx)){
                            map.put("result", false);
                            map.put("fifthBackRun", sportResultDTO.getStuName() + "的15米折返跑次数不能超出正常范围");
                            return map;
                        }
                    }
                }
            }
        }
        map.put("result", true);
        return map;
    }
}
