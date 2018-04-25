package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="table")
public class Table {
  private Tbody tbody;
  private List<Tr> tr;
  
  public Tbody getTbody() {
    return tbody;
  }
  public void setTbody(Tbody tbody) {
    this.tbody = tbody;
  }
  public List<Tr> getTr() {
    return tr;
  }
  public void setTr(List<Tr> tr) {
    this.tr = tr;
  }
  
  
}
