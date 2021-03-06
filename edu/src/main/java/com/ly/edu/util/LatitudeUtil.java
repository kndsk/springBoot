package com.ly.edu.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

public class LatitudeUtil {
  
  
  public static final String KEY_1 = "7d9fbeb43e975cd1e9477a7e5d5e192a";
  public static Map<String, String> getGeocoderLatitude(String address){
    BufferedReader in = null;
    try {
      address = URLEncoder.encode(address, "UTF-8");
      URL tirc = new URL("http://api.map.baidu.com/geocoder?address="
          + address + "&output=json&key=" + KEY_1);
      in = new BufferedReader(new InputStreamReader(tirc.openStream(),
          "UTF-8"));
      String res;
      StringBuilder strBld = new StringBuilder("");
      while ((res = in.readLine()) != null) {
        strBld.append(res.trim());
      }
      String str = strBld.toString();
      Map<String, String> map = null;
      if (!StringUtils.isEmpty(str)) {
        int lngStart = str.indexOf("lng\":");
        int lngEnd = str.indexOf(",\"lat");
        int latEnd = str.indexOf("},\"precise");
        if (lngStart > 0 && lngEnd > 0 && latEnd > 0) {
          String lng = str.substring(lngStart + 5, lngEnd);
          String lat = str.substring(lngEnd + 7, latEnd);
          map = new HashMap<String, String>();
          map.put("lng", lng);
          map.put("lat", lat);
          return map;
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      try {
        in.close();
      } catch (Exception e2) {
        e2.printStackTrace();
      }
    }
    return null;
  }
}