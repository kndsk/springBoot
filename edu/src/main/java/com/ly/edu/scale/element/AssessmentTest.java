package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement
@XmlType(propOrder={"outcomeDeclaration", "testPart"})
public class AssessmentTest {
  private String identifier;
  private String title;
  
  private OutcomeDeclaration outcomeDeclaration;
  private TestPart testPart;
  
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
  public OutcomeDeclaration getOutcomeDeclaration() {
    return outcomeDeclaration;
  }
  public void setOutcomeDeclaration(OutcomeDeclaration outcomeDeclaration) {
    this.outcomeDeclaration = outcomeDeclaration;
  }
  public TestPart getTestPart() {
    return testPart;
  }
  public void setTestPart(TestPart testPart) {
    this.testPart = testPart;
  }
  
}
