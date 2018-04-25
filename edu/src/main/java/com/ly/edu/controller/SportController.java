package com.ly.edu.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ly.edu.domain.*;
import com.ly.edu.dto.*;
import com.ly.edu.models.RespObj;
import com.ly.edu.service.SportDataHandlerService;
import com.ly.edu.service.SportService;
import com.ly.edu.util.DataVerificationUtill;
import com.ly.edu.util.JSONUtils;
import com.ly.edu.util.KeyHolder;
import com.ly.edu.util.StringUtils;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author xdchen3
 * 体育成绩录入controller
 */
@Controller
@RequestMapping("/")
public class SportController extends BaseController {
    
    @Autowired
    private SportService sportService;
    /**
     * 导出项目名单zip路径生成路径
     */
    @Value("${UPLOADING.PROJECT.ZIP.PATH}")
    private String PROJECT_ZIP_PATH;
    
    @Autowired
    private SportDataHandlerService sportDataHandlerService;

    /**
     * 保存信息录入员等信息
     * @param recorderName 信息录入员姓名
     * @param reviewerName 信息审核员姓名
     * @param iphone 联系方式
     * @param request 获取当前登录人信息
     * @return 返回值
     */
    @RequestMapping(method = RequestMethod.POST, value = "/saveRecorderInfo")
    @ResponseBody
    public Object saveRecorderInfo(String recorderName, String reviewerName, String iphone, HttpServletRequest request){
        try {
            if (StringUtils.isBlank(recorderName)){
                return new RespObj(false, null, "信息录入员不能为空");
            }
            if (StringUtils.isBlank(reviewerName)){
                return new RespObj(false, null, "信息审核员不能为空");
            }
            if (StringUtils.isBlank(iphone)){
                return new RespObj(false, null, "联系方式不能为空");
            }
            if (!(DataVerificationUtill.isMobile(iphone) || DataVerificationUtill.isPhone(iphone))){
                return new RespObj(false, null, "电话号码格式不对");
            }
            School user = (School) request.getSession().getAttribute("schoolUser");
            SchoolRecorder recorder = new SchoolRecorder();
            recorder.setId(KeyHolder.getKey());
            recorder.setContac_info(iphone);
            recorder.setCreator_id(user.getUser_id());
            recorder.setName(user.getSchool_name());
            recorder.setRecorder(recorderName);
            recorder.setReviewer(reviewerName);
            recorder.setSchool_id(user.getSchool_id());
            boolean result = sportService.saveRecorderInfo(recorder);
            if (result){
                return new RespObj(true, null, "保存成功");
            }
            return new RespObj(false, null, "保存失败");
        }catch (Exception e){
            return new RespObj(false, null, "保存失败");
        }
    }

    /**
     * 获取体育录入成绩列表
     * @param examRoom 考场号
     * @param request 获取当前登录人信息
     * @return 返回值
     */
    @RequestMapping(method = RequestMethod.GET, value = "/getSportInfo")
    @ResponseBody
    public Object getSportInfo(String examRoom, HttpServletRequest request){
        School user = (School) request.getSession().getAttribute("schoolUser");
        SportResultDTO sportResultDTO = new SportResultDTO();
        if (StringUtils.isBlank(examRoom)){
            return new RespObj(false, null, "测试教室号不能为空");
        }
        sportResultDTO.setProvinceCode(user.getProvince_code());
        sportResultDTO.setCountryCode(user.getCountry_code());
        sportResultDTO.setSchoolCode(user.getSchool_code());
        sportResultDTO.setExamRoom(examRoom);
        Map<String, Object>map = sportService.getSportInfo(sportResultDTO);
        return new RespObj(true, map, "获取成功");
    }

