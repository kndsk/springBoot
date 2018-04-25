package com.ly.edu.common;

/**
 * Created by gyxu on 16/4/21.
 */
public enum QuestionTypeEnum {
  // 单选题
  SIGLECHOICE {
    @Override
    public int getValue() {
      return 1;
    }
    
    @Override
    public String getName() {
      return "singleChoice";
    }
  },
  
  // 多选题
  MULCHOICE {
    @Override
    public int getValue() {
      return 2;
    }
    
    @Override
    public String getName() {
      return "multiChoice";
    }
  },
  
  // 填空题
  FILLINBALK {
    @Override
    public int getValue() {
      return 3;
    }
    
    @Override
    public String getName() {
      return "fillBlank";
    }
  },
  
  // 单选填空题
  SIGLECHOICEBLANK {
    @Override
    public int getValue() {
      return 4;
    }
    
    @Override
    public String getName() {
      return "singleChoiceFillBlank";
    }
  },
  
  // 多选填空题
  MULCHOICEBLANK {
    @Override
    public int getValue() {
      return 5;
    }
    
    @Override
    public String getName() {
      return "multiChoiceFillBlank";
    }
  },
  
  // 表格题
  TABLEQUESTION {
    @Override
    public int getValue() {
      return 6;
    }
    
    @Override
    public String getName() {
      return "table";
    }
  },
  
  SORTQUESTION {
    @Override
    public int getValue() {
      return 7;
    }
    
    @Override
    public String getName() {
      return "sort";
    }
  },
  
  SLIDERQUESTION {
    @Override
    public int getValue() {
      return 8;
    }
    
    @Override
    public String getName() {
      return "slider";
    }
  },
  
  SHORTANSWER{
    @Override
    public int getValue(){
      return 3;
    }
    
    @Override
    public String getName(){
      return "shortAnswer";
    }
  };
  
  public abstract int getValue();
  
  public abstract String getName();
}
