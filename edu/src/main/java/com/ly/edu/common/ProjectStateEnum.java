package com.ly.edu.common;

public enum ProjectStateEnum {
  
  UNPUBLISHED {
    @Override
    public int getValue() {
      return 0;
    }
  },
  
  PUBLISHED {
    @Override
    public int getValue() {
      return 1;
    }
    
  },
  
  END {
    @Override
    public int getValue() {
      return 3;
    }    
  };
  
  public abstract int getValue();
  
}
