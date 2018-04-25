package com.ly.edu.scale.model;

import java.util.List;

/**
 * @author gangwu3
 * 选项
 */
public class Option {
    /*
     * 选项key
     */
    private String name;
    /*
     * 选项内容    使用object是为了兼容含有填空的选项
     */
    private Object value;
    /*
     * 计分
     */
    private int score;
    /**
     * 多选题互斥规则
     */
    private String magicRules;
    /*
     * 跳转目标题号
     */
    private Integer targetQuestionNumber;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public Integer getTargetQuestionNumber() {
        return targetQuestionNumber;
    }

    public void setTargetQuestionNumber(Integer targetQuestionNumber) {
        this.targetQuestionNumber = targetQuestionNumber;
    }

    public String getMagicRules() {
        return magicRules;
    }

    public void setMagicRules(String magicRules) {
        this.magicRules = magicRules;
    }
}
