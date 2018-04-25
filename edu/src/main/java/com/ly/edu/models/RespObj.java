package com.ly.edu.models;
public class RespObj {
  
  // 请求的结果
  private boolean result;
  // 返回的数据对象
  private Object obj;
  // 返回的消息
  private String message;
  
  public RespObj(boolean result, Object obj, String message) {
    this.result = result;
    this.obj = obj;
    this.message = message;
  }

  public boolean isResult() {
    return result;
  }
  
  public void setResult(boolean result) {
    this.result = result;
  }
  
  public Object getObj() {
    return obj;
  }
  
  public void setObj(Object obj) {
    this.obj = obj;
  }
  
  public String getMessage() {
    return message;
  }
  
  public void setMessage(String message) {
    this.message = message;
  }
  
}
