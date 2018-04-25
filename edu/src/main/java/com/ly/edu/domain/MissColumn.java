package com.ly.edu.domain;

import java.io.Serializable;

/**
 * 体育成绩整列缺失实体类
 */
public class MissColumn implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String id;
    private String school_code;
    private String exam_room;
    //0：不缺失  1：缺失
    private int height_miss;
    private int weight_miss;
    private int power_first_miss;
    private int power_second_miss;
    private int left_eye_miss;
    private int right_eye_miss;
    private int breath_first_miss;
    private int breath_second_miss;
    private int fifty_miss;
    private int isAll_miss;

    public int getIsAll_miss() {
        return isAll_miss;
    }

    public void setIsAll_miss(int isAll_miss) {
        this.isAll_miss = isAll_miss;
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

    public String getExam_room() {
        return exam_room;
    }

    public void setExam_room(String exam_room) {
        this.exam_room = exam_room;
    }

    public int getHeight_miss() {
        return height_miss;
    }

    public void setHeight_miss(int height_miss) {
        this.height_miss = height_miss;
    }

    public int getWeight_miss() {
        return weight_miss;
    }

    public void setWeight_miss(int weight_miss) {
        this.weight_miss = weight_miss;
    }

    public int getPower_first_miss() {
        return power_first_miss;
    }

    public void setPower_first_miss(int power_first_miss) {
        this.power_first_miss = power_first_miss;
    }

    public int getPower_second_miss() {
        return power_second_miss;
    }

    public void setPower_second_miss(int power_second_miss) {
        this.power_second_miss = power_second_miss;
    }

    public int getLeft_eye_miss() {
        return left_eye_miss;
    }

    public void setLeft_eye_miss(int left_eye_miss) {
        this.left_eye_miss = left_eye_miss;
    }

    public int getRight_eye_miss() {
        return right_eye_miss;
    }

    public void setRight_eye_miss(int right_eye_miss) {
        this.right_eye_miss = right_eye_miss;
    }

    public int getBreath_first_miss() {
        return breath_first_miss;
    }

    public void setBreath_first_miss(int breath_first_miss) {
        this.breath_first_miss = breath_first_miss;
    }

    public int getBreath_second_miss() {
        return breath_second_miss;
    }

    public void setBreath_second_miss(int breath_second_miss) {
        this.breath_second_miss = breath_second_miss;
    }

    public int getFifty_miss() {
        return fifty_miss;
    }

    public void setFifty_miss(int fifty_miss) {
        this.fifty_miss = fifty_miss;
    }

    public int getJump_first_miss() {
        return jump_first_miss;
    }

    public void setJump_first_miss(int jump_first_miss) {
        this.jump_first_miss = jump_first_miss;
    }

    public int getJump_second_miss() {
        return jump_second_miss;
    }

    public void setJump_second_miss(int jump_second_miss) {
        this.jump_second_miss = jump_second_miss;
    }

    public int getJump_third_miss() {
        return jump_third_miss;
    }

    public void setJump_third_miss(int jump_third_miss) {
        this.jump_third_miss = jump_third_miss;
    }

    public int getFifth_miss() {
        return fifth_miss;
    }

    public void setFifth_miss(int fifth_miss) {
        this.fifth_miss = fifth_miss;
    }

    private int jump_first_miss;
    private int jump_second_miss;
    private int jump_third_miss;
    private int fifth_miss;
}
