package com.ly.edu.util;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.ly.edu.common.Constant;

public class ReadExcel<T> {
  private Class<T> clazz;
  private Logger log = Logger.getLogger(ReadExcel.class);
  
  public ReadExcel(Class<T> clazz) {
    this.clazz = clazz;
  }
  
  public List<T> readExcel(String postfix, InputStream is) throws IOException {
    if (is == null) {
      return null;
    } else {
      if (!Constant.EMPTY.equals(postfix)) {
        if (Constant.OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
          return readXls(is);
        } else if (Constant.OFFICE_EXCEL_2007_POSTFIX.equals(postfix)) {
          return readXlsx(is);
        } else {
          log.error("upload file type is error");
          return null;
        }
      } else {
        log.error("upload file type is error");
        return null;
      }
    }
  }
  
  public List<T> readXlsx(InputStream is) throws IOException {
    log.info("begin deal excel data");
    XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
    
    T t = null;
    List<T> list = new ArrayList<T>();
    for (int numSheet = 0; numSheet < xssfWorkbook.getNumberOfSheets(); numSheet++) {
      XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(numSheet);
      if (xssfSheet == null || xssfSheet.getLastRowNum() < 3) {
        continue;
      }
      XSSFRow attributeRow = xssfSheet.getRow(2);
      int attributeCounts = attributeRow.getLastCellNum();
      String[] attributes = new String[attributeCounts];
      for (int i = 0; i < attributeCounts; i++) {
        attributes[i] = getValue(attributeRow.getCell(i));
      }
      List<String> allField = new ArrayList<String>();
      Field[] fields = clazz.getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        String str = fields[i].getName();
        str = str.replaceFirst(str.substring(0, 1), str.substring(0, 1)
            .toUpperCase());
        allField.add(str);
      }
      for (int rowNum = 3; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
        XSSFRow xssfRow = xssfSheet.getRow(rowNum);
        if (isBlankRow(xssfRow, attributeCounts)) {
          continue;
        }
        if (xssfRow != null) {
          try {
            t = (T) clazz.newInstance();
            for (int i = 0; i < attributeCounts; i++) {
              if (allField.contains(attributes[i])) {
                clazz.getMethod("set" + attributes[i], String.class).invoke(t,
                    getValue(xssfRow.getCell(i)));
              }
            }
          } catch (Exception e) {
            e.printStackTrace();
          }
          list.add(t);
        }
      }
    }
    is.close();
    return list;
  }
  
  public List<T> readXls(InputStream is) throws IOException {
    log.info("begin deal excel data");
    HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);
    
    T t = null;
    List<T> list = new ArrayList<T>();
    for (int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++) {
      HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);
      if (hssfSheet == null || hssfSheet.getLastRowNum() < 3) {
        continue;
      }
      HSSFRow attributeRow = hssfSheet.getRow(2);
      int attributeCounts = attributeRow.getLastCellNum();
      String[] attributes = new String[attributeCounts];
      for (int i = 0; i < attributeCounts; i++) {
        attributes[i] = getValue(attributeRow.getCell(i));
      }
      List<String> allField = new ArrayList<String>();
      Field[] fields = clazz.getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        String str = fields[i].getName();
        str = str.replaceFirst(str.substring(0, 1), str.substring(0, 1)
            .toUpperCase());
        allField.add(str);
      }
      for (int rowNum = 3; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
        HSSFRow hssfRow = hssfSheet.getRow(rowNum);
        if (isBlankRow(hssfRow, attributeCounts)) {
          continue;
        }
        if (hssfRow != null) {
          try {
            t = (T) clazz.newInstance();
            for (int i = 0; i < attributeCounts; i++) {
              if (allField.contains(attributes[i])) {
                clazz.getMethod("set" + attributes[i], String.class).invoke(t,
                    getValue(hssfRow.getCell(i)));
              }
            }
          } catch (Exception e) {
            e.printStackTrace();
          }
          list.add(t);
        }
      }
    }
    is.close();
    return list;
  }
  
  private String getValue(XSSFCell xssfCell) {
    if (xssfCell == null) {
      return "";
    } else if (xssfCell.getCellType() == XSSFCell.CELL_TYPE_BOOLEAN) {
      return String.valueOf(xssfCell.getBooleanCellValue());
    } else if (xssfCell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC) {
      xssfCell.setCellType(Cell.CELL_TYPE_STRING);
      return String.valueOf(xssfCell.getStringCellValue());
    } else if (xssfCell.getCellType() == XSSFCell.CELL_TYPE_BLANK) {
      return "";
    } else {
      return String.valueOf(xssfCell.getStringCellValue());
    }
  }
  
  private String getValue(HSSFCell hssfCell) {
    if (hssfCell == null) {
      return "";
    } else if (hssfCell.getCellType() == HSSFCell.CELL_TYPE_BOOLEAN) {
      return String.valueOf(hssfCell.getBooleanCellValue());
    } else if (hssfCell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC) {
      hssfCell.setCellType(Cell.CELL_TYPE_STRING);
      return String.valueOf(hssfCell.getStringCellValue());
    } else if (hssfCell.getCellType() == HSSFCell.CELL_TYPE_BLANK) {
      return "";
    } else {
      return String.valueOf(hssfCell.getStringCellValue());
    }
  }
  
  private boolean isBlankRow(XSSFRow row, int num) {
    for (int i = 0; i < num; i++) {
      if (row.getCell(i) != null && !getValue(row.getCell(i)).equals("")) {
        return false;
      }
    }
    return true;
  }
  
  private boolean isBlankRow(HSSFRow row, int num) {
    for (int i = 0; i < num; i++) {
      if (row.getCell(i) != null && !getValue(row.getCell(i)).equals("")) {
        return false;
      }
    }
    return true;
  }
}
