package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="simpleChoice")
public class SimpleChoice {
  private String identifier;
  private String fillBlankChoice;
  
  private List<Span> span;

  @XmlAttribute
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  @XmlAttribute
  public String getFillBlankChoice() {
    return fillBlankChoice;
  }

  public void setFillBlankChoice(String fillBlankChoice) {
    this.fillBlankChoice = fillBlankChoice;
  }

  public List<Span> getSpan() {
    return span;
  }

  public void setSpan(List<Span> span) {
    this.span = span;
  }
  
  
}
