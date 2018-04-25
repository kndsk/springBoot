package com.ly.edu.service.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;

import com.ly.edu.service.FileUploadService;
import com.ly.edu.util.KeyHolder;

/**
 * @author gangwu3
 *
 */
@Service("fileUploadService")
public class FileUploadServiceImpl implements FileUploadService {
  
  @Override
  public String upload(String bpath, String fileName,
      InputStream imageInputStream) {
    File ff = new File(bpath);
    if(ff.isDirectory() && !ff.exists()){
      ff.mkdirs();
    }
    String id = KeyHolder.getKey();
    String basePath = bpath + File.separator + id;
    File bf = new File(basePath);
    bf.mkdirs();
    String path = basePath + File.separator + fileName; 
    saveFile(path, imageInputStream);
    return id;
  }
  
  private void saveFile(String path, InputStream imageInputStream){
    try {
      File file=new File(path);
      if(!file.exists()) 
        file.createNewFile();
      FileOutputStream out=new FileOutputStream(file);
      int c;
      byte buffer[]=new byte[1024];
      while((c=imageInputStream.read(buffer))!=-1){
          for(int i=0;i<c;i++)
              out.write(buffer[i]);        
      }
      imageInputStream.close();
      out.close();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }
  
}
