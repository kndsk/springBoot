package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "TextEntryInteraction")
public class TextEntryInteraction {
  private String responseIdentifier;
  private String choiceLimit;

  @XmlAttribute
  public String getResponseIdentifier() {
    return responseIdentifier;
  }

  public void setResponseIdentifier(String responseIdentifier) {
    this.responseIdentifier = responseIdentifier;
  }

  @XmlAttribute
  public String getChoiceLimit() {
    return choiceLimit;
  }

  public void setChoiceLimit(String choiceLimit) {
    this.choiceLimit = choiceLimit;
  }
  
  
}
