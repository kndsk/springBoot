package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="outcomeDeclaration")
public class OutcomeDeclaration {
  private String identifier;
  private String cardinality = "single";
  private String baseType = "float";
  
  private DefaultValue defaultValue;
  
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
  public DefaultValue getDefaultValue() {
    return defaultValue;
  }
  public void setDefaultValue(DefaultValue defaultValue) {
    this.defaultValue = defaultValue;
  }
  
  
}
