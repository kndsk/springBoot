package com.ly.edu.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.ly.edu.domain.School;
import com.ly.edu.domain.SysUser;
import com.ly.edu.models.RespObj;
import com.ly.edu.right.RightVo;
import com.ly.edu.service.OperateLogSvc;
import com.ly.edu.service.RedisService;
import com.ly.edu.service.SportService;
import com.ly.edu.service.SystemAuditSvc;
import com.ly.edu.service.UserSvc;


/**
 * @author gangwu3
 * 
 */
@Controller
@RequestMapping("/")
public class LoginController extends BaseController {
    @Autowired
    private UserSvc        userSvc;

    private final Logger   log = Logger.getLogger(LoginController.class);

    @Autowired
    private OperateLogSvc  oprLogSvc;

    @Autowired
    private SystemAuditSvc systemAuditSvc;

    @Autowired
    private SportService   sportService;
    
    @Autowired
    private RedisService redisService;

    @RequestMapping(value = "/dog", method = RequestMethod.GET)
    public String test(HttpServletRequest req, HttpServletResponse resp) {
        return "dog";
    }
    
    @RequestMapping(value = "/outtime", method = RequestMethod.GET)
    public String outtime(HttpServletRequest req, HttpServletResponse resp) {
        return "outtime";
    }

    @RequestMapping(method = RequestMethod.GET)
    public String welcome(HttpServletRequest request, HttpServletResponse response) {
        // 默认进入的欢迎页面，如果已经登陆则直接进行跳转
        return "login/login";
    }

    /**
     * 
     * @param name :用户名
     * @param passwd :密码
     * @param req :HttpServletRequest
     * @return Object json串,Object.result是否登陆成功
     */
    @ResponseBody
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Object login(@RequestParam String name, @RequestParam String passwd, HttpServletRequest req) {
        String url = "";
        //先判断是不是系统管理员
        //SysUser sysUser = userSvc.userLogin(name, passwd);
        SysUser sysUser = redisService.sysUserLogin(name, passwd);
        if (sysUser != null) {
            url = "/inputControl";
            sysUser.setSchool_name(sysUser.getName());
            if (!"admin".equals(name)) {
                sysUser.setProvinceId(name.substring(0,2) + "0000");
                sysUser.setDistrictId(name.substring(0,6));
                if (sysUser.getProvinceId().equals(sysUser.getDistrictId())) {
                    //如果是省级管理员，那么区县字段留空
                    sysUser.setDistrictId("");
                }
            }
            req.getSession().setAttribute("sysUser", sysUser);
            return JSON.toJSON(new RespObj(true, null, url));
        }
        //School schoolUser = sportService.userLogin(name, passwd);
        //改用redis获取用户信息校验
        School schoolUser = redisService.userLogin(name, passwd);
        if (schoolUser != null) {
            this.initSysConfig(req);
            req.getSession().setAttribute("schoolUser", schoolUser);
            schoolUser = (School) req.getSession().getAttribute("schoolUser");
            int gradeType = Integer.parseInt(String.valueOf(name.charAt(name.length()-3)));
            schoolUser.setGradeType(gradeType);
            // 如果不在成绩录入时间段，则无法进入录入页面录入成绩
            boolean isInTime = this.checkTime(req, schoolUser.getProvince_code());
            if (!isInTime) {
                return JSON.toJSON(new RespObj(true, null, "/outtime"));
            }
            // 如果已经完成过录入人员信息填写工作，则直接进入填写页面，否则填写基本信息
//            boolean flag = sportService.checkGeneralInfoStatus(schoolUser.getSchool_code());
//            if (flag) {
//                url = "/homePage";
//            } else {
//                url = "/recorderInformation";
//            }
            url = "/homePage";
            return JSON.toJSON(new RespObj(true, null, url));
        }
        log.error("login error, name=" + name + ",passwd=" + passwd);
        return JSON.toJSON(new RespObj(false, null, ""));
    }

    /**
     * 初始化系统配置项
     * @Description:    initSysConfig
     * @param req       HttpServletRequest
     */
    private void initSysConfig(HttpServletRequest req) {
        //List<Map<String, String>> sysConfigs = sportService.getSysConfigs();
    	//改用redis获取系统配置信息
    	List<Map> sysConfigs = redisService.getSysConfigs();
        if (!CollectionUtils.isEmpty(sysConfigs)) {
            for (Map<String, String> config : sysConfigs) {
                req.getSession().setAttribute(config.get("key"), config.get("value"));
            }
        }
    }

    /**
     * 
     * @param req :HttpServletRequest
     * @return 重定向到登陆页面
     */
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout(HttpServletRequest req) {
        req.getSession().removeAttribute("sysUser");
        req.getSession().removeAttribute("schoolUser");
        req.getSession().removeAttribute("rightVoList");
        return "redirect:/";
    }

    @RequestMapping(value = "/downloadclient", method = RequestMethod.GET)
    public String download(HttpServletRequest request, HttpServletResponse response) {
        return "login/download";
    }

    private String getDefaultURL(String url, List<RightVo> list) {
        boolean flag = false;
        for (RightVo rv : list) {
            if (rv.getUrl().equals(url)) {
                flag = true;
            }
        }
        if (flag == true) {
            return url;
        } else {
            return list.get(0).getUrl();
        }
    }

    @ResponseBody
    @RequestMapping(value = "/error", method = RequestMethod.GET)
    public Object filterError(HttpServletRequest request, HttpServletResponse response) {
        return JSON.toJSON(new RespObj(true, null, "/filter/error"));
    }

}
