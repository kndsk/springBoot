package com.ly.edu.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.apache.pdfbox.exceptions.COSVisitorException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.util.Assert;

import com.ly.edu.common.PageTypeEnum;

/**
 * 执行html转换成pdf类
 * 
 * @author lingyang
 *
 */
public final class ConvertHtmlToPdf {
  
  /**
   * 每次读写文件大小
   */
  private static final int BYTESIZE = 1024;
  
  private static Logger log = Logger.getLogger(ConvertHtmlToPdf.class);
  
  /**
   * html转换成pdf
   * 
   * @param htmlPath
   *          html路径
   * @param pageType
   *          纸张类型
   * @param os
   *          输出流
   */
  
  public static void convert(String htmlPath, PageTypeEnum pageType,
      OutputStream os, String jsessionId, String workLocation) {    
    String pdfPath = workLocation + File.separator + KeyHolder.getKey()
        + ".pdf";
    File pdf = new File(pdfPath);
    processHtmlToPdf(pdf.getAbsolutePath(), htmlPath, pageType, jsessionId);
    generatePdf(pdfPath);
    FileInputStream fis = null;
    try {
      fis = new FileInputStream(new File(pdfPath));
      byte[] buffer = new byte[BYTESIZE];
      int size = 0;
      while ((size = fis.read(buffer)) != -1) {
        os.write(buffer, 0, size);
      }
    } catch (FileNotFoundException e) {
      log.error(e.getMessage());
    } catch (IOException e) {
      log.error(e.getMessage());
    } finally {
      try {
        fis.close();
        os.close();
      } catch (IOException e) {
        log.error(e.getMessage());
      }
      File file = new File(pdfPath);
      if (file.exists()) {
        file.delete();
      }
    }
  }
  
  /**
   * 执行html转成pdf
   * 
   * @param pdfPath
   *          pdf文件名称
   * @param htmlPath
   *          html路径
   * @param pageType
   *          纸张类型
   */
  public static void processHtmlToPdf(String pdfPath, String htmlPath,
      PageTypeEnum pageType, String jsessionId) {
    StringBuffer commandBuffer = new StringBuffer();
    if (System.getProperty("os.name").contains("Windows")) {
      if (System.getProperty("os.arch").equals("x86")) {
        commandBuffer.append("wkhtmltopdf32.exe --page-size  ");
      } else {
        commandBuffer.append("wkhtmltopdf64.exe --page-size  ");
      }
    } else {
      commandBuffer.append("wkhtmltopdf --page-size  ");
    }
    String page = pageType.getName();
    if (page.startsWith("A3")) {
      page = "A3";
    }
    commandBuffer.append(page);
    if ("A3".equals(page)) {
      commandBuffer.append(" --orientation Landscape ");
    }
    
    // 增加延迟
    commandBuffer.append(" --javascript-delay 10000 ");
    commandBuffer.append(" --encoding utf-8 ");
    commandBuffer.append(" --cookie JSESSIONID " + jsessionId + " ");
    commandBuffer.append(htmlPath);
    commandBuffer.append(" ");
    commandBuffer.append(pdfPath);
    log.info(commandBuffer);
    Process process = null;
    try {
      process = Runtime.getRuntime().exec(commandBuffer.toString());
      InputStreamReader inputStreamReader = new InputStreamReader(
          process.getErrorStream());
      BufferedReader br = new BufferedReader(inputStreamReader);
      String line;
      while ((line = br.readLine()) != null) {
        Logger.getLogger(ConvertHtmlToPdf.class).info(line);
      }
      process.waitFor();
    } catch (IOException e) {
      log.error(e.getMessage());
    } catch (InterruptedException e) {
      log.error(e.getMessage());
    } finally {
      if (process != null) {
        process.destroy();
      }
      process = null;
    }
  }
  
  /**
   * 生成pdf
   * 
   * <pre>
   * 将隐藏域里以key - value形式保存信息
   * </pre>
   * 
   * @param pdfPath
   *          pdf路径
   */
  public static void generatePdf(String pdfPath) {
    Assert.notNull(pdfPath, "pdfPath is not null ！");
    try {
      PDDocument pdDocument = PDDocument.load(pdfPath);
      PDDocumentInformation pdfDocumentInfo = pdDocument
          .getDocumentInformation();
      pdfDocumentInfo.setCreator("iflytek");
      pdfDocumentInfo.setAuthor("iflytek");
      pdfDocumentInfo.setProducer("iflytek");
      pdfDocumentInfo.setTitle("综合素质测评-统计分析报告");
      pdDocument.save(pdfPath);
      pdDocument.close();
    } catch (IOException e) {
      log.error(e.getMessage());
    } catch (COSVisitorException e) {
      log.error(e.getMessage());
    }
  }
  
  /**
   * 读取pdf中元数据值
   * 
   * @param key
   *          元数据key
   * @param pdfInputStream
   *          inputStream
   * @return 元数据值
   */
  public static String getPdfMetaDateValue(String key,
      InputStream pdfInputStream) {
    String answersheetId = key;
    String value = "";
    try {
      PDDocument pdDocument = PDDocument.load(pdfInputStream);
      PDDocumentInformation pdfDocumentInfo = pdDocument
          .getDocumentInformation();
      value = pdfDocumentInfo.getCustomMetadataValue(answersheetId);
    } catch (IOException e) {
      log.error(e.getMessage());
    } finally {
      IOUtils.closeQuietly(pdfInputStream);
    }
    return value;
  }
  
}
