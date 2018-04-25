package com.ly.edu.scale.element;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(name="itemBody")
@XmlType(propOrder={"choiceInteraction", "prompt", "sequence", "span"})
public class ItemBody {
  private ChoiceInteraction choiceInteraction;
  
  //填空类
  private Prompt prompt;
  private Sequence sequence;
  private List<Span> span;
  

  public ChoiceInteraction getChoiceInteraction() {
    return choiceInteraction;
  }

  public void setChoiceInteraction(ChoiceInteraction choiceInteraction) {
    this.choiceInteraction = choiceInteraction;
  }

  public Prompt getPrompt() {
    return prompt;
  }

  public void setPrompt(Prompt prompt) {
    this.prompt = prompt;
  }

  public Sequence getSequence() {
    return sequence;
  }

  public void setSequence(Sequence sequence) {
    this.sequence = sequence;
  }

  public List<Span> getSpan() {
    return span;
  }

  public void setSpan(List<Span> span) {
    this.span = span;
  }
  
  
}
