package com.ly.edu.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.util.Assert;

public class StringUtils {
  
  public static String toString(String[] strings, String delimiter) {
    Assert.notEmpty(strings);
    StringBuilder stringBuilder = new StringBuilder();
    for (String str : strings) {
      stringBuilder.append(str).append(delimiter);
    }
    if (stringBuilder.length() > 0) {
      stringBuilder.delete(stringBuilder.length() - delimiter.length(),
          stringBuilder.length());
    }
    return stringBuilder.toString();
  }
  
  public static String unicodeToString(String str) {
    String utf8Str = str;
    Pattern pattern = Pattern.compile("(\\\\u(\\p{XDigit}{4}))");
    Matcher matcher = pattern.matcher(utf8Str);
    while (matcher.find()) {
      char ch = (char) Integer.parseInt(matcher.group(2), 16);
      utf8Str = utf8Str.replace(matcher.group(1), ch + "");
    }
    return utf8Str;
  }
  
  public static String trimAllWhitespace(String str) {
    if (str != null) {
      int len = str.length();
      if (len > 0) {
        char[] src = str.toCharArray();
        char[] dest = new char[src.length];
        
        int destPos = 0;
        for (int pos1 = 0, pos2 = 0; pos2 < src.length;) {
          if (Character.isWhitespace(src[pos2])) {
            if (pos1 == pos2) {
              pos1++;
              pos2++;
            } else {
              System.arraycopy(src, pos1, dest, destPos, pos2 - pos1);
              destPos += (pos2 - pos1);
              pos2++;
              pos1 = pos2;
            }
          } else {
            pos2++;
          }
          
          if (pos2 == src.length) {
            if (pos1 != pos2) {
              System.arraycopy(src, pos1, dest, destPos, pos2 - pos1);
              destPos += (pos2 - pos1);
            }
            return new String(dest, 0, destPos);
          }
        }
      }
    }
    return str;
  }
  
  public static boolean isBlank(final CharSequence cs) {
    int strLen;
    if (cs == null || (strLen = cs.length()) == 0) {
      return true;
    }
    for (int i = 0; i < strLen; i++) {
      if (Character.isWhitespace(cs.charAt(i)) == false) {
        return false;
      }
    }
    return true;
  }
  
  public static boolean isEmpty(final CharSequence cs) {
    return cs == null || cs.length() == 0;
  }
  
  public static boolean isNumeric(final CharSequence cs) {
    if (isEmpty(cs)) {
      return false;
    }
    final int sz = cs.length();
    for (int i = 0; i < sz; i++) {
      if (!Character.isDigit(cs.charAt(i))) {
        return false;
      }
    }
    return true;
  }
  
}
