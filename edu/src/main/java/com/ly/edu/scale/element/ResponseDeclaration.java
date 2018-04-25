package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="ResponseDeclaration")
public class ResponseDeclaration {
  private String identifier;
  private String cardinality = "single";
  private String baseType = "identifier";
  
  @XmlAttribute
  public String getIdentifier() {
    return identifier;
  }
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }
  @XmlAttribute
  public String getCardinality() {
    return cardinality;
  }
  public void setCardinality(String cardinality) {
    this.cardinality = cardinality;
  }
  @XmlAttribute
  public String getBaseType() {
    return baseType;
  }
  public void setBaseType(String baseType) {
    this.baseType = baseType;
  }
  
}
