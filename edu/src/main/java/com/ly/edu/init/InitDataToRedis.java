package com.ly.edu.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ly.edu.service.RedisService;

/**
 * 
 * @author pengyq
 * @date   2018年4月8日
 * @email  yqpeng2@iflytek.com
 * @description 项目启动时需要将部分数据初始化到redis
 */
@Component
public class InitDataToRedis implements CommandLineRunner{
	
	@Autowired
    private RedisService redisService;
	
	@Override
	public void run(String... arg0) throws Exception {
		
		//缓存学校信息
		redisService.cacheSchoolInfo();
		
		//缓存学生信息
		redisService.cacheStudentInfo();
		
		//缓存系统配置信息
		redisService.cacheSysConfig();
		
		//缓存系统用户信息
		redisService.cacheSysUser();
		
	}

}
