package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="assessmentSection")
@XmlType(propOrder={"rubricBlock", "assessmentItemRef"})
public class AssessmentSection {
  private String identifier;
  private String title;
  private String visible;
  
  
  private RubricBlock rubricBlock;
  private List<AssessmentItemRef> assessmentItemRef;

  @XmlAttribute
  public String getIdentifier() {
    return identifier;
  }

  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }

  @XmlAttribute
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  @XmlAttribute
  public String getVisible() {
    return visible;
  }

  public void setVisible(String visible) {
    this.visible = visible;
  }
  
  public RubricBlock getRubricBlock() {
    return rubricBlock;
  }

  public void setRubricBlock(RubricBlock rubricBlock) {
    this.rubricBlock = rubricBlock;
  }

  public List<AssessmentItemRef> getAssessmentItemRef() {
    return assessmentItemRef;
  }

  public void setAssessmentItemRef(List<AssessmentItemRef> assessmentItemRef) {
    this.assessmentItemRef = assessmentItemRef;
  }
  
}
