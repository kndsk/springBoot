package com.ly.edu.dto;
public class OperateLogDTO {
  
  private String opTime;

  private String opUser;

  private String module;

  private String behavior;

  public String getOpTime() {
    return opTime;
  }

  public void setOpTime(String opTime) {
    this.opTime = opTime;
  }

  public String getOpUser() {
    return opUser;
  }

  public void setOpUser(String opUser) {
    this.opUser = opUser;
  }

  public String getModule() {
    return module;
  }

  public void setModule(String module) {
    this.module = module;
  }

  public String getBehavior() {
    return behavior;
  }

  public void setBehavior(String behavior) {
    this.behavior = behavior;
  }
}
