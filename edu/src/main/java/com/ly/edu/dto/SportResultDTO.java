package com.ly.edu.dto;

import com.ly.edu.domain.SportResult;

/**
 * 体育成绩扩展类
 */
public class SportResultDTO extends SportResult{
    //学生条形码
    private String barcode;
    //学生姓名
    private String stuName;
    //学生性别 0 男 1 女
    private int sex;
    //学生班级
    private String className;
    //学校ID
    private String schoolId;
    //录入年份
    private int inputYear;
    //考场号
    private String examRoom;
    //学校代号
    private String schoolCode;
    //区县号
    private String countryCode;
    //省份代号
    private String provinceCode;
    //项目ID
    private String projectId;
    //是否修改条形码 0 未修改 1 修改
    private int barcodeStatus;

    public int getCurrentModify() {
        return currentModify;
    }

    public void setCurrentModify(int currentModify) {
        this.currentModify = currentModify;
    }

    //本次是否修改 0 未修改  1 修改
    private int currentModify;

    public int getBarcodeStatus() {
        return barcodeStatus;
    }

    public void setBarcodeStatus(int barcodeStatus) {
        this.barcodeStatus = barcodeStatus;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getSchoolCode() {
        return schoolCode;
    }

    public void setSchoolCode(String schoolCode) {
        this.schoolCode = schoolCode;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getExamRoom() {
        return examRoom;
    }

    public void setExamRoom(String examRoom) {
        this.examRoom = examRoom;
    }

    public int getInputYear() {
        return inputYear;
    }

    public void setInputYear(int inputYear) {
        this.inputYear = inputYear;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getStuName() {
        return stuName;
    }

    public void setStuName(String stuName) {
        this.stuName = stuName;
    }

    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSchoolId() {
        return schoolId;
    }

    public void setSchoolId(String schoolId) {
        this.schoolId = schoolId;
    }
}
