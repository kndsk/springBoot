
package com.ly.edu.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Paths;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ly.edu.service.StaticFileSvc;

@Service("staticFileSvc")
public class StaticFileSvcImpl implements StaticFileSvc
{
	
	@Autowired
	private String	workLocation;
	
	private Logger	log	= Logger.getLogger(getClass());
	
	/**
	 * 为下载文件进行文件传输
	 * 
	 * @param response
	 *            文件下载的响应流
	 * @param fileName
	 *            文件名称
	 * @param relativeFilePath
	 *            文件的相对路径
	 */
	public void outputFile4Download(HttpServletResponse response, String fileName, String relativeFilePath) throws IOException
	{
		InputStream is = null;
		OutputStream os = null;
		File fileRealPath = null;
		if (relativeFilePath != "")
		{
			fileRealPath = Paths.get(workLocation, relativeFilePath).toFile();
		}
		else
		{
			fileRealPath = Paths.get(workLocation, fileName).toFile();
		}
		if (fileRealPath == null || fileRealPath.exists() == false)
		{
			throw new FileNotFoundException("需要进行下载的文件" + fileRealPath + "不存在");
		}
		try
		{
			is = new FileInputStream(fileRealPath);
			os = response.getOutputStream();
			byte[] bytes = new byte[2048];
			int len = 0;
			
			while ((len = is.read(bytes)) != -1)
			{
				os.write(bytes, 0, len);
			}
			is.close();
			os.close();
		}
		catch (IOException e)
		{
			log.error("系统读取文件[" + fileRealPath + "]出现异常", e);
			try
			{
				is.close();
				os.close();
			}
			catch (IOException e1)
			{
				throw e1;
			}
		}
		finally
		{
			is.close();
			os.close();
		}
		/*
		 * if (fileRealPath != null) return fileRealPath.toString(); else return
		 * "";
		 */
	}
}
