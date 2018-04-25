package com.ly.edu.dto;

/**
 * 
 * <b>类   名：</b>SportExamRoom<br/>
 * <b>类描述：</b>检验考场是否已提交的类<br/>
 * <b>创建人：</b>xzwang3<br/>
 * <b>创建时间：</b>2017年12月26日 上午9:57:35<br/>
 * <b>修改人：</b>Administrator<br/>
 * <b>修改时间：</b>2017年12月26日 上午9:57:35<br/>
 * <b>修改备注：</b><br/>
 *
 * @version 3.3<br/>
 *
 */
public class SportExamRoom {
	//学校代码
	private String school_code;
	//是否已提交
	private int status;
    //考场号
	private String exam_room;
	//录入年份
	private int year;
	public int getYear() {
		return year;
	}
	public void setYear(int year) {
		this.year = year;
	}
	public String getSchool_code() {
		return school_code;
	}
	public void setSchool_code(String school_code) {
		this.school_code = school_code;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getExam_room() {
		return exam_room;
	}
	public void setExam_room(String exam_room) {
		this.exam_room = exam_room;
	}
}
