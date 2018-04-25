package com.ly.edu.common;

/**
 * 学段枚举
 */
public enum SectionEnum {
  /** 小学 */
  PRIMARY {
    public String getName() {
      return "小学";
    }
    
    public int getValue() {
      return 0;
    }
  },
  
  /** 初中 */
  MIDDLE {
    public String getName() {
      return "初中";
    }
    
    public int getValue() {
      return 1;
    }
  },
  
  /** 高中 */
  HIGH {
    public String getName() {
      return "高中";
    }
    
    public int getValue() {
      return 2;
    }
  },
  
  /** 全部 */
  ALL {
    public String getName() {
      return "全部";
    }
    
    public int getValue() {
      return 3;
    }
  };
  
  public abstract String getName();
  
  public abstract int getValue();
}
