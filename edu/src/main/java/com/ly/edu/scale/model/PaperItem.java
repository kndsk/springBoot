package com.ly.edu.scale.model;

/**
 * @author gangwu3
 * 试题父类  段落
 */
public class PaperItem {
  /*
   * id
   */
  private Integer id;
  /*
   * paperId
   */
  private Integer paperId;
  /*
   * 顺序
   */
  private Integer index;
  /*
   * 统计学code
   */
  private String statisticsCode;
  /*
   * 试题指导语
   */
  private String instruction;
  /*
   * 试题类型
   */
  private Integer type;
  /*
   * 题干
   */
  private String questionTitle;
  /*
   * 是否是组合题
   */
  private boolean isCombine;
  /*
   * 组合题父题ID
   */
  private Integer parentId;
  
  public Integer getId() {
    return id;
  }
  public void setId(Integer id) {
    this.id = id;
  }
  public String getInstruction() {
    return instruction;
  }
  public void setInstruction(String instruction) {
    this.instruction = instruction;
  }
  public String getQuestionTitle() {
    return questionTitle;
  }
  public void setQuestionTitle(String questionTitle) {
    this.questionTitle = questionTitle;
  }
  public Integer getIndex() {
    return index;
  }
  public void setIndex(Integer index) {
    this.index = index;
  }
  public String getStatisticsCode() {
    return statisticsCode;
  }
  public void setStatisticsCode(String statisticsCode) {
    this.statisticsCode = statisticsCode;
  }
  public Integer getType() {
    return type;
  }
  public void setType(Integer type) {
    this.type = type;
  }
  public Integer getPaperId() {
    return paperId;
  }
  public void setPaperId(Integer paperId) {
    this.paperId = paperId;
  }

  public boolean isCombine() {
    return isCombine;
  }
  public void setCombine(boolean isCombine) {
    this.isCombine = isCombine;
  }
  public Integer getParentId() {
    return parentId;
  }
  public void setParentId(Integer parentId) {
    this.parentId = parentId;
  }
  
}
