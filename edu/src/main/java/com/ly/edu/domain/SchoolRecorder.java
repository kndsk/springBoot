package com.ly.edu.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * @author xdchen3
 * 学校录入人员信息表
 */
public class SchoolRecorder implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
     * UUID
     */
    private String id;
    /**
     * 学校id
     */
    private String school_id;
    /**
     * 学校名称
     */
    private String name;
    /**
     * 信息录入员
     */
    private String recorder;
    /**
     * 信息审核员
     */
    private String reviewer;
    /**
     * 联系方式
     */
    private String contac_info;
    /**
     * 录入年份
     */
    private int year;
    private String creator_id;
    private Date create_time;
    private String updater_id;
    private Date update_time;

    private String exam_room;

    public String getExam_room() {
        return exam_room;
    }

    public void setExam_room(String exam_room) {
        this.exam_room = exam_room;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSchool_id() {
        return school_id;
    }

    public void setSchool_id(String school_id) {
        this.school_id = school_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRecorder() {
        return recorder;
    }

    public void setRecorder(String recorder) {
        this.recorder = recorder;
    }

    public String getReviewer() {
        return reviewer;
    }

    public void setReviewer(String reviewer) {
        this.reviewer = reviewer;
    }

    public String getContac_info() {
        return contac_info;
    }

    public void setContac_info(String contac_info) {
        this.contac_info = contac_info;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getCreator_id() {
        return creator_id;
    }

    public void setCreator_id(String creator_id) {
        this.creator_id = creator_id;
    }

    public Date getCreate_time() {
        return create_time;
    }

    public void setCreate_time(Date create_time) {
        this.create_time = create_time;
    }

    public String getUpdater_id() {
        return updater_id;
    }

    public void setUpdater_id(String updater_id) {
        this.updater_id = updater_id;
    }

    public Date getUpdate_time() {
        return update_time;
    }

    public void setUpdate_time(Date update_time) {
        this.update_time = update_time;
    }
}
