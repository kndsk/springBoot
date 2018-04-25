package com.ly.edu;

import javax.servlet.MultipartConfigElement;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.web.MultipartAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.boot.context.embedded.MultipartConfigFactory;
import org.springframework.boot.context.web.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.web.multipart.support.MultipartFilter;
import org.jsondoc.spring.boot.starter.EnableJSONDoc;

@Configuration
@EnableRedisHttpSession
@EnableAutoConfiguration(exclude = {MultipartAutoConfiguration.class})
@ComponentScan
@EnableJSONDoc
@ImportResource({"classpath:sqlMapConfig.xml"})
public class Application extends SpringBootServletInitializer {
  @Value("${multipart.maxRequestSize}")
  private String maxPostSize;

  public static void main(final String[] args) {
    SpringApplication.run(Application.class, args);
  }
  
  @Override
  protected final SpringApplicationBuilder configure(
      final SpringApplicationBuilder application) {
    return application.sources(Application.class);
  }
  
  @Bean
  public MultipartConfigElement multipartConfigElement() {
    MultipartConfigFactory factory = new MultipartConfigFactory();
    factory.setMaxFileSize(maxPostSize);
    factory.setMaxRequestSize(maxPostSize);
    return factory.createMultipartConfig();
  }
  
  @Bean
  public String maxPostSize() {
    return maxPostSize;
  }
  
  @Bean
  public FilterRegistrationBean multipartFilterRegistrationBean() {
    final MultipartFilter multipartFilter = new MultipartFilter();
    final FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean(
        multipartFilter);
    filterRegistrationBean.addInitParameter("multipartResolverBeanName",
        "commonsMultipartResolver");
    return filterRegistrationBean;
  }
}
