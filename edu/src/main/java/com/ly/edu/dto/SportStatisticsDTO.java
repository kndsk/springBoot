package com.ly.edu.dto;

import com.ly.edu.domain.SportStatistics;

/**
 * @author xdchen3
 */
public class SportStatisticsDTO extends SportStatistics {

    //学生总数
    private int stuTotal;
    //完成百分比
    private String percent;
    //已完成学生数量
    private int finishedCount;
    //未完成学生数量
    private int unfinishedCount;
    //完成状态
    private int statisticsStatus;
    //缺测学生数量
    private int missingCount;

    public int getMissingCount() {
        return missingCount;
    }

    public void setMissingCount(int missingCount) {
        this.missingCount = missingCount;
    }

    public int getStatisticsStatus() {
        return statisticsStatus;
    }

    public void setStatisticsStatus(int statisticsStatus) {
        this.statisticsStatus = statisticsStatus;
    }

    public int getStuTotal() {
        return stuTotal;
    }

    public void setStuTotal(int stuTotal) {
        this.stuTotal = stuTotal;
    }

    public String getPercent() {
        return percent;
    }

    public void setPercent(String percent) {
        this.percent = percent;
    }

    public int getFinishedCount() {
        return finishedCount;
    }

    public void setFinishedCount(int finishedCount) {
        this.finishedCount = finishedCount;
    }

    public int getUnfinishedCount() {
        return unfinishedCount;
    }

    public void setUnfinishedCount(int unfinishedCount) {
        this.unfinishedCount = unfinishedCount;
    }

}
