package com.ly.edu.mapper;

import java.util.List;

import com.ly.edu.domain.SysUser;

import tk.mybatis.mapper.common.Mapper;

public interface SysUserMapper extends Mapper<SysUser> {

  SysUser findSysUser(SysUser record);
  
  List<SysUser> getAllUsers();
}