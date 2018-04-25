package com.ly.edu.service.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ly.edu.domain.SysRight;
import com.ly.edu.domain.SysUser;
import com.ly.edu.mapper.SysRightMapper;
import com.ly.edu.mapper.SysUserMapper;
import com.ly.edu.right.RightVo;
import com.ly.edu.service.UserSvc;

@Service("userSvc")
public class UserSvcImpl implements UserSvc {
  
  @Autowired
  private SysUserMapper sysUserMapper;
  
  @Autowired
  private SysRightMapper sysRightMapper;
  
  private Logger log = Logger.getLogger(UserSvcImpl.class);
  
  @Override
  public SysUser userLogin(String name, String passwd) {
    SysUser temp = new SysUser();
    temp.setLoginName(name);
    temp.setPasswd(passwd);
    return sysUserMapper.findSysUser(temp);
  }
  
  @Override
  public List<RightVo> getUserRight(int userId) {
    List<SysRight> rightList = sysRightMapper.getUserRight(userId);
    if (rightList == null || rightList.isEmpty()) {
      return null;
    }
    List<RightVo> rightVoList = RightVo.buildRightTree(rightList);
    return rightVoList;
  }

}
