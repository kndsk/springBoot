package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="rubricBlock")
public class RubricBlock {
  private String view;
  
  private List<Span> span;

  @XmlAttribute
  public String getView() {
    return view;
  }

  public void setView(String view) {
    this.view = view;
  }

  public List<Span> getSpan() {
    return span;
  }

  public void setSpan(List<Span> span) {
    this.span = span;
  }
  
  
}
