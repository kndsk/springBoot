package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="choiceInteraction")
@XmlType(propOrder={"prompt","simpleChoice", "table", "span"})
public class ChoiceInteraction {
  private String orientation = "vertical";
  private String responseIdentifier;
  private String shuffle;
  private String maxChoices;
  
  private List<Prompt> prompt;
  private List<SimpleChoice> simpleChoice;
  private List<Span> span;
  
  //多选题,表格题专属
  private Table table;
  
  @XmlAttribute
  public String getOrientation() {
    return orientation;
  }
  public void setOrientation(String orientation) {
    this.orientation = orientation;
  }
  @XmlAttribute
  public String getResponseIdentifier() {
    return responseIdentifier;
  }
  public void setResponseIdentifier(String responseIdentifier) {
    this.responseIdentifier = responseIdentifier;
  }
  @XmlAttribute
  public String getShuffle() {
    return shuffle;
  }
  public void setShuffle(String shuffle) {
    this.shuffle = shuffle;
  }
  @XmlAttribute
  public String getMaxChoices() {
    return maxChoices;
  }
  public void setMaxChoices(String maxChoices) {
    this.maxChoices = maxChoices;
  }
  public List<Prompt> getPrompt() {
    return prompt;
  }
  public void setPrompt(List<Prompt> prompt) {
    this.prompt = prompt;
  }
  public List<SimpleChoice> getSimpleChoice() {
    return simpleChoice;
  }
  public void setSimpleChoice(List<SimpleChoice> simpleChoice) {
    this.simpleChoice = simpleChoice;
  }
  public List<Span> getSpan() {
    return span;
  }
  public void setSpan(List<Span> span) {
    this.span = span;
  }
  public Table getTable() {
    return table;
  }
  public void setTable(Table table) {
    this.table = table;
  }
  
  
}
