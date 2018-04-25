package com.ly.edu.activemq;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import com.ly.edu.common.QueueConstant;
import com.ly.edu.service.SportDataHandlerService;

/**
 * 
 * @author pengyq
 * @date   2018年4月4日
 * @email  yqpeng2@iflytek.com
 * @description activemq消费者，处理队列发送过来的消息
 */
@Component
public class ActiveMQConsumer {
	
	@Autowired
    private SportDataHandlerService sportDataHandlerService;
	
	/**
	 * 将考场保存数据持久化到数据库
	 * @param data
	 */
	@JmsListener(destination = QueueConstant.SPORT_SAVE_QUEUE)
    public void saveSportData(String data) {
		sportDataHandlerService.saveSportData2DB(data);
    }

}
