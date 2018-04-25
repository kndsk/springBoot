package com.ly.edu.service;

import java.util.List;
import java.util.Map;

import com.ly.edu.domain.SysArea;
import com.ly.edu.domain.SysRole;
import com.ly.edu.dto.OperateLogDTO;

public interface SystemAuditSvc {
  public List<OperateLogDTO> getOprLogList(int pageIndex, int pageSize, String beginTime, String endTime, String modelType);
  public int getTotalCount(String beginTime, String endTime, String modelType);

  /**
   * 获得区域分层信息
   * @return 区域分层信息
   */
  List<SysArea> getAreaInfoByAreaCode(Map<String, Object> map);

  /**
   * 根据指定地理信息获取项目关联地理信息
   * @return 区域分层信息
   */
  List<SysArea> getProjectAreaInfoByAreaId(Map<String, Object> map);

  /**
   * 获取登录用户角色信息
   * @return 用户角色信息
   */
  List<SysRole> getUserRoleInfo(Map<String, Object> map);
}
