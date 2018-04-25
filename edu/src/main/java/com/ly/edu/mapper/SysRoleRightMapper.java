package com.ly.edu.mapper;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.SysRoleRight;

public interface SysRoleRightMapper extends MyMapper<SysRoleRight>{
  
    int deleteByPrimaryKey(SysRoleRight key);

    int insert(SysRoleRight record);

    int insertSelective(SysRoleRight record);
}