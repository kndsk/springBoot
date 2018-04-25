package com.ly.edu.util;

import sun.misc.BASE64Encoder;

public class Byte2Base64 {
  
  // byte数组转换成字符串
  public static String byte2Base64(byte[] data) {
    BASE64Encoder encoder = new BASE64Encoder();
    return encoder.encode(data);
  }
  
}
