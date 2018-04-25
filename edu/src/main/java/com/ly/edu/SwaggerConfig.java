package com.ly.edu;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
@ComponentScan(basePackages = "com.ly.edu.controller")
public class SwaggerConfig {
	/**
	 * Every Docket bean is picked up by the swagger-mvc framework - allowing
	 * for multiple swagger groups i.e. same code base multiple swagger resource
	 * listings.
	 */

	@Bean
	public Docket createRestApi() {
		return new Docket(DocumentationType.SWAGGER_2)
				.apiInfo(apiInfo())
				.groupName("rest")
				.select()
				.apis(RequestHandlerSelectors.basePackage("com.ly.edu.controller"))
				.paths(PathSelectors.any())
				.build();
	}

	private ApiInfo apiInfo() {
		ApiInfo apiInfo = new ApiInfoBuilder()
				.title("问卷系统管理端API接口文档")
				.description("问卷系统管理端rest服务接口")
				.license("iflytek")
				.licenseUrl("http://wj.eachina.changyang.cn/admin")
				.contact(new Contact("hanyong", "wj.eachina.changyang.cn", "yonghan2@iflytek.com"))
				.version("1.0")
				.build();

		return apiInfo;
	}

}
