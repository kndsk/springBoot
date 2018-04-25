package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="defaultValue")
public class DefaultValue {
  private String value;

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }
  
  
}
