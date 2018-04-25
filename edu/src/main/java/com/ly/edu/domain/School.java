package com.ly.edu.domain;

import java.io.Serializable;

/**
 * Created by admin on 2017/11/21.
 */
public class School implements Serializable{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
     * UUID
     */
    private String id;
    /**
     * 学校代码
     */
    private String school_code;
    /**
     * 学校名称
     */
    private String school_name;
    /**
     * 抽样年份
     */
    private String year_code;
    /**
     * 计划上报学生数
     */
    private int stu_plan_count;
    /**
     * 计划上报学生数
     */
    private int tea_plan_count;
    /**
     * 监测点编码
     */
    private String monitor_code;
    /**
     * 用户id
     */
    private String user_id;
    /**
     * 登录帐号
     */
    private String account;
    /**
     * 登录密码
     */
    private String password;
    /**
     * 学校类别： 3.中学，4.小学
     */
    private int school_type;
    /**
     * 状态， 0：未确认发布，1：待确认，2：确认参测，3：不能参测，4.未选为结果
     */
    private int status;
    /**
     * 检测教室
     */
    private int jc_classroom;
    /**
     * 抽测教师数
     */
    private int teacher_count;
    /**
     * 抽测学生数
     */
    private int student_count;
    /**
     * 学生总数
     */
    private int student_sum;
    /**
     * 项目id
     */
    private String project_id;
    /**
     * 省份代码
     */
    private String province_code;
    /**
     * 省份名称
     */
    private String province_name;
    /**
     * 区县代码
     */
    private String country_code;
    /**
     * 区县名称
     */
    private String country_name;
    /**
     * 上报学校id
     */
    private String school_id;

    //判断年级 4或者5 小学  8或者9 中学
    private int gradeType;

    public int getGradeType() {
        return gradeType;
    }

    public void setGradeType(int gradeType) {
        this.gradeType = gradeType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSchool_code() {
        return school_code;
    }

    public void setSchool_code(String school_code) {
        this.school_code = school_code;
    }

    public String getSchool_name() {
        return school_name;
    }

    public void setSchool_name(String school_name) {
        this.school_name = school_name;
    }

    public String getYear_code() {
        return year_code;
    }

    public void setYear_code(String year_code) {
        this.year_code = year_code;
    }

    public int getStu_plan_count() {
        return stu_plan_count;
    }

    public void setStu_plan_count(int stu_plan_count) {
        this.stu_plan_count = stu_plan_count;
    }

    public int getTea_plan_count() {
        return tea_plan_count;
    }

    public void setTea_plan_count(int tea_plan_count) {
        this.tea_plan_count = tea_plan_count;
    }

    public String getMonitor_code() {
        return monitor_code;
    }

    public void setMonitor_code(String monitor_code) {
        this.monitor_code = monitor_code;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getSchool_type() {
        return school_type;
    }

    public void setSchool_type(int school_type) {
        this.school_type = school_type;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getJc_classroom() {
        return jc_classroom;
    }

    public void setJc_classroom(int jc_classroom) {
        this.jc_classroom = jc_classroom;
    }

    public int getTeacher_count() {
        return teacher_count;
    }

    public void setTeacher_count(int teacher_count) {
        this.teacher_count = teacher_count;
    }

    public int getStudent_count() {
        return student_count;
    }

    public void setStudent_count(int student_count) {
        this.student_count = student_count;
    }

    public int getStudent_sum() {
        return student_sum;
    }

    public void setStudent_sum(int student_sum) {
        this.student_sum = student_sum;
    }

    public String getProject_id() {
        return project_id;
    }

    public void setProject_id(String project_id) {
        this.project_id = project_id;
    }

    public String getProvince_code() {
        return province_code;
    }

    public void setProvince_code(String province_code) {
        this.province_code = province_code;
    }

    public String getProvince_name() {
        return province_name;
    }

    public void setProvince_name(String province_name) {
        this.province_name = province_name;
    }

    public String getCountry_code() {
        return country_code;
    }

    public void setCountry_code(String country_code) {
        this.country_code = country_code;
    }

    public String getCountry_name() {
        return country_name;
    }

    public void setCountry_name(String country_name) {
        this.country_name = country_name;
    }

    public String getSchool_id() {
        return school_id;
    }

    public void setSchool_id(String school_id) {
        this.school_id = school_id;
    }
}
