package com.ly.edu.mapper;

import java.util.List;
import java.util.Map;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.OperateLog;
import com.ly.edu.dto.OperateLogDTO;

public interface OperateLogMapper extends MyMapper<OperateLog> {
  public void insertOprLog(OperateLog oprLog);
  public List<OperateLogDTO> getAllOprLogList(Map<String,Object> map);
  public int getAllOprLogCount(Map<String,Object> map);
}