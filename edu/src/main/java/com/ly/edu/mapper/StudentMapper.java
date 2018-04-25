package com.ly.edu.mapper;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.Student;
import com.ly.edu.dto.SportExamRoom;
import com.ly.edu.dto.SportResultDTO;
import com.ly.edu.dto.SportStatisticsDTO;
import com.ly.edu.dto.StudentInfoDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2017/11/21.
 */
public interface StudentMapper extends MyMapper<Student>{
    /**
     * 获取学生信息
     * @param sportResultDTO
     * @return
     */
    List<Student> getStuInfo(SportResultDTO sportResultDTO);

    /**
     * getExamRooms
     * @Description:            获取考场信息
     * @param schoolCode        String
     * @return                  List<Map<String, Object>>
     */
    List<Map<String, Object>> getExamRooms(String schoolCode);
    
    /**
     * getStudents
     * @Description:        获取学生成绩信息
     * @param school_code   String
     * @param exam_room     String
     * @return              List<Map<String, Object>>
     */
    List<Map<String, Object>> getStudents(@Param("schoolCode") String schoolCode, @Param("examRoom") String examRoom);

    /**
     * 批量更新学生基本信息
     * @param list
     */
    boolean saveStuInfo(List<SportResultDTO> list);

    /**
     * 检查条形码是否有重复的
     * @param list
     * @return
     */
    List<Integer> checkBarCode(@Param("list") List<String> list, @Param("idList") List<String> idList);

    /**
     * 获取导出Excel表格数据
     * @param map
     * @return
     */
    List<SportStatisticsDTO> getExcelSportData(Map<String,Object> map);
    /**
     * 
     * checkIsALLSubmit(检查所有考场成绩是否已全部录入完成)
     * 
     * @param sportExamRoom
     * @return 
     * @exception 
     * @since 3.3
     * @author xzwang3
     */
    List<SportExamRoom> checkIsALLSubmit(SportExamRoom sportExamRoom);
    /**
     * 
     * checkIsSubmit(检查该考场是否已经提交)
     * 
     * @param sportExamRoom
     * @return 
     * @exception 
     * @since 3.3
     * @author xzwang3
     */
    List<SportExamRoom> checkIsSubmit(SportExamRoom sportExamRoom);
    
    /**
     * 获取所有学生信息
     * @return
     */
    List<Student> getAllStudentsInfo(@Param("pageNum") int pageNum, @Param("records") int records);
}
