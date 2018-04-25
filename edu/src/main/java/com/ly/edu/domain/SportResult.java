package com.ly.edu.domain;

import java.io.Serializable;
import java.util.Date;

/**
 * @author xdchen3
 * 体育成绩类
 */
public class SportResult implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
     * 成绩id
     */
    private String id;
    /**
     * 参测学生id
     */
    private String student_id;
    /**
     * 是否缺失 1：缺失， 0：未缺失， 2：保存状态
     */
    private int is_empty;
    /**
     * 身高
     */
    private float height;
    /**
     * 体重
     */
    private float weight;
    /**
     * 握力（kg）第一次
     */
    private float power_first;
    /**
     * 握力（kg）第二次
     */
    private float power_second;
    /**
     * 左眼视力
     */
    private float left_eye;
    /**
     * 右眼视力
     */
    private float right_eye;
    /**
     * 肺活量（ml）第一次
     */
    private int breath_first;
    /**
     * 肺活量（ml）第二次
     */
    private int breath_second;
    /**
     * 50米跑（秒）
     */
    private float fifty_meter;
    /**
     * 立定跳远（cm）第一次
     */
    private int jump_first;
    /**
     * 立定跳远（cm）第二次
     */
    private int jump_second;
    /**
     * 立定跳远（cm）第三次
     */
    private int jump_third;
    /**
     * 15米折返（次）
     */
    private int fifth_meter;
    private String creator_id;
    private Date create_time;
    private String updater_id;
    private Date update_time;
    /**
     * 录入年份
     */
    private int year;
    /**
     * 提交状态
     默认0
     0 未提交
     1 已提交
     2 已保存
     */
    private int status;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStudent_id() {
        return student_id;
    }

    public void setStudent_id(String student_id) {
        this.student_id = student_id;
    }

    public int getIs_empty() {
        return is_empty;
    }

    public void setIs_empty(int is_empty) {
        this.is_empty = is_empty;
    }

    public float getHeight() {
        return height;
    }

    public void setHeight(float height) {
        this.height = height;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public float getPower_first() {
        return power_first;
    }

    public void setPower_first(float power_first) {
        this.power_first = power_first;
    }

    public float getPower_second() {
        return power_second;
    }

    public void setPower_second(float power_second) {
        this.power_second = power_second;
    }

    public float getLeft_eye() {
        return left_eye;
    }

    public void setLeft_eye(float left_eye) {
        this.left_eye = left_eye;
    }

    public float getRight_eye() {
        return right_eye;
    }

    public void setRight_eye(float right_eye) {
        this.right_eye = right_eye;
    }

    public int getBreath_first() {
        return breath_first;
    }

    public void setBreath_first(int breath_first) {
        this.breath_first = breath_first;
    }

    public int getBreath_second() {
        return breath_second;
    }

    public void setBreath_second(int breath_second) {
        this.breath_second = breath_second;
    }

    public float getFifty_meter() {
        return fifty_meter;
    }

    public void setFifty_meter(float fifty_meter) {
        this.fifty_meter = fifty_meter;
    }

    public int getJump_first() {
        return jump_first;
    }

    public void setJump_first(int jump_first) {
        this.jump_first = jump_first;
    }

    public int getJump_second() {
        return jump_second;
    }

    public void setJump_second(int jump_second) {
        this.jump_second = jump_second;
    }

    public int getJump_third() {
        return jump_third;
    }

    public void setJump_third(int jump_third) {
        this.jump_third = jump_third;
    }

    public int getFifth_meter() {
        return fifth_meter;
    }

    public void setFifth_meter(int fifth_meter) {
        this.fifth_meter = fifth_meter;
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

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
