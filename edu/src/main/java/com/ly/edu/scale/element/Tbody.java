package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "tbody")
public class Tbody {
  private List<Tr> tr;
  
  public List<Tr> getTr() {
    return tr;
  }
  
  public void setTr(List<Tr> tr) {
    this.tr = tr;
  }
  
}
