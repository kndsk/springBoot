package com.ly.edu.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.ly.edu.service.FileUploadService;
import com.ly.edu.util.KeyHolder;
import com.ly.edu.util.StringUtils;

/**
 * @author gangwu3
 *
 */
@Controller
@RequestMapping(value="uploadImg")
public class CkeditorUploadController {
  @Autowired
  private String workLocation;
  
  @Autowired
  private FileUploadService fileUploadService;
  
  @ResponseBody
  @RequestMapping
  public void uploadImg(HttpServletRequest request, HttpServletResponse response) {
    response.setContentType("text/html;charset=UTF-8");
    MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
    // 获得文件：
    MultipartFile file = multipartRequest.getFile("upload");
    PrintWriter out = null;
    String srcPath = "";
    String pngPath = "";
    try {
      out = response.getWriter();
      String fileRealName = StringUtils.isEmpty(file.getOriginalFilename()) ? KeyHolder.getKey() + ".unkown"
          : file.getOriginalFilename();
      String fileEnd = fileRealName.substring(fileRealName.lastIndexOf(".") + 1).toLowerCase();
      String fileId = KeyHolder.getKey();
      InputStream imageInputStream = null;
      if (fileEnd.contains("wmz") || fileEnd.contains("emz")) {
        String h = request.getParameter("h").replaceAll("[A-Za-z]", "");
        h = !h.matches("[0-9\\.]*") ? "0" : h;
        String w = request.getParameter("w").replaceAll("[A-Za-z]", "");
        w = !w.matches("[0-9\\.]*") ? "0" : w;
        String tmpPath = System.getProperty("java.io.tmpdir");
        fileEnd = fileEnd.equals("wmz") ? "wmf" : "emf";
        srcPath = tmpPath + fileId + fileEnd;
        pngPath = tmpPath + fileId + ".png";
        //FileUtils.unZip(srcPath, pngPath);
        /*FileUtils.wmzAndEmz2Img(file.getInputStream(), srcPath, pngPath, imageMagickPath,
            (int) (Float.parseFloat(h)), (int) (Float.parseFloat(w)));*/
        File imageFile = new File(pngPath);
        imageInputStream = new FileInputStream(imageFile);
      } else {
        imageInputStream = file.getInputStream();
      }
      String fileName = fileId + "." + fileEnd;
      if (10 * 1024 * 1024 < imageInputStream.available()) {
        out.println("文件超过最大值10M！");
      } else {
        String bpath = workLocation + "/ckfiles";
        String id = fileUploadService.upload(bpath, fileName, imageInputStream);
        String curl = bpath + '/' + id + '/' + fileName;
        String path = "/uploadImg/getpic?path="+curl;
        String url = request.getContextPath()+path;

        // 验证url的有效性
        if (!authImgUrl(curl)) {
          out.println("图片上传失败，请重新上传");
        } else {
          // 将上传的图片的url返回给ckeditor
          String callback = request.getParameter("CKEditorFuncNum");
          out.println("<script type=\"text/javascript\" language=\"javascript\">");
          out.println("window.parent.CKEDITOR.tools.callFunction(" + callback + ",'" + url.replace(workLocation, "") + "',''" + ")");
          out.println("</script>");
        }
      }
    } catch (Exception e) {
      out.println("文件上传失败<div style='display:none'>");
      e.printStackTrace(out);
      out.println("</div>");
    } finally {
      if (out != null) {
        out.flush();
        out.close();
      }
      // 清除临时文件
      if (srcPath.isEmpty()) {
        File srcFile = new File(srcPath);
        srcFile.delete();
      }
      if (pngPath.isEmpty()) {
        File pngFile = new File(pngPath);
        pngFile.delete();
      }
    }
  }
  
  @RequestMapping(value="getpic")
  public void getPic(HttpServletRequest request, HttpServletResponse response){
    response.setContentType("text/html; charset=UTF-8");
    response.setContentType("image/jpeg");    //设置图片格式格式，这里可以忽略
    String path = request.getParameter("path");
    FileInputStream fis = null;;
    OutputStream os = null;
    try {
      fis = new FileInputStream(workLocation+path);
      os = response.getOutputStream();
      int count = 0;
      byte[] buffer = new byte[1024*1024];
      while ( (count = fis.read(buffer)) != -1 ){
        os.write(buffer, 0, count);
      }
    } catch (IOException e){  
       e.printStackTrace();  
     }finally {
       try {
         if(os!=null){
           os.close();
         }
         if(fis != null){
           fis.close();
         }
      } catch (IOException e) {
        e.printStackTrace();
      }
     }
  }

  private boolean authImgUrl(String url){
    File f = new File(url);
    return f.exists();
    
  }

}
