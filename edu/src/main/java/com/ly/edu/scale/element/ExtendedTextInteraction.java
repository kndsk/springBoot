package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="extendedTextInteraction")
public class ExtendedTextInteraction {
  private String responseIdentifier;

  @XmlAttribute
  public String getResponseIdentifier() {
    return responseIdentifier;
  }

  public void setResponseIdentifier(String responseIdentifier) {
    this.responseIdentifier = responseIdentifier;
  }
}
