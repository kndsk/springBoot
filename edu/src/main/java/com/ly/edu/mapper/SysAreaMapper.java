package com.ly.edu.mapper;

import java.util.List;
import java.util.Map;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.SysArea;
import com.ly.edu.dto.SysAreaDTO;


public interface SysAreaMapper extends MyMapper<SysArea>{
  public List<SysAreaDTO> getAreaCodeByDistrinctName(
      Map<String,Object> stuAllMap);

  /**
   * 获得区域及分层信息
   * @param map
   * @return 下拉框内容
   */
  List<SysArea> getAreaInfoByAreaCode(Map<String, Object> map);

  /**
   * 根据指定地理信息获取项目关联地理信息
   * @param map
   * @return 下拉框内容
   */
  List<SysArea> getProjectAreaInfoByAreaId(Map<String, Object> map);
}