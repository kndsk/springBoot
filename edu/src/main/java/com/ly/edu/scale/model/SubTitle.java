package com.ly.edu.scale.model;

import java.util.List;

/**
 * @author gangwu3
 * 子题title组
 */
public class SubTitle {
  /*
   * 同组大标题
   */
  private String groupTitle;
  /*
   * 标题组
   */
  private List<Title> titles;
  
  public String getGroupTitle() {
    return groupTitle;
  }
  public void setGroupTitle(String groupTitle) {
    this.groupTitle = groupTitle;
  }
  public List<Title> getTitles() {
    return titles;
  }
  public void setTitles(List<Title> titles) {
    this.titles = titles;
  }
  
  
}
