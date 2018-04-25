package com.ly.edu.common;

public enum CategoryEnum {
  
  All {
    @Override
    public int getValue() {
      return 0;
    }
    
    @Override
    public String getFieldName() {
      return null;
    }
    
    @Override
    public String getFieldId() {
      return null;
    }
  },
  
  City {
    
    @Override
    public int getValue() {
      return 1;
    }
    
    @Override
    public String getFieldName() {
      return "city_name";
    }
    
    @Override
    public String getFieldId() {
      return "city_id";
    }
  },
  
  District {
    
    @Override
    public int getValue() {
      return 2;
    }
    
    @Override
    public String getFieldName() {
      return "district_name";
    }
    
    @Override
    public String getFieldId() {
      return "district_id";
    }
  },
  
  School {
    
    @Override
    public int getValue() {
      return 3;
    }
    
    @Override
    public String getFieldName() {
      return "school_name";
    }
    
    @Override
    public String getFieldId() {
      return "school_id";
    }
  };
  
  public abstract int getValue();
  
  public abstract String getFieldName();
  
  public abstract String getFieldId();
}
