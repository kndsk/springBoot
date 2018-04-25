package com.ly.edu.scale.model;

/**
 * @author gangwu3
 *
 */
public class ExcelPicture {
//图片在excel中的行号
  private int row;
  // 图片在excel中列号
  private int column;
  // 图片base64码
  private String base64Code;
  
  public int getRow() {
    return this.row;
  }
  
  public ExcelPicture(int row, int column, String base64Code) {
    this.row = row;
    this.column = column;
    this.base64Code = base64Code;
  }
  
  public int getColumn() {
    return this.column;
  }
  
  public String getBase64Code() {
    return this.base64Code;
  }
  
  public void setRow(int row) {
    this.row = row;
  }
  
  public void setColumn(int column) {
    this.column = column;
  }
}
