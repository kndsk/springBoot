package com.ly.edu.mapper;

import java.util.List;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.SysRight;

public interface SysRightMapper extends MyMapper<SysRight> {
  
  List<SysRight> getUserRight(int userId);
  
}