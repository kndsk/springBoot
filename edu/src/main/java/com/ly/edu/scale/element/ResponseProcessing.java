package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="responseProcessing")
public class ResponseProcessing {
  private String template = "http://www.imsglobal.org/question/qti_v2p1/rptemplates/match_correct";

  @XmlAttribute
  public String getTemplate() {
    return template;
  }

  public void setTemplate(String template) {
    this.template = template;
  }
  
  
}
