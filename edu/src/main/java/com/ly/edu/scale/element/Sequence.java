package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="sequence")
public class Sequence {
  private String span;

  public String getSpan() {
    return span;
  }

  public void setSpan(String span) {
    this.span = span;
  }
  
}
