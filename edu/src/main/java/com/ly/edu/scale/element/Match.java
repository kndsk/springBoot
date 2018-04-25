package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="match")
@XmlType(propOrder={"variable", "baseValue"})
public class Match {
  private Variable variable;
  private BaseValue baseValue;
  public Variable getVariable() {
    return variable;
  }
  public void setVariable(Variable variable) {
    this.variable = variable;
  }
  public BaseValue getBaseValue() {
    return baseValue;
  }
  public void setBaseValue(BaseValue baseValue) {
    this.baseValue = baseValue;
  }
  
  
}
