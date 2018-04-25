package com.ly.edu.scale.model;

public class Jumps {
  private String name;
  private String target;
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getTarget() {
    return target;
  }
  
  public void setTarget(String target) {
    this.target = target;
  }
  
  @Override
  public String toString() {
    return "JumpsDTO [name=" + name + ", target=" + target + "]";
  }
}
