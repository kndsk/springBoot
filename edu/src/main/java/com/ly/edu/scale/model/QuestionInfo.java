package com.ly.edu.scale.model;

import java.util.List;

/**
 * @author gangwu3
 *
 */
public class QuestionInfo {
  //序号
  private Integer tableNumber;
  //题号
  private String questionNumber;
  //屏幕序号
  private Integer screenNumber;
  //同题标志
  private String sameFlag;
  //指导语
  private String guideLanguage;
  //标题
  private String title;
  //选项
  private List<ChoiceInfo> choice;
  //题型
  private Integer questionType;
  //计分方式
  private String countScoreWay;
  //限定条件
  private String constraints;
  //跳转
  private String jump;
  //题目属性
  private String structure;
  //群体变量
  private String demographic;
  //总维度
  private String dimension;
  //一级指标
  private String firstIndex;
  //二级指标
  private String secondIndex;
  //三级指标
  private String thirdIndex;
  //关键字
  private String keyWord;
  public Integer getTableNumber() {
    return tableNumber;
  }
  public void setTableNumber(Integer tableNumber) {
    this.tableNumber = tableNumber;
  }
  public String getQuestionNumber() {
    return questionNumber;
  }
  public void setQuestionNumber(String questionNumber) {
    this.questionNumber = questionNumber;
  }
  public Integer getScreenNumber() {
    return screenNumber;
  }
  public void setScreenNumber(Integer screenNumber) {
    this.screenNumber = screenNumber;
  }
  public String getSameFlag() {
    return sameFlag;
  }
  public void setSameFlag(String sameFlag) {
    this.sameFlag = sameFlag;
  }
  public String getGuideLanguage() {
    return guideLanguage;
  }
  public void setGuideLanguage(String guideLanguage) {
    this.guideLanguage = guideLanguage;
  }
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }
  public List<ChoiceInfo> getChoice() {
    return choice;
  }
  public void setChoice(List<ChoiceInfo> choice) {
    this.choice = choice;
  }
  public Integer getQuestionType() {
    return questionType;
  }
  public void setQuestionType(Integer questionType) {
    this.questionType = questionType;
  }
  public String getCountScoreWay() {
    return countScoreWay;
  }
  public void setCountScoreWay(String countScoreWay) {
    this.countScoreWay = countScoreWay;
  }
  public String getConstraints() {
    return constraints;
  }
  public void setConstraints(String constraints) {
    this.constraints = constraints;
  }
  public String getJump() {
    return jump;
  }
  public void setJump(String jump) {
    this.jump = jump;
  }
  public String getStructure() {
    return structure;
  }
  public void setStructure(String structure) {
    this.structure = structure;
  }
  public String getDemographic() {
    return demographic;
  }
  public void setDemographic(String demographic) {
    this.demographic = demographic;
  }
  public String getDimension() {
    return dimension;
  }
  public void setDimension(String dimension) {
    this.dimension = dimension;
  }
  public String getFirstIndex() {
    return firstIndex;
  }
  public void setFirstIndex(String firstIndex) {
    this.firstIndex = firstIndex;
  }
  public String getSecondIndex() {
    return secondIndex;
  }
  public void setSecondIndex(String secondIndex) {
    this.secondIndex = secondIndex;
  }
  public String getThirdIndex() {
    return thirdIndex;
  }
  public void setThirdIndex(String thirdIndex) {
    this.thirdIndex = thirdIndex;
  }
  public String getKeyWord() {
    return keyWord;
  }
  public void setKeyWord(String keyWord) {
    this.keyWord = keyWord;
  }
  

}
