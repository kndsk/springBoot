package com.ly.edu.mapper;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.SysRole;

import java.util.List;
import java.util.Map;

public interface SysRoleMapper extends MyMapper<SysRole> {

    /**
     * 获取登录用户角色信息
     * @param map
     * @return 用户角色信息
     */
  List<SysRole> getUserRoleInfo(Map<String, Object> map);
}