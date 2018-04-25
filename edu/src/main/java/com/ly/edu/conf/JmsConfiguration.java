package com.ly.edu.conf;

import javax.jms.Queue;

import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;

import com.ly.edu.common.QueueConstant;

@Configuration
@EnableJms
public class JmsConfiguration {
	
	@Bean(name="sportSaveQueue")
	public Queue queue() {
		return new ActiveMQQueue(QueueConstant.SPORT_SAVE_QUEUE);
	}

}
