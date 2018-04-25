package com.ly.edu.common;

/**
 * 学科 Created by maning on 2016/11/17. 学科内容
 */
public enum SubjectEnum {

  HEADER_PAPER {
    
    public String getName() {
      return "校长问卷";
    }
    
    public int getValue() {
      return 1;
    }
  },

  TEACHER_PAPER {
    public String getName() {
      return "教师公共问卷";
    }
    
    public int getValue() {
      return 2;
    };
  },
  
  MASTERTEA_PAPER {
    public String getName() {
      return "班主任问卷";
    }
    
    public int getValue() {
      return 3;
    };
  },

  MORAL_SOCIAL_PAPER {
    public String getName() {
      return "品德与社会问卷";
    }
    
    public int getValue() {
      return 4;
    };
  },

  SCIENCE_PAPER {
    public String getName() {
      return "科学问卷";
    }

    public int getValue() {
      return 5;
    };
  },

  PHYSICAL_PAPER {
    public String getName() {
      return "物理问卷";
    }

    public int getValue() {
      return 6;
    };
  },

  BIOLOGICAL_PAPER {
    public String getName() {
      return "生物问卷";
    }

    public int getValue() {
      return 7;
    };
  },

  GEOGRAPHY_PAPER {
    public String getName() {
      return "地理问卷";
    }

    public int getValue() {
      return 8;
    };
  },

  IDEOLOGICAL_PAPER {
    public String getName() {
      return "思想品德问卷";
    }

    public int getValue() {
      return 9;
    };
  },

  NATURE_PAPER {
    public String getName() {
      return "科学(自然)问卷";
    }

    public int getValue() {
      return 10;
    };
  };
  
  public abstract String getName();
  
  public abstract int getValue();
}
