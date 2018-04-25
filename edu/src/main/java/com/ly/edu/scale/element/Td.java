package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="td")
public class Td {
  private String style;
  
  private Prompt prompt;
  private SimpleChoice simpleChoice;
  private List<Span> span;
  
  @XmlAttribute
  public String getStyle() {
    return style;
  }
  public void setStyle(String style) {
    this.style = style;
  }
  public Prompt getPrompt() {
    return prompt;
  }
  public void setPrompt(Prompt prompt) {
    this.prompt = prompt;
  }
  public SimpleChoice getSimpleChoice() {
    return simpleChoice;
  }
  public void setSimpleChoice(SimpleChoice simpleChoice) {
    this.simpleChoice = simpleChoice;
  }
  public List<Span> getSpan() {
    return span;
  }
  public void setSpan(List<Span> span) {
    this.span = span;
  }
  
  
}
