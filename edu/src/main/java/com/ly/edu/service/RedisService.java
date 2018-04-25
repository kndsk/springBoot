package com.ly.edu.service;

import java.util.List;
import java.util.Map;

import com.ly.edu.domain.School;
import com.ly.edu.domain.Student;
import com.ly.edu.domain.SysUser;

/**
 * 
 * @author pengyq
 * @date   2018年4月8日
 * @email  yqpeng2@iflytek.com
 * @description redis业务接口
 */
public interface RedisService {
	
	/**
	 * 缓存学校信息
	 */
	void cacheSchoolInfo();
	
	/**
	 * 缓存学生信息
	 */
	void cacheStudentInfo();
	
	/**
	 * 缓存系统配置信息
	 */
	void cacheSysConfig();
	
	/**
	 * 缓存系统用户息
	 */
	void cacheSysUser();
	
	/**
	 * 根据学校账号获取学校信息
	 * @param acc
	 * @return
	 */
	School getSchoolInfoByAcc(String acc);
	
	/**
	 * 获取所有系统配置
	 * @return
	 */
	List<Map> getSysConfigs();
	
	/**
	 * 根据学生id获取学生信息
	 * @param id
	 * @return
	 */
	Student getStudentInfoById(String id);
	
	/**
     * 验证登录账号密码
     * @param account
     * @param password
     * @return
     */
    School userLogin(String account, String password);
    
    /**
     * 验证系统登录用户
     * @param name
     * @param passwd
     * @return
     */
    SysUser sysUserLogin(String name, String passwd);
    
    /**
	 * 根据登录名获取系统用户信息
	 * @param name
	 * @return
	 */
    SysUser getSysUserInfoByLoginName(String name);

}
