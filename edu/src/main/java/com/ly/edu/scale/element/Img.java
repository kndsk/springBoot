package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="img")
public class Img {
  private String src;

  @XmlAttribute
  public String getSrc() {
    return src;
  }

  public void setSrc(String src) {
    this.src = src;
  }
  
  
}
