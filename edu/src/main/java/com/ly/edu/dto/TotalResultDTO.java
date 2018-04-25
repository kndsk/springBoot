package com.ly.edu.dto;

/**
 * 某一区域下的成绩集合
 * @author xdchen3
 */
public class TotalResultDTO {
    private int totalNum;
    private int totalStudents;
    private int finishedStudent;
    private int unFinishedStudents;
    private String percent;

    public int getTotalNum() {
        return totalNum;
    }

    public void setTotalNum(int totalNum) {
        this.totalNum = totalNum;
    }

    public int getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(int totalStudents) {
        this.totalStudents = totalStudents;
    }

    public int getFinishedStudent() {
        return finishedStudent;
    }

    public void setFinishedStudent(int finishedStudent) {
        this.finishedStudent = finishedStudent;
    }

    public int getUnFinishedStudents() {
        return unFinishedStudents;
    }

    public void setUnFinishedStudents(int unFinishedStudents) {
        this.unFinishedStudents = unFinishedStudents;
    }

    public String getPercent() {
        return percent;
    }

    public void setPercent(String percent) {
        this.percent = percent;
    }
}
