package com.ly.edu.scale.model;

public class Options {
  
  private String name;
  private String content;
  private int scoring;
  private String value;
  private int score;

  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getContent() {
    return content;
  }
  
  public void setContent(String content) {
    this.content = content;
  }
  
  public int getScoring() {
    return scoring;
  }
  
  public void setScoring(int scoring) {
    this.scoring = scoring;
  }

  public String getValue() {
    return value;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public int getScore() {
    return score;
  }

  public void setScore(int score) {
    this.score = score;
  }

  @Override
  public String toString() {
    return "Options [name=" + name + ", content=" + content + ",scoring="
        + scoring + ", value=" + value + ",score="
            + score + "]";
  }
  
}
