package com.ly.edu.common;

/**
 * 服务端角色 Created by luzhen on 2015/3/17.
 */
public enum WebRoleEnum {
  /** 中心级管理员 */
  CenterAdmin {
    public String getName() {
      return "中心级管理员";
    }
    
    public String getTitle() {
      return "CenterAdmin";
    }
    
    public int getValue() {
      return 99;
    }
  },
  ProvinceAdmin {
    public String getName() {
      return "省级管理员";
    }
    
    public String getTitle() {
      return "ProvinceAdmin";
    }
    
    public int getValue() {
      return 101;
    }
  },
  ProvinceDirector {
    public String getName() {
      return "省级教研室主任";
    }
    
    public String getTitle() {
      return "ProvinceDirector";
    }
    
    public int getValue() {
      return 100;
    }
  },
  /** 地市管理员 */
  CityAdmin {
    public String getName() {
      return "地市管理员";
    }
    
    public String getTitle() {
      return "CityAdmin";
    }
    
    public int getValue() {
      return 102;
    }
  },
  
  /** 地市教研室主任 */
  CityDirector {
    public String getName() {
      return "地市教研室主任";
    }
    
    public String getTitle() {
      return "CityDirector";
    }
    
    public int getValue() {
      return 98;
    }
  },
  /** 区县管理员 */
  CountyAdmin {
    public String getName() {
      return "区县管理员";
    }
    
    public String getTitle() {
      return "CountyAdmin";
    }
    
    public int getValue() {
      return 103;
    }
  },
  /** 区县教研室主任 */
  CountyDirector {
    public String getName() {
      return "区县教研室主任";
    }
    
    public String getTitle() {
      return "CountyDirector";
    }
    
    public int getValue() {
      return 97;
    }
  },
  /** 数据核查教师 */
  CheckTeacher {
    public String getName() {
      return "教师";
    }
    
    public String getTitle() {
      return "CheckTeacher";
    }
    
    public int getValue() {
      return 90;
    }
  },
  /** 运维管理 **/
  Operation {
    public String getName() {
      return "运维";
    }
    
    public String getTitle() {
      return "Operation";
    }
    
    public int getValue() {
      return 91;
    }
  },
  
  SchoolAdmin {
    public String getName() {
      return "学校管理员";
    }
    
    public String getTitle() {
      return "SchoolAdmin";
    }
    
    public int getValue() {
      return 104;
    }
  },
  
  /***
   * client的校长角色和web端的校长角色确认统一 修改此处枚举值需要确认是否需要同步修改clientrole
   * 
   */
  Headmaster {
    public String getName() {
      return "校长";
    }
    
    public String getTitle() {
      return "Headmaster";
    }
    
    public int getValue() {
      return 8;
    }
  };
  
  public abstract String getName();
  
  public abstract String getTitle();
  
  public abstract int getValue();
}
