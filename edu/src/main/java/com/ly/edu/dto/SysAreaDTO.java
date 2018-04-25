package com.ly.edu.dto;

public class SysAreaDTO {
  private String areaName;
  private String areaCode;
  private String id;
  private String delFlag;
  private String type;
  private String countryId;
  private String provinceId;
  private String cityId;
  private String districtId;
  private String cityName;

  public String getCityName() {
    return cityName;
  }
  public void setCityName(String cityName) {
    this.cityName = cityName;
  }
  public String getId() {
    return id;
  }
  public void setId(String id) {
    this.id = id;
  }
  public String getDelFlag() {
    return delFlag;
  }
  public void setDelFlag(String delFlag) {
    this.delFlag = delFlag;
  }
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }
  public String getCountryId() {
    return countryId;
  }
  public void setCountryId(String countryId) {
    this.countryId = countryId;
  }
  public String getProvinceId() {
    return provinceId;
  }
  public void setProvinceId(String provinceId) {
    this.provinceId = provinceId;
  }
  public String getCityId() {
    return cityId;
  }
  public void setCityId(String cityId) {
    this.cityId = cityId;
  }
  public String getDistrictId() {
    return districtId;
  }
  public void setDistrictId(String districtId) {
    this.districtId = districtId;
  }
  public String getAreaName() {
    return areaName;
  }
  public void setAreaName(String areaName) {
    this.areaName = areaName;
  }
  public String getAreaCode() {
    return areaCode;
  }
  public void setAreaCode(String areaCode) {
    this.areaCode = areaCode;
  }
}