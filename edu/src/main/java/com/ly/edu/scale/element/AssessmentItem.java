package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="assessmentItem")
@XmlType(propOrder = { "responseDeclaration", "outcomeDeclaration", "itemBody","responseProcessing"})
public class AssessmentItem {
  private String identifier = "choice";
  private String title = "";
  private String adaptive = "false";
  private String timeDependent = "false";
  private String clazz;
  private String blankChoice;
  private String choiceLimit;
  
  private String quesType;
  private String quesNum;
  //二级指标/关键字
  private String keyword;
  private String demographic;
  private String demension;
  private String firstIndex;
  private String secondIndex;
  private String thirdIndex;
  private String structure;
  private String scoreWay;
  private String sameFlag;
  private String constraints;
  private String jump;
  
  private List<ResponseDeclaration> responseDeclaration;
  private OutcomeDeclaration outcomeDeclaration;
  private ItemBody itemBody;
  
  private ResponseProcessing responseProcessing;
  
  @XmlAttribute
  public String getIdentifier() {
    return identifier;
  }
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }
  @XmlAttribute
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }
  @XmlAttribute
  public String getAdaptive() {
    return adaptive;
  }
  public void setAdaptive(String adaptive) {
    this.adaptive = adaptive;
  }
  @XmlAttribute
  public String getTimeDependent() {
    return timeDependent;
  }
  public void setTimeDependent(String timeDependent) {
    this.timeDependent = timeDependent;
  }
  @XmlAttribute(name="class")
  public String getClazz() {
    return clazz;
  }
  public void setClazz(String clazz) {
    this.clazz = clazz;
  }
  @XmlAttribute
  public String getBlankChoice() {
    return blankChoice;
  }
  public void setBlankChoice(String blankChoice) {
    this.blankChoice = blankChoice;
  }
  @XmlAttribute
  public String getChoiceLimit() {
    return choiceLimit;
  }
  public void setChoiceLimit(String choiceLimit) {
    this.choiceLimit = choiceLimit;
  }
  
  public List<ResponseDeclaration> getResponseDeclaration() {
    return responseDeclaration;
  }
  public void setResponseDeclaration(List<ResponseDeclaration> responseDeclaration) {
    this.responseDeclaration = responseDeclaration;
  }
  public OutcomeDeclaration getOutcomeDeclaration() {
    return outcomeDeclaration;
  }
  public void setOutcomeDeclaration(OutcomeDeclaration outcomeDeclaration) {
    this.outcomeDeclaration = outcomeDeclaration;
  }
  public ItemBody getItemBody() {
    return itemBody;
  }
  public void setItemBody(ItemBody itemBody) {
    this.itemBody = itemBody;
  }
  public ResponseProcessing getResponseProcessing() {
    return responseProcessing;
  }
  public void setResponseProcessing(ResponseProcessing responseProcessing) {
    this.responseProcessing = responseProcessing;
  }
  @XmlAttribute
  public String getQuesType() {
    return quesType;
  }
  public void setQuesType(String quesType) {
    this.quesType = quesType;
  }
  @XmlAttribute
  public String getQuesNum() {
    return quesNum;
  }
  public void setQuesNum(String quesNum) {
    this.quesNum = quesNum;
  }
  @XmlAttribute
  public String getDemographic() {
    return demographic;
  }
  public void setDemographic(String demographic) {
    this.demographic = demographic;
  }
  @XmlAttribute
  public String getDemension() {
    return demension;
  }
  public void setDemension(String demension) {
    this.demension = demension;
  }
  @XmlAttribute
  public String getFirstIndex() {
    return firstIndex;
  }
  public void setFirstIndex(String firstIndex) {
    this.firstIndex = firstIndex;
  }
  @XmlAttribute
  public String getThirdIndex() {
    return thirdIndex;
  }
  public void setThirdIndex(String thirdIndex) {
    this.thirdIndex = thirdIndex;
  }
  @XmlAttribute
  public String getStructure() {
    return structure;
  }
  public void setStructure(String structure) {
    this.structure = structure;
  }
  @XmlAttribute
  public String getScoreWay() {
    return scoreWay;
  }
  public void setScoreWay(String scoreWay) {
    this.scoreWay = scoreWay;
  }
  @XmlAttribute
  public String getSameFlag() {
    return sameFlag;
  }
  public void setSameFlag(String sameFlag) {
    this.sameFlag = sameFlag;
  }
  @XmlAttribute
  public String getConstraints() {
    return constraints;
  }
  public void setConstraints(String constraints) {
    this.constraints = constraints;
  }
  @XmlAttribute
  public String getJump() {
    return jump;
  }
  public void setJump(String jump) {
    this.jump = jump;
  }
  @XmlAttribute
  public String getKeyword() {
    return keyword;
  }
  public void setKeyword(String keyword) {
    this.keyword = keyword;
  }
  @XmlAttribute
  public String getSecondIndex() {
    return secondIndex;
  }
  public void setSecondIndex(String secondIndex) {
    this.secondIndex = secondIndex;
  }
  
  
}
