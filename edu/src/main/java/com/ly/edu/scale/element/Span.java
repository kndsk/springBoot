package com.ly.edu.scale.element;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;

@XmlRootElement(name="Span")
@XmlType(propOrder={"br", "span", "textEntryInteraction", "extendedTextInteraction", "img"})
public class Span {
  private String style;
  
  private Br br;
  private String span;
  private TextEntryInteraction textEntryInteraction;
  private ExtendedTextInteraction extendedTextInteraction;
  private Img img;
  
  @XmlAttribute
  public String getStyle() {
    return style;
  }

  public void setStyle(String style) {
    this.style = style;
  }
  
  
  public Br getBr() {
    return br;
  }

  public void setBr(Br br) {
    this.br = br;
  }

  public String getSpan() {
    return span;
  }
  public void setSpan(String span) {
    this.span = span;
  }
  public TextEntryInteraction getTextEntryInteraction() {
    return textEntryInteraction;
  }
  public void setTextEntryInteraction(TextEntryInteraction textEntryInteraction) {
    this.textEntryInteraction = textEntryInteraction;
  }

  public ExtendedTextInteraction getExtendedTextInteraction() {
    return extendedTextInteraction;
  }

  public void setExtendedTextInteraction(
      ExtendedTextInteraction extendedTextInteraction) {
    this.extendedTextInteraction = extendedTextInteraction;
  }

  public Img getImg() {
    return img;
  }
  public void setImg(Img img) {
    this.img = img;
  }
  
  
  
}