    /**
     * 保存提交的体育成绩录入信息
     * @param data
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/savaSport")
    @ResponseBody
    public Object savaSport(String data, String misColJson, String schoolCode, String examRoom, String schRecderJson, HttpServletRequest request){
        School user = (School) request.getSession().getAttribute("schoolUser");
        if (StringUtils.isEmpty(schRecderJson)){
            return new RespObj(false, null, "传入的信息员信息不能为空");
        }
        if (StringUtils.isEmpty(misColJson)){
            return new RespObj(false, null, "传入的缺失类数据不能为空");
        }
        if (StringUtils.isEmpty(data)){
            return new RespObj(false, null, "传入的体育测试数据不能为空");
        }
        List<SportResultDTO> sportResultDTOList = JSONArray.parseArray(data, SportResultDTO.class);
        List<String> barcodeList = new ArrayList<>();
        List<String> idList = new ArrayList<>();
        //需要插入的体育成绩数据列表
        List<SportResultDTO> insertList = new ArrayList<>();
        //需要更新的体育成绩数据列表
        List<SportResultDTO> updateList = new ArrayList<>();
        SchoolRecorder schoolRecorder = JSONObject.parseObject(schRecderJson, SchoolRecorder.class);
        boolean isTimeOut = this.checkTime(request, user.getProvince_code());
        if (!isTimeOut){
            return JSON.toJSON(new RespObj(false, null, "outtime"));
        }
        if (StringUtils.isEmpty(schoolCode)){
            return JSON.toJSON(new RespObj(false, null, "传入的学校代码不能为空！"));
        }
        if (StringUtils.isEmpty(examRoom)){
            return JSON.toJSON(new RespObj(false, null, "传入的测试教室号不能为空！"));
        }
        if (StringUtils.isEmpty(schoolRecorder.getRecorder()) || StringUtils.isEmpty(schoolRecorder.getReviewer()) || StringUtils.isEmpty(schoolRecorder.getContac_info())){
            return JSON.toJSON(new RespObj(false, null, "录入相关人员的信息不能为空！"));
        }
        if (!(DataVerificationUtill.isMobile(schoolRecorder.getContac_info()) || DataVerificationUtill.isPhone(schoolRecorder.getContac_info()))){
            return new RespObj(false, null, "电话号码格式不对");
        }
        if (CollectionUtils.isNotEmpty(sportResultDTOList)){
            Map<String, Object>map = DataVerificationUtill.dataVerif(sportResultDTOList, user.getGradeType());
            boolean result = false;
            String errorMsg = "";
            for(String key : map.keySet()){
                if (key.equals("result")){
                    result = (boolean)map.get(key);
                }else {
                    errorMsg = (String) map.get(key);
                }
            }
            if (!result){
                return new RespObj(false, null, errorMsg);
            }
            for (SportResultDTO sportResultDTO : sportResultDTOList){
                if (StringUtils.isBlank(sportResultDTO.getStudent_id())){
                    return new RespObj(false, null, "学生ID不能为空");
                }
                //将已经录入过的成绩添加到updateList列表中，没有录入过的成绩添加到insertList列表中
                if (sportService.checkIsEnter(sportResultDTO.getStudent_id())){
                    updateList.add(sportResultDTO);
                }else {
                    insertList.add(sportResultDTO);
                }
                if (sportResultDTO.getBarcodeStatus() == 1){
                    barcodeList.add(sportResultDTO.getBarcode());
                    idList.add(sportResultDTO.getStudent_id());
                }
                sportResultDTO.setCreator_id(user.getUser_id());
            }
            if (CollectionUtils.isNotEmpty(barcodeList)){
                if (!sportService.checkBarCode(barcodeList, idList)){
                    return new RespObj(false, null, "修改的条形码不能重复");
                }
            }
            SportExamRoom sportExamRoom = new SportExamRoom();
            sportExamRoom.setExam_room(examRoom);
            sportExamRoom.setSchool_code(schoolCode);
            boolean isSubmit = sportService.checkIsSubmit(sportExamRoom);
            if (isSubmit){
            	return new RespObj(false, isSubmit, "保存失败，当前测试教室已经完成过录入！");
            }
            MissColumn missColumn = JSONObject.parseObject(misColJson, MissColumn.class);
            if (StringUtils.isEmpty(missColumn.getExam_room()) || StringUtils.isEmpty(missColumn.getSchool_code())){
                return new RespObj(false, null, "保存失败，当前缺失列对象中的测试教室号或者学校代号为空");
            }
            boolean misColResult = sportService.saveOrupdateMisCol(missColumn);
            if (!misColResult){
                return new RespObj(false, null, "录入测试数据的相关数据列全部缺失信息保存失败");
            }
            //保存录入员信息
            schoolRecorder.setSchool_id(schoolCode);
            schoolRecorder.setName(user.getSchool_name());
            schoolRecorder.setCreator_id(user.getUser_id());
            schoolRecorder.setExam_room(examRoom);
            boolean recordResult = sportService.saveOrUpdateRecordInfo(schoolRecorder);
            if (!recordResult){
                return new RespObj(false, null, "录入测试数据的相关人员信息保存失败");
            }
            boolean saveResult = false;
            boolean updateResult = false;
            if (CollectionUtils.isNotEmpty(insertList)){
                saveResult = sportService.savaSport(insertList, sportExamRoom);
            }
            if (CollectionUtils.isNotEmpty(updateList)){
                updateResult = sportService.updateSportInfo(updateList);
            }
            boolean isAllSubmit = sportService.checkIsALLSubmit(sportExamRoom, examRoom);
            if (CollectionUtils.isNotEmpty(insertList) && CollectionUtils.isNotEmpty(updateList)){
                if (saveResult && updateResult){
                    return new RespObj(true, isAllSubmit, "保存成功");
                }
            }
            if (CollectionUtils.isNotEmpty(insertList) && CollectionUtils.isEmpty(updateList)){
                if (saveResult){
                    return new RespObj(true, isAllSubmit, "保存成功");
                }
            }
            if (CollectionUtils.isEmpty(insertList) && CollectionUtils.isNotEmpty(updateList)){
                if (updateResult){
                    return new RespObj(true, isAllSubmit, "保存成功");
                }
            }
            return new RespObj(false, null, "保存失败");
        }
        return new RespObj(false, null, "对象不能为空");
    }

    /**
     * 跳转信息录入员页面
     * @return url
     */
    @RequestMapping(method = RequestMethod.GET, value = "/recorderInformation")
    public String checkInformation(HttpServletRequest request, HttpServletResponse response) {
        return "sport/recorderInformation";
    }

