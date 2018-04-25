package com.ly.edu.common;

/**
 * 问卷来源枚举
 *
 */
public enum PaperStateEnum {
  NOTPUBLISH {
    public String getName() {
      return "未发布";
    }
    
    public int getValue() {
      return 0;
    }
  },
  
  HADPUBLISH {
    public String getName() {
      return "已发布";
    }
    
    public int getValue() {
      return 1;
    }
  },
  HADUSE {
    public String getName() {
      return "已使用";
    }
    
    public int getValue() {
      return 2;
    }
  };
  public abstract String getName();
  
  public abstract int getValue();
}
