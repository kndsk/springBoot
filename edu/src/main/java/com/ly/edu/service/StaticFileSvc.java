
package com.ly.edu.service;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

public interface StaticFileSvc
{
	
	void outputFile4Download(HttpServletResponse response, String fileName, String relativeFilePath) throws IOException;
	
}
