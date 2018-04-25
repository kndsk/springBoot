package com.ly.edu.scale.model;

import java.util.List;

/**
 * @author gangwu3
 *  跳转逻辑
 */
public class JumpLogic {
  /*
   * 题号
   */
  private String code;
  /*
   * source:target
   */
  private List<Option> sts;

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public List<Option> getSts() {
    return sts;
  }

  public void setSts(List<Option> sts) {
    this.sts = sts;
  }
  
  
}
