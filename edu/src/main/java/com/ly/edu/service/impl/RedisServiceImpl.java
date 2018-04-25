package com.ly.edu.service.impl;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ly.edu.domain.School;
import com.ly.edu.domain.Student;
import com.ly.edu.domain.SysUser;
import com.ly.edu.mapper.SchoolMapper;
import com.ly.edu.mapper.StudentMapper;
import com.ly.edu.mapper.SysUserMapper;
import com.ly.edu.service.RedisService;

@Service
public class RedisServiceImpl implements RedisService {
	
	//防止redis key值重复加入前缀
	private final String SCHOOL_INFO_ = "school_info_";
	
	private final String SYS_CONFIG_ALL = "sys_config_all";
	
	private final String STUDENT_INFO_ = "student_info_";
	
	private final String SYS_USER_INFO_ = "sys_user_info_";
	
	@Autowired
    private SchoolMapper schoolMapper;
	
    @Autowired
    private StudentMapper studentMapper;
    
    @Autowired
    private SysUserMapper sysUserMapper;
    
    /*@Autowired
    private RedisUtil redisUtil;*/
    
    private ConcurrentHashMap<String, Object> cacheMap = new ConcurrentHashMap<String, Object>();

	@Override
	public void cacheSchoolInfo() {
		
		/*final List<School> schoolInfos = schoolMapper.getAllSchoolInfo();
		if(schoolInfos != null && schoolInfos.size()>0) {
			
			redisUtil.getRedisTemplate().executePipelined(new RedisCallback<Object>() {

				@Override
				public Object doInRedis(RedisConnection connection) throws DataAccessException {
					for (int i = 0; i < schoolInfos.size(); i++) {
						School school = schoolInfos.get(i);
						StringRedisConnection redisConn = (StringRedisConnection) connection;
						redisConn.set(SCHOOL_INFO_+school.getAccount(), JSONObject.toJSONString(school));
					}
					return null;
				}
				
			});
			
		}*/
		
		List<School> schoolInfos = schoolMapper.getAllSchoolInfo();
		for (int i = 0; i < schoolInfos.size(); i++) {
			School school = schoolInfos.get(i);
			cacheMap.put(SCHOOL_INFO_+school.getAccount(), school);
		}

	}

	@Override
	public void cacheStudentInfo() {
		
		int records = 200000;
		int pageNum = 0;
		
		/*while(true) {//学生信息太多几百万条采用分页查询
			
			final List<Student> studentInfos = studentMapper.getAllStudentsInfo(pageNum, records);
			pageNum += records;
			if(studentInfos != null && studentInfos.size()>0) {
				
				redisUtil.getRedisTemplate().executePipelined(new RedisCallback<Object>() {

					@Override
					public Object doInRedis(RedisConnection connection) throws DataAccessException {
						for (int i = 0; i < studentInfos.size(); i++) {
							Student student = studentInfos.get(i);
							StringRedisConnection redisConn = (StringRedisConnection) connection;
							redisConn.set(STUDENT_INFO_+student.getId(), JSONObject.toJSONString(student));
						}
						return null;
					}
					
				});
				
			}else {
				break;
			}
		}*/
		
		while(true) {//学生信息太多几百万条采用分页查询
			
			List<Student> studentInfos = studentMapper.getAllStudentsInfo(pageNum, records);
			pageNum += records;
			if(studentInfos != null && studentInfos.size()>0) {
				
				for (int i = 0; i < studentInfos.size(); i++) {
					Student student = studentInfos.get(i);
					cacheMap.put(STUDENT_INFO_+student.getId(), student);
				}
				
			}else {
				break;
			}
		}
		
	}

	@Override
	public void cacheSysConfig() {
		
		/*List<Map<String, String>> sysConfigs = schoolMapper.getSysConfigs();
		if(sysConfigs != null && sysConfigs.size()>0) {
			redisUtil.set(SYS_CONFIG_ALL, JSONArray.toJSONString(sysConfigs));
		}*/
		
		List<Map<String, String>> sysConfigs = schoolMapper.getSysConfigs();
		if(sysConfigs != null && sysConfigs.size()>0) {
			cacheMap.put(SYS_CONFIG_ALL, sysConfigs);
		}
	}

	@Override
	public School getSchoolInfoByAcc(String acc) {
		/*String value = redisUtil.get(SCHOOL_INFO_+acc);
		return JSONObject.parseObject(value, School.class);*/
		
		return (School) cacheMap.get(SCHOOL_INFO_+acc);
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<Map> getSysConfigs() {
		
		/*String value = redisUtil.get(SYS_CONFIG_ALL);
		
		return JSONArray.parseArray(value, Map.class);*/
		
		return (List<Map>) cacheMap.get(SYS_CONFIG_ALL);
	}
	
	@Override
	public Student getStudentInfoById(String id) {
		/*String value = redisUtil.get(STUDENT_INFO_+id);
		return JSONObject.parseObject(value, Student.class);*/
		
		return (Student) cacheMap.get(STUDENT_INFO_+id);
	}

	@Override
	public School userLogin(String account, String password) {
		
		School school = this.getSchoolInfoByAcc(account);
		if(school != null && password.equals(school.getPassword())) {
			return school;
		}
		
		return null;
	}

	@Override
	public void cacheSysUser() {
		
		/*final List<SysUser> sysUserInfos = sysUserMapper.getAllUsers();
		if(sysUserInfos != null && sysUserInfos.size()>0) {
			
			redisUtil.getRedisTemplate().executePipelined(new RedisCallback<Object>() {

				@Override
				public Object doInRedis(RedisConnection connection) throws DataAccessException {
					for (int i = 0; i < sysUserInfos.size(); i++) {
						SysUser sysUser = sysUserInfos.get(i);
						StringRedisConnection redisConn = (StringRedisConnection) connection;
						redisConn.set(SYS_USER_INFO_+sysUser.getLoginName(), JSONObject.toJSONString(sysUser));
					}
					return null;
				}
				
			});
			
		}*/
		
		List<SysUser> sysUserInfos = sysUserMapper.getAllUsers();
		for (int i = 0; i < sysUserInfos.size(); i++) {
			SysUser sysUser = sysUserInfos.get(i);
			cacheMap.put(SYS_USER_INFO_+sysUser.getLoginName(), sysUser);
		}
	}

	@Override
	public SysUser sysUserLogin(String name, String passwd) {
		
		SysUser sysUser = this.getSysUserInfoByLoginName(name);
		if(sysUser != null && passwd.equals(sysUser.getPasswd())) {
			return sysUser;
		}
		
		return null;
	}

	@Override
	public SysUser getSysUserInfoByLoginName(String name) {
		/*String value = redisUtil.get(SYS_USER_INFO_+name);
		return JSONObject.parseObject(value, SysUser.class);*/
		
		return (SysUser) cacheMap.get(SYS_USER_INFO_+name);
	}

}
