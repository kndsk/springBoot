package com.ly.edu.util;

import java.util.Date;
import java.util.Random;

public class NumberUtils {
  
  public static String formatNumber(long maxLoginName) {
    String pattern = "00000000";
    java.text.DecimalFormat df = new java.text.DecimalFormat(pattern);
    return String.valueOf(df.format(maxLoginName));
  }
  
  public static String getRandom() {
    String str = DateUtils.format(new Date(), "HHmmssSSS");
    return (str + fixLenthString(11)).replace(".", "");
  }
  
  /*
   * 返回长度为【strLength】的随机数，在前面补0
   */
  public static String fixLenthString(int strLength) {
    Random rm = new Random();
    // 获得随机数
    double pross = (1 + rm.nextDouble()) * Math.pow(10, strLength);
    // 将获得的获得随机数转化为字符串
    String fixLenthString = String.valueOf(pross);
    // 返回固定的长度的随机数
    return fixLenthString.substring(1, strLength + 1);
  }
}
