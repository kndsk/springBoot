package com.ly.edu.mapper;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.MissColumn;
import com.ly.edu.domain.School;
import com.ly.edu.domain.SportStatistics;
import com.ly.edu.dto.SportStatisticsDTO;
import com.ly.edu.dto.TotalResultDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/11/21.
 */
public interface SchoolMapper extends MyMapper<School> {
    School findUser(School school);

    /**
     * checkGeneralInfoStatus
     * @Description:        查询用户是否完成了录入人员信息填写
     * @param school_code   String
     * @return              boolean
     */
    boolean checkGeneralInfoStatus(String school_code);

    /**
     * getExamRoomStatus
     * @Description:        查询上一个班级得成绩录入状态
     * @param schoolCode    String
     * @param examRoom      String
     * @return              boolean
     */
    boolean getExamRoomStatus(@Param("schoolCode")String schoolCode, @Param("examRoom") String examRoom);

    /**
     * 获取省
     * @return
     */
    List<SportStatistics> getProvinceArea(@Param("provinceCode") String provinceCode);

    /**
     * 获取区县
     * @param provinceCode
     * @return
     */
    List<SportStatistics> getCountryArea(@Param("provinceCode") String provinceCode, @Param("countryCode") String countryCode);

    /**
     * 获取学校
     * @param countryCode
     * @return
     */
    List<SportStatistics> getSchoolArea(String countryCode);

    /**
     * 获取当前页的成绩数据
     * @param data
     * @return
     */
    List<SportStatisticsDTO> getSportStatisticsList(Map<String, Object> data);

    /**
     * 获取已完成的数据
     * @param data
     * @return
     */
    List<SportStatisticsDTO> getFinishedStatisticsList(Map<String, Object> data);

    /**
     * 获取某一区域下的成绩集合
     * @param data
     * @return
     */
    List<TotalResultDTO> getTotalResult(Map<String, Object> data);

    /**
     * 获取系统配置项
     * @Description: getSysConfigs
     * @return      List<Map<String, String>>
     */
    List<Map<String, String>> getSysConfigs();

    /**
     * 获取学校某个考场的体育成绩列是否全部缺失状态
     * @param schoolCode
     * @param examRoom
     * @return
     */
    MissColumn getMissColStatus(@Param("schoolCode")String schoolCode, @Param("examRoom")String examRoom);

    /**
     *保存缺失列实体类状态值
     * @param missColumn
     * @return
     */
    boolean saveMisCol(MissColumn missColumn);

    /**
     * 更新缺失列实体类状态值
     * @param missColumn
     * @return
     */
    boolean updateMisCol(MissColumn missColumn);

    /**
     * 根据学校代号和考场号判断该缺失列实体类数据是否已存在
     * @param schoolCode
     * @param examRoom
     * @return
     */
    int checkMissCol(@Param("schoolCode")String schoolCode, @Param("examRoom")String examRoom);

    MissColumn getMissCol(@Param("schoolCode")String schoolCode, @Param("examRoom")String examRoom);
    
    /**
     * 获取所有学校的账号密码
     * @return
     */
    List<Map<String, Object>> getAllAccPwd();
    
    /**
     * 获取所有学校信息
     * @return
     */
    List<School> getAllSchoolInfo();

}
