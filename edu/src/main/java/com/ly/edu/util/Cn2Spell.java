package com.ly.edu.util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

public class Cn2Spell {
  private static String getEname(char name) {
    HanyuPinyinOutputFormat pyFormat = new HanyuPinyinOutputFormat();
    pyFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
    pyFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
    pyFormat.setVCharType(HanyuPinyinVCharType.WITH_V);
    String str = "";
    if (name > 128) {
      try {
        str += PinyinHelper.toHanyuPinyinStringArray(name, pyFormat)[0];
      } catch (BadHanyuPinyinOutputFormatCombination e) {
        e.printStackTrace();
      }
    } else {
      str += name;
    }
    return str;
  }
  
  public static String generateName(String name) {
    char[] nameChar = name.toCharArray();
    String res = "";
    if (nameChar.length == 2) {
      res += getEname(nameChar[1]);
      res += getEname(nameChar[0]);
    } else if (nameChar.length == 3) {
      res += getEname(nameChar[1]).charAt(0);
      res += getEname(nameChar[2]).charAt(0);
      res += getEname(nameChar[0]);
    } else {
      for (int i = 1; i < nameChar.length; i++) {
        res += getEname(nameChar[i]).charAt(0);
      }
      res += getEname(nameChar[0]);
    }
    return res;
  }
  
  public static String generateTableName(String name) {
    char[] nameChar = name.toCharArray();
    String res = "";
    for (int i = 0; i < nameChar.length; i++) {
      res += getEname(nameChar[i]).charAt(0);
    }
    return res;
  }
  
}