    /**
     * 跳转成绩录入监控
     * @return url
     */
    @RequestMapping(method = RequestMethod.GET, value = "/inputControl")
    public String enterInputControl(HttpServletRequest request, HttpServletResponse response, Model model) {
        //将project_id返回到前台
        String projectId = sportService.getProjectIdByYear();
        model.addAttribute("projectId", projectId);
        Object sysUserObj = request.getSession().getAttribute("sysUser");
        if (sysUserObj != null) {
            model.addAttribute("sysUser", sysUserObj);
        }
        return "sport/inputControl";
    }

    /**
     * 跳转成绩录入页面
     * @param request
     * @param response
     * @return
     */
    @RequestMapping(method = RequestMethod.GET, value = "/homePage")
    public String homepage(HttpServletRequest request, HttpServletResponse response) {
        School school = (School) request.getSession().getAttribute("schoolUser");
        if (school == null) {
            //未登录或者未授权
            return "dog";
        }

        //如果已经完成过录入人员信息填写工作，则直接进入填写页面，否则填写基本信息
//        boolean flag = sportService.checkGeneralInfoStatus(school.getSchool_code());
//        if (!flag) {
//            return this.checkInformation(request, response);
//        }
        //查询该学校的所有考场信息
        List<Map<String, Object>> examRooms = sportService.getExamRooms(school.getSchool_code());
        request.setAttribute("examRooms", examRooms);
        request.setAttribute("account", school.getAccount());
        return "sport/homePage";
    }
    
