package com.ly.edu.mapper;

import com.ly.edu.common.MyMapper;
import com.ly.edu.dto.SportResultDTO;

import java.util.List;

/**
 * Created by admin on 2017/11/21.
 */
public interface SportResultMapper extends MyMapper<SportResultDTO> {
    /**
     * 获取体育成绩列表
     * @param sportResultDTO
     * @return
     */
    List<SportResultDTO> getSportInfo(SportResultDTO sportResultDTO);

    /**
     * 保存体育成绩数据
     * @param sportResultDTOList
     */
    boolean saveSportInfo(List<SportResultDTO> sportResultDTOList);

    /**
     * 根据年份获取对应的projectID
     * @param year
     * @return
     */
    String getProjectIdByYear(int year);

    /**
     * 根据学生ID检查是否该学生已录入过成绩
     * @param studentId
     * @return
     */
    SportResultDTO checkIsEnter(String studentId);

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
    boolean realTimeUpdate(List<SportResultDTO> sportResultDTOList);

    /**
     * 提交时更新体育成绩数据
     * @param sportResultDTOList
     * @return
     */
    boolean updateSportInfo(List<SportResultDTO> sportResultDTOList);

    /**
     * 更新单项缺失身高列
     * @param sportResultDTOList
     * @return
     */
    boolean updateHeightMissCol(List<SportResultDTO> sportResultDTOList);

    /**
     * 更新单项缺失体重列
     * @param sportResultDTOList
     * @return
     */
    boolean updateWeightMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失第二次握力列
     * @param sportResultDTOList
     * @return
     */
    boolean updatePower_firstMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失第一次握力列
     * @param sportResultDTOList
     * @return
     */
    boolean updatePower_secondMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失左眼视力列
     * @param sportResultDTOList
     * @return
     */
    boolean updateLeft_eyeMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失右眼视力列
     * @param sportResultDTOList
     * @return
     */
    boolean updateRight_eyeMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失第一次肺活量列
     * @param sportResultDTOList
     * @return
     */
    boolean updateBreath_firstMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失第二次肺活量列
     * @param sportResultDTOList
     * @return
     */
    boolean updateBreath_secondMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失50米短跑列
     * @param sportResultDTOList
     * @return
     */
    boolean updateFifty_meterMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失第一次立定跳远列
     * @param sportResultDTOList
     * @return
     */
    boolean updateJump_firstMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失第二次立定跳远列
     * @param sportResultDTOList
     * @return
     */
    boolean updateJump_secondMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失第三次立定跳远列
     * @param sportResultDTOList
     * @return
     */
    boolean updateJump_thirdMissCol(List<SportResultDTO> sportResultDTOList);
    /**
     * 更新单项缺失15米折返跑列
     * @param sportResultDTOList
     * @return
     */
    boolean updateFifth_meterMissCol(List<SportResultDTO> sportResultDTOList);
}
