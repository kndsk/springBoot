package com.ly.edu.common;

/**
 * Created by hhli on 2015/12/1.
 */
public enum AreaLevelEnum {
  China {
    public String getName() {
      return "国家";
    };
    
    public int getValue() {
      return 0;
    };
  },
  Province {
    public String getName() {
      return "省份";
    };
    
    public int getValue() {
      return 1;
    };
  },
  City {
    public String getName() {
      return "地市";
    };
    
    public int getValue() {
      return 2;
    };
  },
  District {
    public String getName() {
      return "区县";
    };
    
    public int getValue() {
      return 3;
    };
  },
  School {
    public String getName() {
      return "学校";
    };
    
    public int getValue() {
      return 4;
    };
  },
  Grade {
    public String getName() {
      return "年级";
    };
    
    public int getValue() {
      return 5;
    };
  },
  Clazz {
    public String getName() {
      return "班级";
    };
    
    public int getValue() {
      return 6;
    };
  };
  public abstract String getName();
  
  public abstract int getValue();
}
