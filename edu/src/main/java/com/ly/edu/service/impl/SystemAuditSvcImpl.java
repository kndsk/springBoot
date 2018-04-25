package com.ly.edu.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ly.edu.domain.SysArea;
import com.ly.edu.domain.SysRole;
import com.ly.edu.mapper.SysAreaMapper;
import com.ly.edu.mapper.SysRoleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ly.edu.dto.OperateLogDTO;
import com.ly.edu.mapper.OperateLogMapper;
import com.ly.edu.service.SystemAuditSvc;
import com.ly.edu.util.DateUtils;
import com.ly.edu.util.StringUtils;

@Service("systemAuditSvc")
public class SystemAuditSvcImpl implements SystemAuditSvc {

  @Autowired
  private OperateLogMapper operateLogMapper;

  @Autowired
  private SysAreaMapper sysAreaMapper;

  @Autowired
  private SysRoleMapper sysRoleMapper;

  @Override
  public List<OperateLogDTO> getOprLogList(int pageIndex, int pageSize,
      String beginTime, String endTime, String modelType) {
    Map<String,Object> map = new HashMap<String,Object>();
    map.put("start", pageIndex * pageSize);
    map.put("number", pageSize);
    if(!StringUtils.isEmpty(beginTime)){
      map.put("beginTime",  DateUtils.parse(beginTime, "yyyy-MM-dd"));
    }
    if(!StringUtils.isEmpty(endTime)){
      map.put("endTime",  DateUtils.parse(endTime, "yyyy-MM-dd"));
    }
    map.put("name", modelType);
    List<OperateLogDTO> oprLogList= operateLogMapper.getAllOprLogList(map);
     return oprLogList;
  }
  @Override
  public int getTotalCount(String beginTime,
      String endTime, String modelType) {
    Map<String,Object> map = new HashMap<String,Object>();
    if(!StringUtils.isEmpty(beginTime)){
      map.put("beginTime",  DateUtils.parse(beginTime, "yyyy-MM-dd"));
    }
    if(!StringUtils.isEmpty(endTime)){
      map.put("endTime",  DateUtils.parse(endTime, "yyyy-MM-dd"));
    }
    map.put("name", modelType);
    int total = operateLogMapper.getAllOprLogCount(map);
    return total;
  }

  /**
   * 获得区域分层信息
   * @return 区域分层信息
   */
  @Override
  public List<SysArea> getAreaInfoByAreaCode(Map<String, Object> map) {
    List<SysArea> list = sysAreaMapper.getAreaInfoByAreaCode(map);
    return list;
  }

  /**
   * 根据指定地理信息获取项目关联地理信息
   * @return 区域分层信息
   */
  @Override
  public List<SysArea> getProjectAreaInfoByAreaId(Map<String, Object> map) {
    List<SysArea> list = sysAreaMapper.getProjectAreaInfoByAreaId(map);
    return list;
  }

    /**
     * 获取登录用户角色信息
     * @return 用户角色信息
     */
    @Override
    public List<SysRole> getUserRoleInfo(Map<String, Object> map) {
        return sysRoleMapper.getUserRoleInfo(map);
    }
}