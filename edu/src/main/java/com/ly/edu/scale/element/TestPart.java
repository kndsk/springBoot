package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="testPart")
@XmlType(propOrder={"timeLimits", "assessmentSection"})
public class TestPart {
  private String identifier;
  private String navigationMode;
  private String submissionMode;
  
  private TimeLimits timeLimits;
  private List<AssessmentSection> assessmentSection;
  
  @XmlAttribute
  public String getIdentifier() {
    return identifier;
  }
  public void setIdentifier(String identifier) {
    this.identifier = identifier;
  }
  @XmlAttribute
  public String getNavigationMode() {
    return navigationMode;
  }
  public void setNavigationMode(String navigationMode) {
    this.navigationMode = navigationMode;
  }
  @XmlAttribute
  public String getSubmissionMode() {
    return submissionMode;
  }
  public void setSubmissionMode(String submissionMode) {
    this.submissionMode = submissionMode;
  }
  public TimeLimits getTimeLimits() {
    return timeLimits;
  }
  public void setTimeLimits(TimeLimits timeLimits) {
    this.timeLimits = timeLimits;
  }
  public List<AssessmentSection> getAssessmentSection() {
    return assessmentSection;
  }
  public void setAssessmentSection(List<AssessmentSection> assessmentSection) {
    this.assessmentSection = assessmentSection;
  }
  
}
