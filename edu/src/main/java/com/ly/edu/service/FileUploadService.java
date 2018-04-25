package com.ly.edu.service;

import java.io.InputStream;

/**
 * @author gangwu3
 *
 */
public interface FileUploadService {
  public String upload(String workLocation, String fileName, InputStream imageInputStream);
}