    /**
     * 获取体育录入成绩列表
     * @param examRoom 考场号
     * @param request 获取当前登录人信息
     * @return 返回值
     */
    @RequestMapping(method = RequestMethod.POST, value = "/toStudentTables")
    public String toStudentTables(String schoolCode, String examRoom, HttpServletRequest request, Model model){
        School school = (School) request.getSession().getAttribute("schoolUser");
        if (school == null) {
            //未登录或者未授权
            return "dog";
        }
            
        if (StringUtils.isBlank(examRoom)){
            return "sport/studentTable";
        }
        List<Map<String, Object>> students = sportService.getStudents(schoolCode, examRoom);
        SchoolRecorder schoolRecorder = sportService.getRecoderInfo(schoolCode, examRoom);
        MissColumn missColumn = sportService.getMissColStatus(schoolCode, examRoom);
        request.setAttribute("schoolRecorder", JSONUtils.toJSONString(schoolRecorder));
        request.setAttribute("students", students);
        request.setAttribute("missColumn", missColumn == null ? "" : JSONUtils.toJSONString(missColumn));
        if (students == null) {
            request.setAttribute("studentsJson", JSONUtils.toJSONString(new ArrayList<Map<String, Object>>()));
        } else {
            request.setAttribute("studentsJson", JSONUtils.toJSONString(students));
        }
        return "sport/studentTable";
    }
    
    /**
     * 查询当前考场上一个得提交状态
     * @Description: 
     * @param examRoom
     * @param request
     * @return
     */
    /*@RequestMapping(method = RequestMethod.GET, value = "/getExamRoomStatus")
    @ResponseBody
    public Object getExamRoomStatus(String examRoom, String schoolCode, HttpServletRequest request){
        if (StringUtils.isBlank(examRoom)){
            return new RespObj(false, null, "后台运行异常，考场号不能为空");
        }
        if (StringUtils.isBlank(schoolCode)){
            return new RespObj(false, null, "后台运行异常，学校编号不能为空");
        }
        if ("1".equals(examRoom) || "01".equals(examRoom) ) {
            //如果当前已经是第一个考场了，那么不做校验
            return new RespObj(true, true, "获取成功");
        }
        boolean status = sportService.getExamRoomStatus(schoolCode, examRoom);
        return new RespObj(true, status, "获取成功");
    }*/

