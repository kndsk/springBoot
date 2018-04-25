package com.ly.edu.conf;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class StaticResourceConfiguration extends WebMvcConfigurerAdapter {
  
  @Value("${work.location}")
  private String workLocation;
  
  private static final String[] RESOURCE_LOCATIONS = {"/resources/",
      "classpath:/META-INF/resources/", "classpath:/resources/",
      "classpath:/static/", "classpath:/public/"};
  
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    if (!registry.hasMappingForPattern("/resources/**")) {
      registry.addResourceHandler("/resources/**").addResourceLocations(
          RESOURCE_LOCATIONS);
    }
    registry.addResourceHandler("/template/**").addResourceLocations(
        "file:/" + workLocation + "/");
  }
  
  @Bean
  public String workLocation() {
    return workLocation;
  }
}
