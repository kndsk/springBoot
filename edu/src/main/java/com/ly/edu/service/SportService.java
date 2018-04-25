package com.ly.edu.service;

import com.ly.edu.domain.MissColumn;
import com.ly.edu.domain.School;
import com.ly.edu.domain.SchoolRecorder;
import com.ly.edu.domain.SportStatistics;
import com.ly.edu.dto.MissColumnDTO;
import com.ly.edu.dto.SportExamRoom;
import com.ly.edu.dto.SportResultDTO;
import com.ly.edu.dto.TotalResultDTO;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/11/21.
 */
public interface SportService {
    /**
     * 保存信息录入人员等相关信息
     * @param recorder
     * @return
     */
    boolean saveRecorderInfo(SchoolRecorder recorder);

    /**
     * 验证登录账号密码
     * @param account
     * @param password
     * @return
     */
    School userLogin(String account, String password);

    /**
     * 获取体育成绩信息列表
     * @param sportResultDTO
     * @return
     */
    Map<String, Object> getSportInfo(SportResultDTO sportResultDTO);

    /**
     * getExamRooms
     * @Description:        获取学校当前的考场信息
     * @param school_code   String
     * @return              List<Map<String, Object>>
     */
    List<Map<String, Object>> getExamRooms(String school_code);

    /**
     * getStudents
     * @Description:        获取学生成绩信息
     * @param school_code   String
     * @param exam_room     String
     * @return              List<Map<String, Object>>
     */
    List<Map<String, Object>> getStudents(String school_code, String exam_room);


    /**
     * 保存录入信息
     * @param sportResultDTOList
     * @return
     */
    boolean savaSport(List<SportResultDTO> sportResultDTOList, SportExamRoom sportExamRoom);

    /**
     * checkGeneralInfoStatus
     * @Description:        查询用户是否完成了录入人员信息填写
     * @param school_code   String
     * @return              boolean
     */
    boolean checkGeneralInfoStatus(String school_code);
    /**
     * 检查条形码是否有重复的
     * @param list
     * @return
     */
    boolean checkBarCode(List<String> list, List<String> idList);

    /**
     * getExamRoomStatus
     * @Description:        查询上一个班级得成绩录入状态
     * @param schoolCode    String
     * @param examRoom      String
     * @return              boolean
     */
    boolean getExamRoomStatus(String schoolCode, String examRoom);

    /**
     * 导出体育成绩录入完成情况数据表
     * @param projectName        文件名称
     * @param proviceCode        省份代号
     * @param countryCode        区县代号
     * @param countryCode        学校代号
     * @param projectId          项目ID
     * @param statisticsStatus  选中状态 0 全部 1 已完成 2 未完成
     * @return int
     */
    String exportSportDataList(String projectName, String proviceCode, String countryCode, String schoolCode, String projectId, int statisticsStatus);
    /**
     * 获取省信息集合
     * @param provinceCode 
     * @return List<SportStatistics>
     */
    List<SportStatistics> getProvinceArea(String provinceCode);

    /**
     * 获取区县信息集合
     * @return List<SportStatistics>
     */
    List<SportStatistics> getCountryArea(String provinceCode, String countryCode);
    /**
     * 获取学校信息集合
     * @return List<SportStatistics>
     */
    List<SportStatistics> getSchoolArea(String countryCode);
    /**
     * 获取体育成绩统计数据列表
     * @param province_code 省
     * @param country_code  市（区）
     * @param school_code   学校
     * @param statisticsStatus  完成状态
     * @return List<SportStatisticsDTO>
     */
    Map<String, Object> getSportStatisticsList(String project_id, String province_code, String country_code, String school_code, int statisticsStatus, int pageNum, int pageSize);

    /**
     * 获取当年的projectId
     * @return
     */
    String getProjectIdByYear();

    TotalResultDTO summarySportResult(String project_id, String province_code, String country_code, String school_code, int statisticsStatus);
    /**
     * 
     * checkIsALLSubmit(检查所有考场成绩是否已全部录入完成)
     * 
     * @param sportExamRoom 
     * @param examRoom 
     * @return 
     * @exception 
     * @since 3.3
     * @author xzwang3
     */
    boolean checkIsALLSubmit(SportExamRoom sportExamRoom, String examRoom);
    /**
     * 
     * checkIsSubmit(检查该考场成绩是否已经提交)
     * 
     * @param sportExamRoom
     * @return 
     * @exception 
     * @since 3.3
     * @author xzwang3
     */
    boolean checkIsSubmit(SportExamRoom sportExamRoom);

    /**
     * getSysConfigs
     * @Description: getSysConfigs
     * @return      List<Map<String, String>>
     */
    List<Map<String, String>> getSysConfigs();
    /**
     * 根据学生ID检查是否该学生已录入过成绩
     * @param studentId
     * @return
     */
    boolean checkIsEnter(String studentId);

    /**
     * 异地保存学生体育成绩
     * @param sportResultDTOList
     * @return
     */
    boolean realTimeSave(List<SportResultDTO> sportResultDTOList);

    /**
     * 异地更新学生体育成绩
     * @param sportResultDTOList
     * @return
     */
    boolean realTimeUpdate(List<SportResultDTO> sportResultDTOList, MissColumnDTO missColumn);
    /**
     * 提交时更新体育成绩数据
     * @param sportResultDTOList
     * @return
     */
    boolean updateSportInfo(List<SportResultDTO> sportResultDTOList);

    /**
     * 保存或者更新
     * @param recorder
     * @return
     */
    boolean saveOrUpdateRecordInfo(SchoolRecorder recorder);

    /**
     * 根据学校代号和考场号获取录入人员相关信息
     * @param schoolCode
     * @param exam_room
     * @return
     */
    SchoolRecorder getRecoderInfo(String schoolCode, String exam_room);

    /**
     * 获取学校某个考场的体育成绩列是否全部缺失状态
     * @param schoolCode
     * @param examRoom
     * @return
     */
    MissColumn getMissColStatus(String schoolCode, String examRoom);

    /**
     * 保存或更新缺失列实体类数据
     * @param missColumn
     * @return
     */
    boolean saveOrupdateMisCol(MissColumn missColumn);
}
