package com.ly.edu.service;

import java.util.Map;

/**
 * 
 * @author pengyq
 * @date   2018年4月4日
 * @email  yqpeng2@iflytek.com
 * @description	数据处理接口
 */
public interface SportDataHandlerService {
	
	/**
	 * 前端保存事件提交的考场数据进行保存
	 * @param jsonDatas	需要保存数据，Map对象的json格式
	 */
	void saveSportData2DB(String jsonDatas);
	
	/**
	 * 发送到消息队列的数据
	 * @param datas
	 */
	void sendSportData(Map<String, Object> datas);

}
