package com.ly.edu.controller;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.ly.edu.util.DateUtils;

/**
 * Created by luzhen on 2015/3/9.
 */
public class BaseController {

    /*
     * 获取request的参数以及对应的数据
     */
    protected Map<String, Object> getParameters(HttpServletRequest request) throws Exception {

        // 参数名和对应的数据
        Map<String, Object> dataMap = new HashMap<String, Object>();

        DiskFileItemFactory diskFactory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(diskFactory);

        // 获取FORM的ENCTYPE="multipart/form-data" 的参数和数据
        List fileItems = upload.parseRequest(request);

        Iterator iterator = fileItems.iterator();
        while (iterator.hasNext()) {
            FileItem item = (FileItem) iterator.next();
            if (item.isFormField()) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(item.getInputStream()));
                String fieldValue = reader.readLine();
                reader.close();

                dataMap.put(item.getFieldName(), fieldValue);
            } else {

                InputStream inputStream = item.getInputStream();
                byte[] dataBytes = this.toByteArray(inputStream);
                dataMap.put("fileBytes", dataBytes);// 获取文件字节数组
            }
        }

        return dataMap;
    }

    /*
     * 获取字节数组
     */
    protected byte[] toByteArray(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        copy(input, output);
        return output.toByteArray();
    }

    private int copy(InputStream input, OutputStream output) throws IOException {
        long count = copyLarge(input, output);
        if (count > 2147483647L) {
            return -1;
        }
        return (int) count;
    }

    private long copyLarge(InputStream input, OutputStream output) throws IOException {
        byte[] buffer = new byte[4096];
        long count = 0L;
        int n = 0;
        while (-1 != (n = input.read(buffer))) {
            output.write(buffer, 0, n);
            count += n;
        }
        return count;
    }
    

    /**
     * checkTime
     * @Description:        检查当前服务器事件是否在提交时间内
     * @param school_code   
     * @return
     */
    public boolean checkTime(HttpServletRequest request, String province_code) {
        String startTime = (String) request.getSession().getAttribute("startTime");
        String endTime = (String) request.getSession().getAttribute("endTime");
        String specStartTime = (String) request.getSession().getAttribute("specStartTime");
        String specEndTime = (String) request.getSession().getAttribute("specEndTime");
        String specProvinceCode = (String) request.getSession().getAttribute("specProvinceCode");
        
        Date startTimeD = DateUtils.parse(startTime);
        Date endTimeD = DateUtils.parse(endTime);
        Date specStartTimeD = DateUtils.parse(specStartTime);
        Date specEndTimeD = DateUtils.parse(specEndTime);
        Date nowTime = new Date();
        
        //如果采用特殊时区字段
        if (specProvinceCode.indexOf(province_code) >= 0) {
            if (nowTime.before(specStartTimeD) || nowTime.after(specEndTimeD)) {
                return false;
            }
        } else {
            if (nowTime.before(startTimeD) || nowTime.after(endTimeD)) {
                return false;
            }
        }
        
        return true;
    }
}
