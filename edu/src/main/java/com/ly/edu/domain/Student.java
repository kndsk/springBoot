package com.ly.edu.domain;

import java.io.Serializable;

/**
 * @author xdchen3
 *         学生基本信息类
 */
public class Student implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
     * 学生id
     */
    private String id;
    /**
     * 上报的学生id
     */
    private String sb_id;
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
     * 学校代码
     */
    private String school_code;
    /**
     * 学校类别： 3.中学，4.小学
     */
    private String school_type;
    /**
     * 学校区域
     */
    private String school_qy;
    /**
     * 学校性质
     */
    private String school_xz;
    /**
     * 学校名称
     */
    private String school_name;
    /**
     * 学生代码
     */
    private String student_code;
    /**
     * 样本学生帐号对应密码
     */
    private String password;
    /**
     * 帐号类型-学生
     */
    private String userstyle;
    /**
     * 测验账号发布状态，
     *  默认0-未发布，1-已发布
     */
    private int published;
    /**
     * 学生姓名
     */
    private String student_name;
    /**
     * 考场号
     */
    private String exam_room;
    /**
     * 抽样顺序号
     */
    private String cy_order;
    /**
     * 条形码
     */
    private String barcode;
    /**
     * 性别，默认0， 0：男， 1：女
     */
    private int sex;
    /**
     * 班级
     */
    private String className;
    /**
     * 录入年份
     */
    private int year;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSb_id() {
        return sb_id;
    }

    public void setSb_id(String sb_id) {
        this.sb_id = sb_id;
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

    public String getSchool_code() {
        return school_code;
    }

    public void setSchool_code(String school_code) {
        this.school_code = school_code;
    }

    public String getSchool_type() {
        return school_type;
    }

    public void setSchool_type(String school_type) {
        this.school_type = school_type;
    }

    public String getSchool_qy() {
        return school_qy;
    }

    public void setSchool_qy(String school_qy) {
        this.school_qy = school_qy;
    }

    public String getSchool_xz() {
        return school_xz;
    }

    public void setSchool_xz(String school_xz) {
        this.school_xz = school_xz;
    }

    public String getSchool_name() {
        return school_name;
    }

    public void setSchool_name(String school_name) {
        this.school_name = school_name;
    }

    public String getStudent_code() {
        return student_code;
    }

    public void setStudent_code(String student_code) {
        this.student_code = student_code;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserstyle() {
        return userstyle;
    }

    public void setUserstyle(String userstyle) {
        this.userstyle = userstyle;
    }

    public int getPublished() {
        return published;
    }

    public void setPublished(int published) {
        this.published = published;
    }

    public String getStudent_name() {
        return student_name;
    }

    public void setStudent_name(String student_name) {
        this.student_name = student_name;
    }

    public String getExam_room() {
        return exam_room;
    }

    public void setExam_room(String exam_room) {
        this.exam_room = exam_room;
    }

    public String getCy_order() {
        return cy_order;
    }

    public void setCy_order(String cy_order) {
        this.cy_order = cy_order;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
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

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
