package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;

public class AssessmentItemRef {
  private String identifier;
  private String href;
  private String screen;
  
  private List<BranchRule> branchRule;

  @XmlAttribute
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  @XmlAttribute
  public String getHref() {
    return href;
  }

  public void setHref(String href) {
    this.href = href;
  }

  @XmlAttribute
  public String getScreen() {
    return screen;
  }

  public void setScreen(String screen) {
    this.screen = screen;
  }

  public List<BranchRule> getBranchRule() {
    return branchRule;
  }

  public void setBranchRule(List<BranchRule> branchRule) {
    this.branchRule = branchRule;
  }
  
  
}
