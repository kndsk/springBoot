package com.ly.edu.domain;

import java.io.Serializable;

public class SysRoleRight implements Serializable{

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
     * 角色ID
     */
    private Integer roleId;

    /**
     * 权限ID
     */
    private Integer rightId;

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getRightId() {
        return rightId;
    }

    public void setRightId(Integer rightId) {
        this.rightId = rightId;
    }
}