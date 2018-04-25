package com.ly.edu.activemq;

import javax.jms.Destination;
import javax.jms.Queue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * 
 * @author pengyq
 * @date   2018年4月4日
 * @email  yqpeng2@iflytek.com
 * @description	activemq消息队列生产者，主要是将msg发送到broker里面
 */
@Component
public class ActiveMQProducer {
	
	@Autowired
	private JmsMessagingTemplate jmsMessagingTemplate;
	
	@Autowired
	private Queue sportSaveQueue;
	
	/**
	 * 提供统一发送消息接口
	 * @param destination	具体的queue
	 * @param data	发送的数据
	 */
	public void send(Destination destination, String data) {
        this.jmsMessagingTemplate.convertAndSend(destination, data);
    }
	
	/**
	 * 考场数据保存事件发送消息接口
	 * @param data
	 */
	public void sendSportSaveQueue(String data) {
		send(sportSaveQueue, data);
    }
	
}
