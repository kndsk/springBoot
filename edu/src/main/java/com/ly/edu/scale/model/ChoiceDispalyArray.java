package com.ly.edu.scale.model;

import java.util.List;

/**
 * @author gangwu3
 *
 */
public class ChoiceDispalyArray {
  /*
   * 选项名称
   */
  private String name;
  /*
   * 选项控制展示题组
   */
  private List<Option> qn;
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public List<Option> getQn() {
    return qn;
  }
  public void setQn(List<Option> qn) {
    this.qn = qn;
  }
  
}
