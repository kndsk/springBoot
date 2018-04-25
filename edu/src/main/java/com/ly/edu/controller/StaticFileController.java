package com.ly.edu.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.ly.edu.service.StaticFileSvc;

@Controller
@RequestMapping(value = "/files")
public class StaticFileController {
  
  private Logger log = Logger.getLogger(StaticFileController.class);
  
  @Autowired
  private StaticFileSvc staticFileSvc;
  
  @RequestMapping(value = "/download", method = RequestMethod.GET)
  public void download(HttpServletResponse response,
      HttpServletRequest request, @RequestParam String fileName, String path) {
    
    String downloadFileName = "";
    try {
      downloadFileName = java.net.URLEncoder.encode(fileName, "UTF-8");
    } catch (UnsupportedEncodingException e1) {
      
    }
    response.addHeader("Content-Disposition", "attachment; filename="
        + downloadFileName);
    try {
      staticFileSvc.outputFile4Download(response, fileName, path);
      log.info("成功下载文件[" + fileName + "]");
    } catch (IOException e) {
      try {
        response.sendError(404, "下载的信息不存在");
      } catch (IOException e1) {
        log.error("下载的任务文件路径[" + path + "],文件名称[" + fileName + "]");
      }
    }
    
  }
  
}
