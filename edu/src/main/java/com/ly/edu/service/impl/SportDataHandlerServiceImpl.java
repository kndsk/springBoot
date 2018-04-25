package com.ly.edu.service.impl;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ly.edu.activemq.ActiveMQProducer;
import com.ly.edu.domain.SchoolRecorder;
import com.ly.edu.dto.MissColumnDTO;
import com.ly.edu.dto.SportResultDTO;
import com.ly.edu.service.SportDataHandlerService;
import com.ly.edu.service.SportService;

@Service
public class SportDataHandlerServiceImpl implements SportDataHandlerService {
	
	@Autowired
    private SportService sportService;
	
	@Autowired
	private ActiveMQProducer activeMQProducer;

	@SuppressWarnings("unchecked")
	@Override
	public void saveSportData2DB(String jsonDatas) {
		
		Map<String, Object> datas = null;
		
		if(StringUtils.isNoneBlank(jsonDatas)) {
			datas = JSONObject.parseObject(jsonDatas, Map.class);
		}
		
		if(!CollectionUtils.isEmpty(datas)) {
			
			String schoolRecorderStr = (String) datas.get("schoolRecorder");//录入员信息
			String sportResultDTOListStr = (String) datas.get("sportResultDTOList");
			String missColumnDTOStr = (String) datas.get("missColumnDTO");
			Boolean hasSaveStr = (Boolean) datas.get("hasSave");
			Boolean hasUpdateStr = (Boolean) datas.get("hasUpdate");
			
			SchoolRecorder schoolRecorder = null;
			if(StringUtils.isNoneBlank(schoolRecorderStr)) {
				schoolRecorder = JSONObject.parseObject(schoolRecorderStr, SchoolRecorder.class);
				if(schoolRecorder != null) {
					sportService.saveOrUpdateRecordInfo(schoolRecorder);
				}
			}
			
			List<SportResultDTO> sportResultDTOList = null;
			if(StringUtils.isNoneBlank(sportResultDTOListStr)) {
				sportResultDTOList = JSONArray.parseArray(sportResultDTOListStr, SportResultDTO.class);
			}
			
			MissColumnDTO missColumnDTO = null;
			if(StringUtils.isNoneBlank(missColumnDTOStr)) {
				missColumnDTO = JSONObject.parseObject(missColumnDTOStr, MissColumnDTO.class);
			}
			
			if(hasSaveStr) {
				sportService.realTimeSave(sportResultDTOList);
			}
			
			if(hasUpdateStr && missColumnDTO != null) {
				sportService.realTimeUpdate(sportResultDTOList, missColumnDTO);
			}
			
			if(missColumnDTO != null) {
				sportService.saveOrupdateMisCol(missColumnDTO);
			}
			
		}

	}

	@Override
	public void sendSportData(Map<String, Object> datas) {
		
		activeMQProducer.sendSportSaveQueue(JSONObject.toJSONString(datas));
	}

}
