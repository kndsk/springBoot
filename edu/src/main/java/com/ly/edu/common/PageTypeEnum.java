package com.ly.edu.common;

/**
 * 纸张大小枚举类
 * 
 * @author zhangchm
 *
 */
public enum PageTypeEnum {
  A3 {
    public String getName() {
      return "A3";
    }
  },
  A4 {
    public String getName() {
      return "A4";
    }
  };
  public abstract String getName();
}
