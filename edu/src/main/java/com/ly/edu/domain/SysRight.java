package com.ly.edu.domain;

import java.io.Serializable;
import java.util.Date;

public class SysRight implements Serializable{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
     * 系统权限编号
     */
    private Integer id;

    /**
     * 系统权限名称
     */
    private String rightName;

    /**
     * 权限英文名称
     */
    private String enName;

    /**
     * 权限内容(资源URI)
     */
    private String content;

    /**
     * 备注
     */
    private Integer remark;

    /**
     * 父级ID
     */
    private Integer parentId;

    /**
     * 权限类型
     */
    private Integer rightType;

    /**
     *  创建时间
     */
    private Date createTime;

    /**
     * 是否禁用
     */
    private Integer forbidden;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRightName() {
        return rightName;
    }

    public void setRightName(String rightName) {
        this.rightName = rightName == null ? null : rightName.trim();
    }

    public String getEnName() {
        return enName;
    }

    public void setEnName(String enName) {
        this.enName = enName == null ? null : enName.trim();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content == null ? null : content.trim();
    }

    public Integer getRemark() {
        return remark;
    }

    public void setRemark(Integer remark) {
        this.remark = remark;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public Integer getRightType() {
        return rightType;
    }

    public void setRightType(Integer rightType) {
        this.rightType = rightType;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Integer getForbidden() {
        return forbidden;
    }

    public void setForbidden(Integer forbidden) {
        this.forbidden = forbidden;
    }
}