    /**
     * 体育录入完成情况Excel导出接口
     * @param request  获取下载句柄
     * @param response 设置下载句柄
     * @param provinceCode        省份名称
     * @param countryCode         区县名称
     * @param projectId          学校名称
     * @param statisticsStatus  完成状态值
     */
    @RequestMapping(method = RequestMethod.POST, value = "/exportSportDataList")
    @ResponseBody
    public Object exportSportDataList(HttpServletRequest request, HttpServletResponse response, String provinceCode, String countryCode, String schoolCode, String projectId, int statisticsStatus) {
        response.reset();
        String projectName = "体育测试数据录入完成情况统计表";
        if (statisticsStatus != 0 && statisticsStatus != 1 && statisticsStatus != 2){
            return new RespObj(false, null, "传入的状态值有误");
        }
        try {
            File filePath = new File(PROJECT_ZIP_PATH + projectName + ".zip");
            Object sysUserObj = request.getSession().getAttribute("sysUser");
            if (sysUserObj != null) {
                SysUser sysUser = (SysUser) sysUserObj;
                provinceCode = StringUtils.isEmpty(sysUser.getProvinceId()) ? provinceCode : sysUser.getProvinceId();
                countryCode = StringUtils.isEmpty(sysUser.getDistrictId()) ? countryCode : sysUser.getDistrictId();
            }
            projectName = sportService.exportSportDataList(projectName, provinceCode, countryCode, schoolCode, projectId, statisticsStatus);
            String fileName = projectName + ".zip";
            response.setContentType("application/x-download");
            response.setCharacterEncoding("UTF-8");
            String userAgent = request.getHeader("User-Agent").toLowerCase();
            String strHeader = "";
            /**
             * 1. IE浏览器，采用URLEncoder编码 2. Opera浏览器，采用filename*方式 3. Safari浏览器，采用ISO编码的中文输出 4.
             * chrome浏览器，采用Base64编码或ISO编码的中文输出 5. Firefox浏览器，采用Base64或filename*或ISO编码的中文输出
             * 
             */
            // IE使用URLEncoder
            if (userAgent.contains("firefox")) {
                strHeader = "attachment;filename=" + new String((fileName).getBytes("utf-8"), "ISO8859-1");
            } else if (userAgent.contains("msie") || userAgent.contains("rv:11") || userAgent.contains("edge")) {
                strHeader = "attachment;filename=" + URLEncoder.encode(fileName,"UTF-8");
                strHeader = strHeader.replace("+"," ");
                // 其它使用转iso
            } else {
                strHeader = "attachment;filename=" + new String((fileName).getBytes("utf-8"), "ISO8859-1");
            }
            response.addHeader("Content-Disposition", strHeader);
            FileInputStream fis = new FileInputStream(filePath);
            BufferedInputStream buff = new BufferedInputStream(fis);
            byte[] b = new byte[1024];// 相当于我们的缓存
            long k = 0;// 该值用于计算当前实际下载了多少字节
            OutputStream myout = response.getOutputStream();// 从response对象中得到输出流,准备下载
            // 开始循环下载
            while (k < filePath.length()) {
                int j = buff.read(b, 0, 1024);
                k += j;
                myout.write(b, 0, j);
            }
            myout.flush();
        } catch (Exception e) {
            return new RespObj(false, null, "导出失败");
        }
        return new RespObj(true, null, "导出成功");
    }
    /**
     * 获取省列表
     * @param request
     * @param response
     * @return List<SportStatistics>
     */
    @RequestMapping(method = RequestMethod.GET, value = "/getProvinceList")
    @ResponseBody
    public Object getProvinceArea(HttpServletRequest request, HttpServletResponse response) {
        String provinceCode = "";
        Object sysUserObj = request.getSession().getAttribute("sysUser");
        if (sysUserObj != null) {
            SysUser sysUser = (SysUser) sysUserObj;
            provinceCode = sysUser.getProvinceId();
        }
        List<SportStatistics> provinceArea = sportService.getProvinceArea(provinceCode);
        return new RespObj(true, provinceArea, "获取成功");
    }

    /**
     * 获取区县列表
     * @param request
     * @return List<SportStatistics>
     */
    @RequestMapping(method = RequestMethod.GET, value = "/getCountryList")
    @ResponseBody
    public Object getCountryArea(String provinceCode, HttpServletRequest request) {
        String countryCode = "";
        Object sysUserObj = request.getSession().getAttribute("sysUser");
        if (sysUserObj != null) {
            SysUser sysUser = (SysUser) sysUserObj;
            countryCode = sysUser.getDistrictId();
        }
        List<SportStatistics> countryArea = sportService.getCountryArea(provinceCode, countryCode);
        return new RespObj(true, countryArea, "获取成功");
    }

    /**
     * 获取学校列表
     * @param request
     * @return List<SportStatistics>
     */
    @RequestMapping(method = RequestMethod.GET, value = "/getSchoolList")
    @ResponseBody
    public Object getSchoolArea(String countryCode, HttpServletRequest request) {
        List<SportStatistics> schoolArea = sportService.getSchoolArea(countryCode);
        return new RespObj(true, schoolArea, "获取成功");
    }

