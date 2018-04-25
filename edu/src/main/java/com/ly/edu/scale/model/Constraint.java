package com.ly.edu.scale.model;

/**
 * @author gangwu3
 *
 */
public class Constraint {
  /*
   * index
   */
  private int index;
  /*
     英文名
    "0"：  表示文本（设置填写多少个字。一个英语字母算一个汉字）
	"1": 表示数字：可以整数也可以小数
	"2": 小数
	"3": 整数
	"4": 幅度
   */
  private String eName;
  /*
   * 中文名
   */
  private String cName;
  /*
   * 最小值
   */
  private Float minNum;
  /*
   * 最大值
   */
  private Float maxNum;
  /*
   * 小数位
   */
  private Float pointNumLen;
  /*
   * 行数
   */
  private int rowNum;
  
  /**
   * 幅度
   */
  private String range;
  
  /**
   * 是否开启滑块（填空题）
   */
  private String rangeFlag;
  
  public int getIndex() {
    return index;
  }
  public void setIndex(int index) {
    this.index = index;
  }
  public String geteName() {
    return eName;
  }
  public void seteName(String eName) {
    this.eName = eName;
  }
  public String getcName() {
    return cName;
  }
  public void setcName(String cName) {
    this.cName = cName;
  }
  public Float getMinNum() {
    return minNum;
  }
  public void setMinNum(Float minNum) {
    this.minNum = minNum;
  }
  public Float getMaxNum() {
    return maxNum;
  }
  public void setMaxNum(Float maxNum) {
    this.maxNum = maxNum;
  }
  public Float getPointNumLen() {
    return pointNumLen;
  }
  public void setPointNumLen(Float pointNumLen) {
    this.pointNumLen = pointNumLen;
  }
  public int getRowNum() {
    return rowNum;
  }
  public void setRowNum(int rowNum) {
    this.rowNum = rowNum;
  }
  public String getRange() {
    return range;
  }
  public void setRange(String range) {
    this.range = range;
  }
  public String getRangeFlag() {
    return rangeFlag;
  }
  public void setRangeFlag(String rangeFlag) {
    this.rangeFlag = rangeFlag;
  }
  
}
