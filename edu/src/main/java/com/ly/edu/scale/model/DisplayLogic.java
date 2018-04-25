package com.ly.edu.scale.model;

import java.util.List;

/**
 * @author gangwu3
 *
 */
public class DisplayLogic {
  /*
   * 当前题Id
   */
  private String code;
  /*
   * 个选项展示组
   */
  private List<ChoiceDispalyArray> displayQN;
  public String getCode() {
    return code;
  }
  public void setCode(String code) {
    this.code = code;
  }
  public List<ChoiceDispalyArray> getDisplayQN() {
    return displayQN;
  }
  public void setDisplayQN(List<ChoiceDispalyArray> displayQN) {
    this.displayQN = displayQN;
  }
  
  
}