    @RequestMapping(method = RequestMethod.POST, value = "/getSportResult")
    public String getSportResult(HttpServletRequest request,HttpServletResponse response, Model model,String project_id, String provinceCode, String countryCode, String schoolCode, int statisticsStatus, int pageIndex, int pageSize){
        Object sysUserObj = request.getSession().getAttribute("sysUser");
        if (sysUserObj != null) {
            SysUser sysUser = (SysUser) sysUserObj;
            provinceCode = StringUtils.isEmpty(sysUser.getProvinceId()) ? provinceCode : sysUser.getProvinceId();
            countryCode = StringUtils.isEmpty(sysUser.getDistrictId()) ? countryCode : sysUser.getDistrictId();
        }
        Map<String, Object> map = sportService.getSportStatisticsList(project_id, provinceCode, countryCode, schoolCode, statisticsStatus, pageIndex, pageSize);
        List<SportStatisticsDTO> sportStatisticsList = (List<SportStatisticsDTO>) map.get("resultList");
        model.addAttribute("sportStatisticsList", sportStatisticsList);
        if (StringUtils.isEmpty(provinceCode)) {
            return "sport/provinceResult";
        }
        if (!StringUtils.isEmpty(provinceCode) && StringUtils.isEmpty(countryCode)) {
            return "sport/countryResult";
        }
        if (!StringUtils.isEmpty(countryCode)) {
            return "sport/schoolResult";
        }
        return "dog";
    }

    @RequestMapping(method = RequestMethod.GET, value = "/summarySportResult")
    @ResponseBody
    public Object summarySportResult(HttpServletRequest request, HttpServletResponse response, String provinceCode, String countryCode, String schoolCode, String projectId, int statisticsStatus) {
        Object sysUserObj = request.getSession().getAttribute("sysUser");
        if (sysUserObj != null) {
            SysUser sysUser = (SysUser) sysUserObj;
            provinceCode = StringUtils.isEmpty(sysUser.getProvinceId()) ? provinceCode : sysUser.getProvinceId();
            countryCode = StringUtils.isEmpty(sysUser.getDistrictId()) ? countryCode : sysUser.getDistrictId();
        }
        TotalResultDTO totalResultDTO = sportService.summarySportResult(projectId, provinceCode, countryCode, schoolCode, statisticsStatus);
        return new RespObj(true, totalResultDTO, "获取成功");
    }

