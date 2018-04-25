package com.ly.edu.service.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.ly.edu.controller.LoginController;
import com.ly.edu.domain.OperateLog;
import com.ly.edu.mapper.OperateLogMapper;
import com.ly.edu.models.RespObj;
import com.ly.edu.service.OperateLogSvc;

@Service("oprLogSvc")
public class OperateLogSvcImpl implements OperateLogSvc {
  
  @Autowired
  private OperateLogMapper operateLogMapper;
  
  private Logger log = Logger.getLogger(OperateLogSvcImpl.class);
  public void insertOprLog(OperateLog oprLog){
      log.info(JSON.toJSON(oprLog));
    // operateLogMapper.insertOprLog(oprLog);
  }
}
