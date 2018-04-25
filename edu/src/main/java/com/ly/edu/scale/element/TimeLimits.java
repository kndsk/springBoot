package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="timeLimits")
public class TimeLimits {
  private String maxTime;
  private String minTime;
  @XmlAttribute
  public String getMaxTime() {
    return maxTime;
  }
  public void setMaxTime(String maxTime) {
    this.maxTime = maxTime;
  }
  @XmlAttribute
  public String getMinTime() {
    return minTime;
  }
  public void setMinTime(String minTime) {
    this.minTime = minTime;
  }
  
  
}
