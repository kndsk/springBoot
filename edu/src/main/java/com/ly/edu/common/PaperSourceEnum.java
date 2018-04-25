package com.ly.edu.common;

/**
 * 问卷来源枚举
 *
 */
public enum PaperSourceEnum {
  GoodScale {
    public String getName() {
      return "精品量表";
    }
    
    public int getValue() {
      return 0;
    }
  },
  
  CategoryPaper {
    public String getName() {
      return "模板导入";
    }
    
    public int getValue() {
      return 1;
    }
  },
  
  TemplateImport {
    public String getName() {
      return "维度组卷";
    }
    
    public int getValue() {
      return 2;
    }
  };
  
  public abstract String getName();
  
  public abstract int getValue();
}