    /**
     * 异地保存体育成绩录入
     * @param data
     * @param schoolCode
     * @param examRoom
     * @param request
     * @return
     */
    @RequestMapping(method = RequestMethod.POST, value = "/realTimeSave")
    @ResponseBody
    public Object realTimeSave(String data, String misColJson, String schoolCode, String examRoom, String schRecderJson, HttpServletRequest request){
        School user = (School) request.getSession().getAttribute("schoolUser");
        if (StringUtils.isEmpty(misColJson)){
            return new RespObj(false, null, "传入的缺失类数据不能为空");
        }
        if (StringUtils.isEmpty(data)){
            return new RespObj(false, null, "传入的体育测试数据不能为空");
        }
        List<SportResultDTO> sportResultDTOList = JSONArray.parseArray(data, SportResultDTO.class);
        SportExamRoom sportExamRoom = new SportExamRoom();
        sportExamRoom.setExam_room(examRoom);
        sportExamRoom.setSchool_code(schoolCode);
        boolean isSubmit = sportService.checkIsSubmit(sportExamRoom);
        if (isSubmit){
            return new RespObj(false, isSubmit, "保存失败，当前测试教室的测试数据已经完成提交，请刷新当前页面查看测试数据！");
        }
        MissColumnDTO missColumnDTO = JSONObject.parseObject(misColJson, MissColumnDTO.class);
        if (StringUtils.isEmpty(missColumnDTO.getExam_room()) || StringUtils.isEmpty(missColumnDTO.getSchool_code())){
            return new RespObj(false, null, "保存失败，当前缺失列对象中的测试教室号或者学校代号为空");
        }
        SchoolRecorder schoolRecorder = null;
        if (StringUtils.isEmpty(schRecderJson)){
            schoolRecorder = new SchoolRecorder();
        }else {
            schoolRecorder = JSONObject.parseObject(schRecderJson, SchoolRecorder.class);
        }
        if (CollectionUtils.isEmpty(sportResultDTOList)){
            return new RespObj(false, null, "传入的测试数据列表不能为空");
        }
        //保存录入员信息
        schoolRecorder.setSchool_id(schoolCode);
        schoolRecorder.setName(user.getSchool_name());
        schoolRecorder.setCreator_id(user.getUser_id());
        schoolRecorder.setExam_room(examRoom);
        /*boolean recorderResult = sportService.saveOrUpdateRecordInfo(schoolRecorder);
        if (!recorderResult){
            return new RespObj(false, null, "录入测试数据的相关人员信息保存失败");
        }*/
        //对录入的学生成绩数据进行校验
        Map<String, Object>map = DataVerificationUtill.dataVerif(sportResultDTOList, user.getGradeType());
        boolean result = false;
        String errorMsg = "";
        for(String key : map.keySet()){
            if (key.equals("result")){
                result = (boolean)map.get(key);
            }else {
                errorMsg = (String) map.get(key);
            }
        }
        if (!result){
            return new RespObj(false, null, errorMsg);
        }
        List<String> barcodeList = new ArrayList<>();
        List<String> idList = new ArrayList<>();
        List<SportResultDTO> updateList = new ArrayList<>();//需要更新的体育成绩列表
        List<SportResultDTO> insertList = new ArrayList<>();//需要插入的体育成绩列表
        for (SportResultDTO sportResultDTO : sportResultDTOList){
            if (StringUtils.isBlank(sportResultDTO.getStudent_id())){
                return new RespObj(false, null, "学生ID不能为空");
            }
            //将已经录入过的成绩添加到updateList列表中，没有录入过的成绩添加到insertList列表中
            if (sportService.checkIsEnter(sportResultDTO.getStudent_id())){
                updateList.add(sportResultDTO);
            }else {
                insertList.add(sportResultDTO);
            }
            //根据BarcodeStatus状态将修改的条形码添加到barcodeList列表中
            if (sportResultDTO.getBarcodeStatus() == 1){
                barcodeList.add(sportResultDTO.getBarcode());
                idList.add(sportResultDTO.getStudent_id());
            }
            sportResultDTO.setCreator_id(user.getUser_id());
        }
        //判断修改的条形码是否有重复
        if (CollectionUtils.isNotEmpty(barcodeList)){
            if (!sportService.checkBarCode(barcodeList, idList)){
                return new RespObj(false, null, "修改的条形码不能重复");
            }
        }
        boolean saveResult = false;
        boolean updateResult = false;
        if (CollectionUtils.isNotEmpty(insertList)){
            saveResult = true;//sportService.realTimeSave(sportResultDTOList);
        }
        if (CollectionUtils.isNotEmpty(updateList)){
            updateResult = true;//sportService.realTimeUpdate(sportResultDTOList, missColumnDTO);
        }
        /*boolean misColResult = sportService.saveOrupdateMisCol(missColumnDTO);
        if (!misColResult){
            return new RespObj(false, null, "录入测试数据的相关数据列全部缺失信息保存失败");
        }*/
        
        /***将数据都发送到消息队列 start***/
        Map<String, Object> datas = new HashMap<String, Object>();
        datas.put("schoolRecorder", JSONObject.toJSONString(schoolRecorder));
        datas.put("sportResultDTOList", JSONObject.toJSONString(sportResultDTOList));
        datas.put("missColumnDTO", JSONObject.toJSONString(missColumnDTO));
        datas.put("hasSave", saveResult);
        datas.put("hasUpdate", updateResult);
        sportDataHandlerService.sendSportData(datas);
        /***将数据都发送到消息队列 end***/
        
        if (CollectionUtils.isNotEmpty(insertList) && CollectionUtils.isNotEmpty(updateList)){
            if (saveResult && updateResult){
                return new RespObj(true, null, "保存成功");
            }
        }
        if (CollectionUtils.isNotEmpty(insertList) && CollectionUtils.isEmpty(updateList)){
            if (saveResult){
                return new RespObj(true, null, "保存成功");
            }
        }
        if (CollectionUtils.isEmpty(insertList) && CollectionUtils.isNotEmpty(updateList)){
            if (updateResult){
                return new RespObj(true, null, "保存成功");
            }
        }
        return new RespObj(false, null, "保存失败");
    }
}
