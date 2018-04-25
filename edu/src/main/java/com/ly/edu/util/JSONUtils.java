package com.ly.edu.util;

import java.io.IOException;
import java.util.List;

import com.alibaba.fastjson.JSON;
import org.codehaus.jackson.map.ObjectMapper;

/**
 * 对JSON处理的二次封装，便于以后使用其他的JSON处理包。
 * 
 * @author 黄伟
 *
 */
public class JSONUtils {
  
  /**
   * 将对象转为json串
   * 
   * @param object
   *          待转换对象
   * @return json串
   */
  public static String toJSONString(Object object) {
    return JSON.toJSONString(object);
  }

  /**
   * 将对象转为json串
   * @param object 待转换对象
   * @return json串
   */
  public static String jacksonToJSONString(Object object) {
    ObjectMapper mapper = new ObjectMapper();
    String result = "";
    try {
      result = mapper.writeValueAsString(object);
    } catch (IOException e) {
      e.printStackTrace();
    }
    return result;
  }

  /**
   * 将json串解析为对象
   * 
   * @param text
   *          json字符串
   * @param <T>
   *          返回实体
   * @param clazz
   *          对象类型
   * @return 对象
   */
  public static <T> T parseObject(String text, Class<T> clazz) {
    return JSON.parseObject(text, clazz);
  }
  
  /**
   * 将json字符串解析为对象
   * 
   * @param text
   *          json字符串
   * @param clazz
   *          对象模型
   * @param <T>
   *          返回实体类型
   * @return 对象
   */
  public static <T> List<T> parseList(String text, Class<T> clazz) {
    return JSON.parseArray(text, clazz);
  }
}
