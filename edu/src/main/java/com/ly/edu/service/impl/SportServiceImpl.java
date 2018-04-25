package com.ly.edu.service.impl;

import com.github.pagehelper.StringUtil;
import com.ly.edu.common.Constant;
import com.ly.edu.domain.*;
import com.ly.edu.dto.*;
import com.ly.edu.mapper.SchoolMapper;
import com.ly.edu.mapper.SchoolRecorderMapper;
import com.ly.edu.mapper.SportResultMapper;
import com.ly.edu.mapper.StudentMapper;
import com.ly.edu.service.SportService;
import com.ly.edu.util.*;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @author xdchen3
 *
 */
@Service("sportService")
public class SportServiceImpl implements SportService {

    @Autowired
    private SchoolRecorderMapper schoolRecorderMapper;
    @Autowired
    private SchoolMapper schoolMapper;
    @Autowired
    private SportResultMapper sportResultMapper;
    @Autowired
    private StudentMapper studentMapper;
    /**
     * 导出项目名单zip路径生成路径
     */
    @Value("${UPLOADING.PROJECT.ZIP.PATH}")
    private String PROJECT_ZIP_PATH;

    @Override
    public boolean saveRecorderInfo(SchoolRecorder recorder) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        recorder.setYear(Integer.parseInt(sdf.format(date)));
        return schoolRecorderMapper.saveRecorderInfo(recorder);
    }

    @Override
    public School userLogin(String account, String password) {
        School school = new School();
        school.setAccount(account);
        school.setPassword(password);
        return schoolMapper.findUser(school);
    }

    @Override
    public Map<String, Object> getSportInfo(SportResultDTO sportResultDTO) {
        boolean isSubmit = false;
        List<SportResultDTO> sportResultDTOList = sportResultMapper.getSportInfo(sportResultDTO);
        Map<String, Object> map = new HashMap<String, Object>();
        if (CollectionUtils.isNotEmpty(sportResultDTOList)){
            isSubmit = true;
            map.put("sportResultDTOList", sportResultDTOList);
            map.put("isSubmit", isSubmit);
            return map;
        }
        List<Student> studentList = studentMapper.getStuInfo(sportResultDTO);
        map.put("studentList", studentList);
        map.put("isSubmit", isSubmit);
        return map;
    }

    @Override
    public List<Map<String, Object>> getExamRooms(String schoolCode) {
        return studentMapper.getExamRooms(schoolCode);
    }

    @Override
    public List<Map<String, Object>> getStudents(String schoolCode, String examRoom) {
        return studentMapper.getStudents(schoolCode, examRoom);
    }

    @Override
    public boolean savaSport(List<SportResultDTO> sportResultDTOList, SportExamRoom sportExamRoom) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        for (SportResultDTO sportResultDTO : sportResultDTOList){
            sportResultDTO.setYear(Integer.parseInt(sdf.format(date)));
            sportResultDTO.setId(KeyHolder.getKey());
        }
        //boolean result = checkIsSubmit(sportExamRoom);
        /*for (SportResultDTO sporResult : sportResultDTOList){
            if (sporResult.getIs_empty() == 1){
                sporResult.setHeight(Constant.DEFAULT_INT_VALUE);
                sporResult.setWeight(Constant.DEFAULT_INT_VALUE);
                sporResult.setPower_first(Constant.DEFAULT_INT_VALUE);
                sporResult.setPower_second(Constant.DEFAULT_INT_VALUE);
                sporResult.setLeft_eye(Constant.DEFAULT_INT_VALUE);
                sporResult.setRight_eye(Constant.DEFAULT_INT_VALUE);
                sporResult.setBreath_first(Constant.DEFAULT_INT_VALUE);
                sporResult.setBreath_second(Constant.DEFAULT_INT_VALUE);
                sporResult.setFifty_meter(Constant.DEFAULT_INT_VALUE);
                sporResult.setJump_first(Constant.DEFAULT_INT_VALUE);
                sporResult.setJump_second(Constant.DEFAULT_INT_VALUE);
                sporResult.setJump_third(Constant.DEFAULT_INT_VALUE);
                sporResult.setFifth_meter(Constant.DEFAULT_INT_VALUE);
            }
        }*/
        if(studentMapper.saveStuInfo(sportResultDTOList) && sportResultMapper.saveSportInfo(sportResultDTOList)){
            return true;
        }
        return false;
    }

    @Override
    public boolean checkGeneralInfoStatus(String school_code) {
        return schoolMapper.checkGeneralInfoStatus(school_code);
    }

    @Override
    public boolean checkBarCode(List<String> list, List<String> idList) {
        List<Integer> barCodeList = studentMapper.checkBarCode(list, idList);
        for (Integer barCode : barCodeList){
            if (barCode > 0){
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean getExamRoomStatus(String schoolCode, String examRoom) {
        return schoolMapper.getExamRoomStatus(schoolCode, examRoom);
    }

    @Override
    public String exportSportDataList(String projectName, String provinceCode, String countryCode, String schoolCode, String projectId, int statisticsStatus) {
        try {
            long startTime = System.currentTimeMillis();
            long endTime = 0;
            Map<String, Object> map1 = new HashMap<String, Object>();
            map1.put("provinceCode", provinceCode);
            map1.put("countryCode", countryCode);
            map1.put("schoolCode", schoolCode);
            map1.put("projectId", projectId);
            map1.put("status", 0);
            //获取所有学生的统计信息，包括已录入成绩的和未录入成绩的
            List<SportStatisticsDTO> sportStatisticsList = studentMapper.getExcelSportData(map1);
            map1.put("status", 1);
            //获取所有已录入成绩的学生统计信息
            List<SportStatisticsDTO> sportStatisticsList1 = studentMapper.getExcelSportData(map1);
            map1.put("is_empty", 1);
            //获取所有已录入缺测成绩的学生统计信息
            List<SportStatisticsDTO> sportStatisticsList2 = studentMapper.getExcelSportData(map1);
            List<SportStatisticsDTO> sportFinishedList = new ArrayList<>();
            List<SportStatisticsDTO> sportUnFinishedList = new ArrayList<>();
            endTime = System.currentTimeMillis();
            DataTimeUtils.duration(startTime, endTime, "查询体育录入完成情况学生视图列表");
            String excelName = null;// 保存项目名称和学校形成的excel_name
            String sheetName = null;// 保存项目名称和学校形成的excel_name
            // 创建Excel电子薄;
            File f = new File(PROJECT_ZIP_PATH.substring(0, PROJECT_ZIP_PATH.lastIndexOf("/")));
            // 创建文件夹
            if (!f.exists()) {
                f.mkdirs();
            }
            File zipFile = new File(PROJECT_ZIP_PATH + projectName + ".zip");
            List<File> fileList = new ArrayList<File>();
            for (SportStatisticsDTO sportStatistics : sportStatisticsList) {
                if (sportStatistics.getStuTotal() == 0){
                    continue;
                }
                if (StringUtils.isBlank(provinceCode)){
                    excelName = "国家质量监测中心" + "_" + projectName;
                    sheetName = "国家质量监测中心";
                    for (SportStatisticsDTO sportStatistics1 : sportStatisticsList1){
                        if (StringUtil.isNotEmpty(sportStatistics1.getProvince_code())){
                            if (sportStatistics1.getProvince_code().equals(sportStatistics.getProvince_code())){
                                sportStatistics.setFinishedCount(sportStatistics1.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                    for (SportStatisticsDTO sportStatistics2 : sportStatisticsList2){
                        if (StringUtil.isNotEmpty(sportStatistics2.getProvince_code())){
                            if (sportStatistics2.getProvince_code().equals(sportStatistics.getProvince_code())){
                                sportStatistics.setMissingCount(sportStatistics2.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                }
                else if (StringUtil.isNotEmpty(provinceCode) && StringUtil.isEmpty(countryCode)){
                    excelName = sportStatistics.getProvince_name().trim() + "_" + projectName;
                    sheetName = sportStatistics.getProvince_name().trim();
                    for (SportStatisticsDTO sportStatistics1 : sportStatisticsList1){
                        if (StringUtil.isNotEmpty(sportStatistics1.getCountry_code())){
                            if (sportStatistics1.getCountry_code().equals(sportStatistics.getCountry_code())){
                                sportStatistics.setFinishedCount(sportStatistics1.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                    for (SportStatisticsDTO sportStatistics2 : sportStatisticsList2){
                        if (StringUtil.isNotEmpty(sportStatistics2.getCountry_code())){
                            if (sportStatistics2.getCountry_code().equals(sportStatistics.getCountry_code())){
                                sportStatistics.setMissingCount(sportStatistics2.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                }
                else if (StringUtil.isNotEmpty(provinceCode) && StringUtil.isNotEmpty(countryCode) && StringUtil.isEmpty(schoolCode)){
                    excelName = sportStatistics.getProvince_name().trim() + sportStatistics.getCountry_name().trim() + "_" + projectName;
                    sheetName = sportStatistics.getProvince_name().trim() + sportStatistics.getCountry_name().trim();
                    for (SportStatisticsDTO sportStatistics1 : sportStatisticsList1){
                        if (StringUtil.isNotEmpty(sportStatistics1.getSchool_code())){
                            if (sportStatistics1.getSchool_code().equals(sportStatistics.getSchool_code())){
                                sportStatistics.setFinishedCount(sportStatistics1.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                    for (SportStatisticsDTO sportStatistics2 : sportStatisticsList2){
                        if (StringUtil.isNotEmpty(sportStatistics2.getSchool_code())){
                            if (sportStatistics2.getSchool_code().equals(sportStatistics.getSchool_code())){
                                sportStatistics.setMissingCount(sportStatistics2.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                }
                else {
                    excelName = sportStatistics.getProvince_name().trim() + sportStatistics.getCountry_name().trim() + sportStatistics.getSchool_name().trim() + "_" + projectName;
                    sheetName = sportStatistics.getProvince_name().trim() + sportStatistics.getCountry_name().trim() + sportStatistics.getSchool_name().trim();
                    for (SportStatisticsDTO sportStatistics1 : sportStatisticsList1){
                        if (StringUtil.isNotEmpty(sportStatistics1.getSchool_code())){
                            if (sportStatistics1.getSchool_code().equals(sportStatistics.getSchool_code())){
                                sportStatistics.setFinishedCount(sportStatistics1.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                    for (SportStatisticsDTO sportStatistics2 : sportStatisticsList2){
                        if (StringUtil.isNotEmpty(sportStatistics2.getSchool_code())){
                            if (sportStatistics2.getSchool_code().equals(sportStatistics.getSchool_code())){
                                sportStatistics.setMissingCount(sportStatistics2.getStuTotal());
                            }
                        }else {
                            continue;
                        }
                    }
                }
                sportStatistics.setUnfinishedCount(sportStatistics.getStuTotal() - sportStatistics.getFinishedCount());
                if (sportStatistics.getStuTotal() == 0){
                    sportStatistics.setPercent(String.valueOf(0));
                }
                DecimalFormat df = new DecimalFormat("0.00");
                String per = "";
                if ((float)sportStatistics.getFinishedCount() / sportStatistics.getStuTotal() < 0.99){
                    per = df.format((float)sportStatistics.getFinishedCount() / sportStatistics.getStuTotal());
                }
                if ((float)sportStatistics.getFinishedCount() / sportStatistics.getStuTotal() >= 0.99 && (float)sportStatistics.getFinishedCount() / sportStatistics.getStuTotal() < 1.0){
                    per = "0.99";
                }
                if (sportStatistics.getFinishedCount() == 0){
                    sportStatistics.setPercent("0");
                }else if (sportStatistics.getStuTotal() == sportStatistics.getFinishedCount()){
                    sportStatistics.setPercent("100");
                }
                else {
                    int a = (int)(Double.parseDouble(per) * 100);
                    sportStatistics.setPercent(String.valueOf(a));
                }
                if (sportStatistics.getPercent().equals("100")){
                    //统计完成列表
                    sportFinishedList.add(sportStatistics);
                }else {
                    //统计未完成列表
                    sportUnFinishedList.add(sportStatistics);
                }
            }
            int num = 1;
            Map<String, List<List<String>>> map = new HashMap<>();
            System.out.println("excelName:" + excelName);
            List<List<String>> rowList = new ArrayList<>();
            Iterator<SportStatisticsDTO> sListIterator = null;
            if (statisticsStatus == 0){
                sListIterator = sportStatisticsList.iterator();
            }
            else if (statisticsStatus == 1){
                sListIterator = sportFinishedList.iterator();
            }
            else {
                sListIterator = sportUnFinishedList.iterator();
            }
            ExcelUtil.createExcelFile(map, PROJECT_ZIP_PATH + excelName);
            if (StringUtils.isBlank(provinceCode)){
                rowList.add(Constant.SPORT_NATIONAL_SHEET_HEAD);
            }
            else if (StringUtils.isBlank(countryCode) && StringUtil.isNotEmpty(provinceCode)){
                rowList.add(Constant.SPORT_PROVINCE_SHEET_HEAD);
            }
            else {
                rowList.add(Constant.SPORT_COUNTRY_SHEET_HEAD);
            }
            while (sListIterator.hasNext()) {
                List<String> cellList = new ArrayList<>();
                SportStatisticsDTO sportStatistics = sListIterator.next();
                if (sportStatistics.getStuTotal() == 0){
                    continue;
                }
                //填入以省为分组的表格数据
                if (StringUtils.isBlank(provinceCode)) {
                    cellList.add(String.valueOf(num++));
                    cellList.add(String.valueOf(sportStatistics.getProvince_name()));
                    cellList.add(String.valueOf(sportStatistics.getStuTotal()));
                    cellList.add(String.valueOf(sportStatistics.getFinishedCount()));
                    cellList.add(String.valueOf(sportStatistics.getMissingCount()));
                    cellList.add(String.valueOf(sportStatistics.getPercent()));
                    if (sportStatistics.getPercent().equals("100")) {
                        cellList.add(String.valueOf("已完成"));
                    }else {
                        cellList.add(String.valueOf("未完成"));
                    }
                    rowList.add(cellList);
                    map.put(sheetName, rowList);
                    sListIterator.remove();
                }
                //填入以区县分组的表格数据
                else if (StringUtil.isNotEmpty(provinceCode) && StringUtil.isEmpty(countryCode)) {
                    cellList.add(String.valueOf(num++));
                    cellList.add(String.valueOf(sportStatistics.getCountry_name()));
                    cellList.add(String.valueOf(sportStatistics.getStuTotal()));
                    cellList.add(String.valueOf(sportStatistics.getFinishedCount()));
                    cellList.add(String.valueOf(sportStatistics.getMissingCount()));
                    cellList.add(String.valueOf(sportStatistics.getPercent()));
                    if (sportStatistics.getPercent().equals("100")) {
                        cellList.add(String.valueOf("已完成"));
                    }else {
                        cellList.add(String.valueOf("未完成"));
                    }
                    rowList.add(cellList);
                    map.put(sheetName, rowList);
                    sListIterator.remove();
                }
                //填入以学校为分组的表格数据
                else {
                    cellList.add(String.valueOf(num++));
                    cellList.add(String.valueOf(sportStatistics.getSchool_name()));
                    cellList.add(String.valueOf(sportStatistics.getStuTotal()));
                    cellList.add(String.valueOf(sportStatistics.getFinishedCount()));
                    cellList.add(String.valueOf(sportStatistics.getMissingCount()));
                    cellList.add(String.valueOf(sportStatistics.getPercent()));
                    if (sportStatistics.getPercent().equals("100")) {
                        cellList.add(String.valueOf("已完成"));
                    }else {
                        cellList.add(String.valueOf("未完成"));
                    }
                    rowList.add(cellList);
                    map.put(sheetName, rowList);
                    sListIterator.remove();
                }
            }
            if (num > 1){
                String filePath = ExcelUtil.createExcelFile(map, PROJECT_ZIP_PATH + excelName);
                fileList.add(new File(filePath));
            }
            num = 1;
            endTime = System.currentTimeMillis();
            DataTimeUtils.duration(startTime, endTime, "生成excel");
            // 打包zip
            ZipUtilsForScale.ZipToResponse(fileList, zipFile, PROJECT_ZIP_PATH + projectName + ".zip");
            endTime = System.currentTimeMillis();
            DataTimeUtils.duration(startTime, endTime, "将excel打包成zip下载");
            for (File excelFile : fileList) {
                excelFile.delete();
            }
            return excelName;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    @Override
    public List<SportStatistics> getProvinceArea(String provinceCode) {
        return schoolMapper.getProvinceArea(provinceCode);
    }

    @Override
    public List<SportStatistics> getCountryArea(String provinceCode, String countryCode) {
        if (StringUtils.isEmpty(provinceCode)) return null;
        List<SportStatistics> countryArea = schoolMapper.getCountryArea(provinceCode, countryCode);
        return countryArea;
    }

    @Override
    public List<SportStatistics> getSchoolArea(String countryCode) {
        if (StringUtils.isEmpty(countryCode)) return null;
        return schoolMapper.getSchoolArea(countryCode);
    }

    @Override
    public Map<String, Object> getSportStatisticsList(String project_id, String province_code, String country_code, String school_code, int statisticsStatus, int pageNum, int pageSize) {
        Map<String, Object> map = new HashMap<>();
//        map.put("start", pageNum * pageSize);
//        map.put("number", pageSize);
        map.put("provinceCode", province_code);
        map.put("countryCode", country_code);
        map.put("schoolCode", school_code);
        map.put("projectId", project_id);
        List<SportStatisticsDTO> sportStatisticsList = schoolMapper.getSportStatisticsList(map);
        map.put("status", 1);
        List<SportStatisticsDTO> finishedList = schoolMapper.getFinishedStatisticsList(map);
        map.put("isEmpty", 1);
        List<SportStatisticsDTO> missingList = schoolMapper.getFinishedStatisticsList(map);

        //将缺测数
        for (int i = 0; i < finishedList.size(); i++) {
            SportStatisticsDTO dto = finishedList.get(i);
            for (int j = 0; j < missingList.size(); j++) {
                SportStatisticsDTO missingDto = missingList.get(j);
                if (dto.equals(missingDto)) {
                    dto.setMissingCount(missingDto.getStuTotal());
                    break;
                }
            }
        }

        //临时缓存
        List<SportStatisticsDTO> finishedCache = new ArrayList<>();
        List<SportStatisticsDTO> unfinishedCache = new ArrayList<>();
        //数据格式化
        DecimalFormat dFormat = new DecimalFormat("0.00");

        for (int i = 0; i < sportStatisticsList.size(); i++) {
            SportStatisticsDTO statisticsDTO = sportStatisticsList.get(i);

            //查看各个省
            if (StringUtils.isEmpty(province_code)) {
                String provinceCode = statisticsDTO.getProvince_code();
                for (int j = 0; j < finishedList.size(); j++) {
                    SportStatisticsDTO finishedDTO = finishedList.get(j);
                    String finishedProvince = finishedDTO.getProvince_code();
                    if (org.apache.commons.lang3.StringUtils.equals(provinceCode, finishedProvince)) {
                        statisticsDTO.setFinishedCount(finishedDTO.getStuTotal());
                        statisticsDTO.setMissingCount(finishedDTO.getMissingCount());
                        break;
                    }
                }
            }

            //查看各个区县
            if (!StringUtils.isEmpty(province_code) && StringUtils.isEmpty(country_code)) {
                String countryCode = statisticsDTO.getCountry_code();
                for (int j = 0; j < finishedList.size(); j++) {
                    SportStatisticsDTO finishedDTO = finishedList.get(j);
                    String finishedCountry = finishedDTO.getCountry_code();
                    if (org.apache.commons.lang3.StringUtils.equals(countryCode, finishedCountry)) {
                        statisticsDTO.setFinishedCount(finishedDTO.getStuTotal());
                        statisticsDTO.setMissingCount(finishedDTO.getMissingCount());
                        break;
                    }
                }
            }

            //查看各个学校
            if (!StringUtils.isEmpty(country_code) && StringUtils.isEmpty(school_code)) {
                String schoolCode = statisticsDTO.getSchool_code();
                for (int j = 0; j < finishedList.size(); j++) {
                    SportStatisticsDTO finishedDTO = finishedList.get(j);
                    String finishedSchool = finishedDTO.getSchool_code();
                    if (org.apache.commons.lang3.StringUtils.equals(schoolCode, finishedSchool)) {
                        statisticsDTO.setFinishedCount(finishedDTO.getStuTotal());
                        statisticsDTO.setMissingCount(finishedDTO.getMissingCount());
                        break;
                    }
                }
            }

            //查看单个学校
            if (!StringUtils.isEmpty(school_code)) {
                String schoolCode = statisticsDTO.getSchool_code();
                for (int j = 0; j < finishedList.size(); j++) {
                    SportStatisticsDTO finishedDTO = finishedList.get(j);
                    String finishedSchool = finishedDTO.getSchool_code();
                    if (org.apache.commons.lang3.StringUtils.equals(schoolCode, finishedSchool)) {
                        statisticsDTO.setFinishedCount(finishedDTO.getStuTotal());
                        statisticsDTO.setMissingCount(finishedDTO.getMissingCount());
                    }
                }
            }

            int stuTotal = statisticsDTO.getStuTotal();
            int finishedCount = statisticsDTO.getFinishedCount();
            statisticsDTO.setUnfinishedCount(stuTotal - finishedCount);
            float vPercent = (float) finishedCount / (float) stuTotal;
            if (vPercent > 0.99 && vPercent < 1.0){
                vPercent = 0.99f;
            }
            String format = dFormat.format(vPercent);
            statisticsDTO.setPercent(String.valueOf((int)(Double.parseDouble(format) * 100)));
            statisticsDTO.setStatisticsStatus(stuTotal == finishedCount ? 1 : 0);
            if (stuTotal == finishedCount) {
                finishedCache.add(statisticsDTO);
            } else {
                unfinishedCache.add(statisticsDTO);
            }
        }


        Map<String, Object> resultMap = new HashMap<>();
//        if (statisticsStatus == 1) { //已完成
//            resultMap.put("resultList", finishedCache);
//        } else if (statisticsStatus == 2) { //未完成
//            resultMap.put("resultList", unfinishedCache);
//        } else { //全部
//            resultMap.put("resultList", sportStatisticsList);
//        }

        List<SportStatisticsDTO> finallyList = new ArrayList<>();
        if (statisticsStatus == 1) { //已完成
            finallyList.addAll(finishedCache);
        } else if (statisticsStatus == 2) { //未完成
            finallyList.addAll(unfinishedCache);
        } else { //全部
            finallyList.addAll(sportStatisticsList);
        }

        List<SportStatisticsDTO> data = new ArrayList<>();
        for (int i = pageNum*pageSize; i < pageNum*pageSize + pageSize; i++) {
            if (i >= finallyList.size()) break;
            data.add(finallyList.get(i));
        }
        resultMap.put("resultList", data);
        return resultMap;
    }

    @Override
    public String getProjectIdByYear() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy");
        Date date = new Date();
        int i = Integer.parseInt(dateFormat.format(date));
        return sportResultMapper.getProjectIdByYear(i);
    }

    @Override
    public TotalResultDTO summarySportResult(String project_id, String province_code, String country_code, String school_code, int statisticsStatus) {
        Map<String, Object> tMap = new HashMap<>();
        tMap.put("provinceCode", province_code);
        tMap.put("countryCode", country_code);
        tMap.put("schoolCode", school_code);
        tMap.put("projectId", project_id);
        tMap.put("status", 1);
        List<TotalResultDTO> totalResultList = schoolMapper.getTotalResult(tMap);
        DecimalFormat dFormat = new DecimalFormat("0.00");
        TotalResultDTO resultDTO = new TotalResultDTO();
        int allStudent = 0;
        int num = 0;
        int finishedStudent = 0;
        int unfinishedStudent = 0;
        if (statisticsStatus == 1) { //已完成
            for (int i = 0; i < totalResultList.size(); i++) {
                TotalResultDTO dto = totalResultList.get(i);
                if (dto.getTotalStudents() != 0 && dto.getTotalStudents() == dto.getFinishedStudent()){
                    allStudent += dto.getTotalStudents();
                    num ++;
                }
            }
            finishedStudent = allStudent;
            unfinishedStudent = 0;
        } else if (statisticsStatus == 2) { //未完成
            for (int i = 0; i < totalResultList.size(); i++) {
                TotalResultDTO dto = totalResultList.get(i);
                if (dto.getTotalStudents() != 0 && dto.getTotalStudents() != dto.getFinishedStudent()){
                    allStudent += dto.getTotalStudents();
                    finishedStudent += dto.getFinishedStudent();
                    num ++;
                }
            }
            unfinishedStudent = allStudent - finishedStudent;
        } else { //全部
            for (int i = 0; i < totalResultList.size(); i++) {
                TotalResultDTO dto = totalResultList.get(i);
                if (dto.getTotalStudents() != 0){
                    allStudent += dto.getTotalStudents();
                    finishedStudent += dto.getFinishedStudent();
                    num ++;
                }
            }
            unfinishedStudent = allStudent - finishedStudent;
        }
        resultDTO.setTotalNum(num);
        resultDTO.setTotalStudents(allStudent);
        resultDTO.setFinishedStudent(finishedStudent);
        resultDTO.setUnFinishedStudents(unfinishedStudent);
        float v = (float) finishedStudent / (float) allStudent;
        if (v > 0.99 && v < 1.0){
            v = 0.99f;
        }
        String format = dFormat.format(v);
        resultDTO.setPercent(allStudent == 0 ? 0 + "%" : String.valueOf((int)(Double.parseDouble(format) * 100)) + "%");
        return resultDTO;
    }

	@Override
	public boolean checkIsALLSubmit(SportExamRoom sportExamRoom, String examRoom) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        sportExamRoom.setYear(Integer.parseInt(sdf.format(date)));
		List<SportExamRoom> list = studentMapper.checkIsALLSubmit(sportExamRoom);
		for (SportExamRoom sportExamRoom2 : list){
			if (!sportExamRoom2.getExam_room().equals(examRoom) && sportExamRoom2.getStatus() != 1){
				return false;
			}
		}
		return true;
	}

	@Override
	public boolean checkIsSubmit(SportExamRoom sportExamRoom) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        sportExamRoom.setYear(Integer.parseInt(sdf.format(date)));
        List<SportExamRoom> list = studentMapper.checkIsSubmit(sportExamRoom);
        if (CollectionUtils.isEmpty(list)){
        	return false;
        }
        for (SportExamRoom i : list){
        	if (i == null || i.getStatus() != 1){
        		return false;
        	}
        }
		return true;
	}

    @Override
    public List<Map<String, String>> getSysConfigs() {
        return schoolMapper.getSysConfigs();
    }

    @Override
    public boolean checkIsEnter(String studentId) {
        SportResultDTO sportResultDTO = sportResultMapper.checkIsEnter(studentId);
        if (sportResultDTO == null){
            return false;
        }
        return true;
    }

    /**
     * 对体育成绩进行实时保存
     * @param sportResultDTOList
     * @return
     */
    @Override
    public boolean realTimeSave(List<SportResultDTO> sportResultDTOList) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        for (SportResultDTO sportResultDTO : sportResultDTOList){
            sportResultDTO.setYear(Integer.parseInt(sdf.format(date)));
            sportResultDTO.setId(KeyHolder.getKey());
        }
        if (studentMapper.saveStuInfo(sportResultDTOList) && sportResultMapper.realTimeSave(sportResultDTOList)){
            return true;
        }
        return false;
    }

    /**
     * 对体育成绩进行实时更新
     * @param sportResultDTOList
     * @return
     */
    @Override
    public boolean realTimeUpdate(List<SportResultDTO> sportResultDTOList, MissColumnDTO missColumn) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        List<SportResultDTO> validSportResultList = new ArrayList<>();
        updateMisCol(sportResultDTOList, missColumn);
        for (SportResultDTO sportResultDTO : sportResultDTOList){
            if (sportResultDTO.getCurrentModify() == 1){
                validSportResultList.add(sportResultDTO);
                sportResultDTO.setYear(Integer.parseInt(sdf.format(date)));
            }
        }
        if (CollectionUtils.isEmpty(validSportResultList)){
           return true;
        } else {
            if (studentMapper.saveStuInfo(sportResultDTOList) && sportResultMapper.realTimeUpdate(validSportResultList)){
                return true;
            }
        }
        return false;
    }

    /**
     * 提交时更新体育成绩数据
     * @param sportResultDTOList
     * @return
     */
    @Override
    public boolean updateSportInfo(List<SportResultDTO> sportResultDTOList) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
        Date date = new Date();
        for (SportResultDTO sportResultDTO : sportResultDTOList){
            sportResultDTO.setYear(Integer.parseInt(sdf.format(date)));
        }
        if (studentMapper.saveStuInfo(sportResultDTOList) && sportResultMapper.updateSportInfo(sportResultDTOList)){
            return true;
        }
        return false;
    }

    @Override
    public boolean saveOrUpdateRecordInfo(SchoolRecorder recorder) {
        SchoolRecorder schoolRecorder = schoolRecorderMapper.checkRecorderInfo(recorder);
        if (schoolRecorder == null) {
            recorder.setId(KeyHolder.getKey());
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
            Date date = new Date();
            recorder.setYear(Integer.parseInt(sdf.format(date)));
            return schoolRecorderMapper.saveRecorderInfo(recorder);
        } else {
            //只做更新用
            recorder.setUpdater_id(recorder.getCreator_id());
            return schoolRecorderMapper.updateRecorderInfo(recorder);
        }
    }

    @Override
    public SchoolRecorder getRecoderInfo(String schoolCode, String exam_room) {
        SchoolRecorder recoderInfo = schoolRecorderMapper.getRecoderInfo(schoolCode, exam_room);
        if (recoderInfo == null) {
            recoderInfo = new SchoolRecorder();
        }
        return recoderInfo;
    }

    @Override
    public MissColumn getMissColStatus(String schoolCode, String examRoom) {
        MissColumn missColumn = schoolMapper.getMissColStatus(schoolCode, examRoom);
//        if (missColumn == null){
//            missColumn = new MissColumn();
//        }
        return missColumn;
    }

    @Override
    public boolean saveOrupdateMisCol(MissColumn missColumn) {
        int count = schoolMapper.checkMissCol(missColumn.getSchool_code(), missColumn.getExam_room());
        if (missColumn.getIsAll_miss() == 1){
            missColumn.setHeight_miss(1);
            missColumn.setWeight_miss(1);
            missColumn.setPower_first_miss(1);
            missColumn.setPower_second_miss(1);
            missColumn.setLeft_eye_miss(1);
            missColumn.setRight_eye_miss(1);
            missColumn.setBreath_first_miss(1);
            missColumn.setBreath_second_miss(1);
            missColumn.setFifth_miss(1);
            missColumn.setJump_first_miss(1);
            missColumn.setJump_second_miss(1);
            missColumn.setJump_third_miss(1);
            missColumn.setFifty_miss(1);
        }
        if (count > 0){
            if (schoolMapper.updateMisCol(missColumn)){
                return true;
            }
        }else {
            missColumn.setId(KeyHolder.getKey());
            if (schoolMapper.saveMisCol(missColumn)){
                return true;
            }
        }
        return false;
    }

    /**
     * 异地保存时更新单项缺失列的值
     * @param sportResultDTOList
     * @param missColumnDTO
     */
    public void updateMisCol(List<SportResultDTO> sportResultDTOList, MissColumnDTO missColumnDTO){
       // MissColumn missColumn1 = schoolMapper.getMissCol(missColumn.getSchool_code(), missColumn.getExam_room());
        if (missColumnDTO.getHeightIsChanged() == 1){
            sportResultMapper.updateHeightMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getWeightIsChanged() == 1){
            sportResultMapper.updateWeightMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getBreath_firstIsChanged() == 1){
            sportResultMapper.updateBreath_firstMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getBreath_secondIsChanged() == 1){
            sportResultMapper.updateBreath_secondMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getPower_firstIsChanged() == 1){
            sportResultMapper.updatePower_firstMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getPower_secondIsChanged() == 1){
            sportResultMapper.updatePower_secondMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getLeft_eyeIsChanged() == 1){
            sportResultMapper.updateLeft_eyeMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getRight_eyeIsChanged() == 1){
            sportResultMapper.updateRight_eyeMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getFiftyIsChanged() == 1){
            sportResultMapper.updateFifty_meterMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getJump_firstIsChanged() == 1){
            sportResultMapper.updateJump_firstMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getJump_secondIsChanged() == 1){
            sportResultMapper.updateJump_secondMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getJump_thirdIsChanged() == 1){
            sportResultMapper.updateJump_thirdMissCol(sportResultDTOList);
        }
        if (missColumnDTO.getFifthIsChanged() == 1){
            sportResultMapper.updateFifth_meterMissCol(sportResultDTOList);
        }
    }
}
