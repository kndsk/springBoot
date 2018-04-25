package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="prompt")
@XmlType(propOrder = { "sequence", "span"})
public class Prompt {
  private String area;
  
  private Sequence sequence;
  private List<Span> span;
  public Sequence getSequence() {
    return sequence;
  }
  
  @XmlAttribute
  public String getArea() {
    return area;
  }
  public void setArea(String area) {
    this.area = area;
  }

  public void setSequence(Sequence sequence) {
    this.sequence = sequence;
  }
  public List<Span> getSpan() {
    return span;
  }
  public void setSpan(List<Span> span) {
    this.span = span;
  }
  
  
}
