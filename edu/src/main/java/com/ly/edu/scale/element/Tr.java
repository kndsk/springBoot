package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="tr")
public class Tr {
  private List<Td> td;

  public List<Td> getTd() {
    return td;
  }

  public void setTd(List<Td> td) {
    this.td = td;
  }
  
  
}
