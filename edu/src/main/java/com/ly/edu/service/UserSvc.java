package com.ly.edu.service;

import java.util.List;

import com.ly.edu.domain.SysUser;
import com.ly.edu.right.RightVo;

/**
 * 用户业务接口
 */
public interface UserSvc {
  
  SysUser userLogin(String name, String passwd);
  
  List<RightVo> getUserRight(int userId);
  
}
