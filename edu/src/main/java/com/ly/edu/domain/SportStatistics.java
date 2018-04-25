package com.ly.edu.domain;

import java.io.Serializable;

/**
 * @author xdchen3
 */
public class SportStatistics implements Serializable{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
     * 项目id
     */
    protected String project_id;
    protected String province_name;
    protected String province_code;
    protected String country_name;
    protected String country_code;
    protected String school_name;
    protected String school_code;

    public String getProject_id() {
        return project_id;
    }

    public void setProject_id(String project_id) {
        this.project_id = project_id;
    }

    public String getProvince_name() {
        return province_name;
    }

    public void setProvince_name(String province_name) {
        this.province_name = province_name;
    }

    public String getProvince_code() {
        return province_code;
    }

    public void setProvince_code(String province_code) {
        this.province_code = province_code;
    }

    public String getCountry_name() {
        return country_name;
    }

    public void setCountry_name(String country_name) {
        this.country_name = country_name;
    }

    public String getCountry_code() {
        return country_code;
    }

    public void setCountry_code(String country_code) {
        this.country_code = country_code;
    }

    public String getSchool_name() {
        return school_name;
    }

    public void setSchool_name(String school_name) {
        this.school_name = school_name;
    }

    public String getSchool_code() {
        return school_code;
    }

    public void setSchool_code(String school_code) {
        this.school_code = school_code;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SportStatistics)) return false;

        SportStatistics that = (SportStatistics) o;

        if (province_code != null ? !province_code.equals(that.province_code) : that.province_code != null)
            return false;
        if (country_code != null ? !country_code.equals(that.country_code) : that.country_code != null) return false;
        return school_code != null ? school_code.equals(that.school_code) : that.school_code == null;
    }

    @Override
    public int hashCode() {
        int result = province_code != null ? province_code.hashCode() : 0;
        result = 31 * result + (country_code != null ? country_code.hashCode() : 0);
        result = 31 * result + (school_code != null ? school_code.hashCode() : 0);
        return result;
    }
}
