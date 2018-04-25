package com.ly.edu.common;

/**
 * 客户端角色 Created by luzhen on 2015/3/10. 用户角色
 */
public enum ClientRoleEnum {
  
  STUDENT {
    
    public String getName() {
      return "学生";
    }
    
    public int getValue() {
      return 1;
    }
  },
  
  PARENT {
    public String getName() {
      return "家长";
    }
    
    public int getValue() {
      return 2;
    };
  },
  
  TEACHER {
    public String getName() {
      return "教师";
    }
    
    public int getValue() {
      return 4;
    };
  },
  
  /***
   * client的校长角色和web端的校长角色确认统一 修改此处枚举值需要确认是否需要同步修改WebRole
   * 
   */
  HEADER {
    public String getName() {
      return "校长";
    }
    
    public int getValue() {
      return 8;
    };
  };
  
  public abstract String getName();
  
  public abstract int getValue();
}
