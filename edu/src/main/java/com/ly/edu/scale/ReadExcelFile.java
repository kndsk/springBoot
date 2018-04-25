package com.ly.edu.scale;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFClientAnchor;
import org.apache.poi.hssf.usermodel.HSSFPicture;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFShape;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFPicture;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFShape;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.ly.edu.common.Constant;
import com.ly.edu.common.QuestionTypeEnum;
import com.ly.edu.scale.model.ChoiceInfo;
import com.ly.edu.scale.model.ExcelPicture;
import com.ly.edu.scale.model.QuestionInfo;
import com.ly.edu.util.Byte2Base64;

/**
 * @author gangwu3
 *
 */
public class ReadExcelFile {
  private Logger log = Logger.getLogger(ReadExcelFile.class);
  
  //保存生成的问题列表
  private List<QuestionInfo> questionList = new ArrayList<QuestionInfo>();
   
  //保存需要返回的错误点
  private List<String> errorList = new ArrayList<String>();
     
  //保存需要返回的注意点
  private List<String> tipList = new ArrayList<String>();
   
  //保存有跳转题的序号
  private List<String> quesNumHaveJumpList = new ArrayList<String>();
   
  //保存所有题目的序号
  private List<String> qnumList = new ArrayList<String>();
   
  //保存所有题目的屏幕序号
  private List<Integer> screenNumList = new ArrayList<Integer>();
   
  //校验是否有人改了表头
  private List<String> trueTableHeadList = new ArrayList<String>();
  
  //所有问题的tab序号集合
  private List<String> allQNumList = new ArrayList<String>();
  //所有问题的屏幕号集合
  private List<String> allScreenNumList = new ArrayList<String>();
   
  //前两行无数据
  private int noDataRowNum = 2;
  

public void readExcel(String fileName, InputStream is) {
    if (fileName.endsWith(Constant.OFFICE_EXCEL_2003_POSTFIX)) {
      readExcel03(is);
    } else if (fileName.endsWith(Constant.OFFICE_EXCEL_2007_POSTFIX)) {
      readExcel07(is);
    }
  }
  
  private void readExcel03(InputStream is) {
    HSSFWorkbook hssfWorkbook = null;
    try {
      hssfWorkbook = new HSSFWorkbook(is);
    } catch (IOException e) {
      log.error(e.getMessage());
      return;
    }
    // 模板默认只会有一个sheet
    HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(0);
  
    // 第一行被用做备注了，真正的表格信息从第2行开始
    HSSFRow attributeRow = hssfSheet.getRow(noDataRowNum-1);
    // 获取表头
    int attributeCounts = attributeRow.getLastCellNum();
    String[] attributes = new String[attributeCounts];
    for (int i = 0; i < attributeCounts; i++) {
      attributes[i] = getCellValue(attributeRow.getCell(i));
      // 判断表头是否有误
      if (!Constant.COLUMN_TO_FIELD.containsKey(attributes[i])) {
        String msg = "表头信息不可改动，请检查您的表头栏:" + attributes[i];
        errorList.add(msg);
      } else {
        trueTableHeadList.add(attributes[i]);
      }
    }
    List<ExcelPicture> excelPictureList = getALlPicturesFromExcel03(hssfWorkbook);
    Collections.sort(excelPictureList, new Comparator<ExcelPicture>() {
      public int compare(ExcelPicture arg0, ExcelPicture arg1) {
        if (arg0.getRow() * Constant.TEN_THOUSAND + arg0.getColumn() > arg1
            .getRow() * Constant.TEN_THOUSAND + arg1.getColumn()) {
          return 1;
        } else if (arg0.getRow() * Constant.TEN_THOUSAND + arg0.getColumn() < arg1
            .getRow() * Constant.TEN_THOUSAND + arg1.getColumn()) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    // 逐行获取数据  
    for (int rowNum = noDataRowNum; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
      HSSFRow hssfRow = hssfSheet.getRow(rowNum);
      if (hssfRow != null && hssfRow.getPhysicalNumberOfCells() <= 0) {
        continue;
      }
      if (hssfRow != null) {
        QuestionInfo info = new QuestionInfo();
        for (int i = 0; i < attributeCounts; i++) {
          HSSFCell cell = hssfRow.getCell(i);
          String k = attributes[i];
          String kValue = Constant.COLUMN_TO_FIELD.get(k);
          String cellValue = getCellValue(cell).replace("\n", "")
              .replace("，", ",").replace("（", "(").replace("）", ")").trim();
          checkQuestion(k, cellValue, rowNum, info);
          // 将cell的值赋予info对应属性
          setValue2QuestionInfo(info, kValue, cellValue, excelPictureList,
              rowNum);
        }
        questionList.add(info);
      }
    }
    try {
      if (is != null) {
        is.close();
      }
    } catch (IOException e) {
      log.error(e.getMessage());
    }
    // 校验图片是否与image标数目对应
    if (!excelPictureList.isEmpty()) {
      String str = "";
      for (ExcelPicture ep : excelPictureList) {
        int row = ep.getRow() + 1;
        int colum = ep.getColumn() + 1;
        str += "(" + row + "," + colum + "),";
      }
      str = str.substring(0, str.length() - 1);
      errorList.add(str + "等位置的图片没有image标签与之对应");
    }
    
    checkQuestionNum();
    checkExcel(attributes);
  }
  
  private void readExcel07(InputStream is) {
    XSSFWorkbook xssfWorkbook = null;
    try {
      xssfWorkbook = new XSSFWorkbook(is);
    } catch (IOException e) {
      log.error(e.getMessage());
    }
    // 模板默认只会有一个sheet
    XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(0);
 
    // 第一行被用做备注了，真正的表格信息从第2行开始
    XSSFRow attributeRow = xssfSheet.getRow(noDataRowNum-1);
    // 获取表头
    int attributeCounts = attributeRow.getLastCellNum();
    String[] attributes = new String[attributeCounts];
    for (int i = 0; i < attributeCounts; i++) {
      attributes[i] = getCellValue(attributeRow.getCell(i));
      // 判断表头是否有误
      if (!Constant.COLUMN_TO_FIELD.containsKey(attributes[i])) {
        String msg = "表头信息不可改动，请检查您的表头栏:" + attributes[i];
        errorList.add(msg);
      } else {
        trueTableHeadList.add(attributes[i]);
      }
    }
    
    List<ExcelPicture> excelPictureList = getALlPicturesFromExcel07(xssfWorkbook);
    Collections.sort(excelPictureList, new Comparator<ExcelPicture>() {
      public int compare(ExcelPicture arg0, ExcelPicture arg1) {
        if (arg0.getRow() * Constant.TEN_THOUSAND + arg0.getColumn() > arg1
            .getRow() * Constant.TEN_THOUSAND + arg1.getColumn()) {
          return 1;
        } else if (arg0.getRow() * Constant.TEN_THOUSAND + arg0.getColumn() < arg1
            .getRow() * Constant.TEN_THOUSAND + arg1.getColumn()) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    // 逐行获取数据
    for (int rowNum = noDataRowNum; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
      XSSFRow xssfRow = xssfSheet.getRow(rowNum);
      if (xssfRow != null && xssfRow.getPhysicalNumberOfCells() <= 0) {
        continue;
      }
      if (xssfRow != null) {
        QuestionInfo info = new QuestionInfo();
        for (int i = 0; i < attributeCounts; i++) {
          XSSFCell cell = xssfRow.getCell(i);
          String k = attributes[i].replaceAll("\n", "").replaceAll(" ", "")
              .trim();
          String kValue = Constant.COLUMN_TO_FIELD.get(k);
          String cellValue = getCellValue(cell).replace("\n", "")
              .replace("，", ",").replace("（", "(").replace("）", ")").trim();
          checkQuestion(k, cellValue, rowNum, info);
          // 将cell的值赋予info对应属性
          setValue2QuestionInfo(info, kValue, cellValue, excelPictureList,
              rowNum);
        }
        
        questionList.add(info);
      }
    }
    try {
      if (is != null) {
        is.close();
      }
    } catch (IOException e) {
      log.error(e.getMessage());
    }
    // 校验图片是否与image标数目对应
    if (!excelPictureList.isEmpty()) {
      String str = "";
      for (ExcelPicture ep : excelPictureList) {
        int row = ep.getRow() + 1;
        int colum = ep.getColumn() + 1;
        str += "(" + row + "," + colum + "),";
      }
      str = str.substring(0, str.length() - 1);
      errorList.add(str + "等位置的图片没有image标签与之对应");
    }
    checkQuestionNum();
    checkExcel(attributes);
    log.info("error:" + errorList);
    log.info("tip:" + tipList);
    
  }
  
  private String getCellValue(XSSFCell xssfCell) {
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
  
  private String getCellValue(HSSFCell hssfCell) {
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
  
  // 这个主要是在读取是校验
  private void checkQuestion(String k, String cellValue, int rowNum,
      QuestionInfo info) {
    log.info("checkQuestion   just for some questionType ! rowNum is " + rowNum);
    if (k.equals("题型*")) {
      if (!Constant.COLUMN_TO_FIELD.containsKey(cellValue)
          || cellValue.equals("")) {
        String msg = "第" + (rowNum + 1) + "行，题型请在excel的下拉框中直接选择";
        errorList.add(msg);
      } else {
        if (info.getTitle() != null) {
          if (cellValue.equals("排序题")) {
            String title = info.getTitle();
            String newTitle = title.replace(" ", "");
            boolean tipFlag = false;
            if (regexFind(newTitle, "\\(\\d+\\)[^\\.]")) {
              tipFlag = true;
            }
            if (tipFlag == true) {
              String msg = "第" + (rowNum + 1) + "行，排序题中小题的序号要按照“（序号）.”的格式来编辑";
              tipList.add(msg);
            }
          }
          if (cellValue.equals("填空题")) {
            String title = info.getTitle();
            if (!title.contains(Constant.FILL_IN_BLANK_PLACEHOLDER)) {
              String msg = "第" + (rowNum + 1) + "行，此题为填空题，未填写代表作答区域的符号'#'";
              errorList.add(msg);
            }
          }
          if (cellValue.equals("简答题")) {
            String title = info.getTitle();
            if (!title.contains(Constant.ESSAY_QUESTION_PLACEHOLDER)) {
              String msg = "第" + (rowNum + 1) + "行，此题为简答题，未填写代表作答区域的符号'$%'";
              errorList.add(msg);
            }
          }
          if (cellValue.equals("排序题")) {
            String title = info.getTitle();
            if (!title.contains(Constant.SORT_QUESTION_PLACEHOLDER)) {
              String msg = "第" + (rowNum + 1) + "行，此题为排序题未填写代表作答区域的符号'^&'";
              errorList.add(msg);
            } else {
              String newTitle = title.replace(" ", "");
              int qNum = matchFindNum(newTitle, "\\(\\d+\\)\\.");
              int index = 0;
              int count = 0;
              while (true) {
                index = title.indexOf(Constant.SORT_QUESTION_PLACEHOLDER, index);
                if (index > 0) {
                  count++;
                  index++;
                } else {
                  break;
                }
              }
              if (count > qNum) {
                String msg = "第" + (rowNum + 1) + "行，排序题中填空多于选择项，可能是漏写了.";
                errorList.add(msg);
              }
            }
          }
        }
      }
    }
    if (k.equals("题目属性*")) {
      if (!Constant.COLUMN_TO_FIELD.containsKey(cellValue)
          || cellValue.equals("")) {
        String msg = "第" + (rowNum + 1) + "行，题目属性请在excel的下拉框中直接选择";
        errorList.add(msg);
      }
    }
    if (k.equals("题目内容*")) {
      if (!checkLabel(cellValue).equals("")) {
        errorList.add("第" + (rowNum + 1) + "行题目内容的" + checkLabel(cellValue)
            + "标签不匹配");
      }
    }
    
    if (k.equals("选项")) {
      if (!checkLabel(cellValue).equals("")) {
        errorList.add("第" + (rowNum + 1) + "行选项的" + checkLabel(cellValue)
            + "标签不匹配");
      }
    }
  }
  
  // 检测问题的内容或者选项中特殊标签是否成对出现
  public String checkLabel(String title) {
    if ((title.indexOf("<du>") == -1 && title.indexOf("</du>") != -1)
        || (title.indexOf("<du>") != -1 && title.indexOf("</du>") == -1)) {
      return "du";
    }
    
    if ((title.indexOf("<big>") == -1 && title.indexOf("</big>") != -1)
        || (title.indexOf("<big>") != -1 && title.indexOf("</big>") == -1)) {
      return "big";
    }
    
    if ((title.indexOf("<border>") == -1 && title.indexOf("</border>") != -1)
        || (title.indexOf("<border>") != -1 && title.indexOf("</border>") == -1)) {
      return "border";
    }
    
    if ((title.indexOf("<dot>") == -1 && title.indexOf("</dot>") != -1)
        || (title.indexOf("<dot>") != -1 && title.indexOf("</dot>") == -1)) {
      return "dot";
    }
    
    if ((title.indexOf("<strong>") == -1 && title.indexOf("</strong>") != -1)
        || (title.indexOf("<strong>") != -1 && title.indexOf("</strong>") == -1)) {
      return "strong";
    }
    
    if ((title.indexOf("<u>") == -1 && title.indexOf("</u>") != -1)
        || (title.indexOf("<u>") != -1 && title.indexOf("</u>") == -1)) {
      return "u";
    }
    
    return "";
  }
  
  private List<ExcelPicture> getALlPicturesFromExcel03(HSSFWorkbook hssfWorkbook) {
    if (hssfWorkbook == null) {
      return null;
    }
    List<ExcelPicture> list = new ArrayList<ExcelPicture>();
    // 只有一个sheet
    HSSFSheet sheet = hssfWorkbook.getSheetAt(0);
    if (sheet.getDrawingPatriarch() == null) { // 如果 excel中没有图片
      return list;
    }
    
    for (HSSFShape shape : sheet.getDrawingPatriarch().getChildren()) {
      if (shape instanceof HSSFPicture) {
        HSSFPicture pic = (HSSFPicture) shape;
        HSSFClientAnchor anchor = (HSSFClientAnchor) shape.getAnchor();
        int row = anchor.getRow1();
        int column = anchor.getCol1();
        byte[] picData = pic.getPictureData().getData();
        String imgBase64 = Byte2Base64.byte2Base64(picData);
        imgBase64 = imgBase64.replaceAll("\r", "").replaceAll("\n", "");
        list.add(new ExcelPicture(row, column, imgBase64));
      }
    }
    return list;
  }
  
  private List<ExcelPicture> getALlPicturesFromExcel07(XSSFWorkbook xssfWorkbook) {
    if (xssfWorkbook == null) {
      return null;
    }
    List<ExcelPicture> list = new ArrayList<ExcelPicture>();
    // 只有一个sheet
    XSSFSheet sheet = xssfWorkbook.getSheetAt(0);
    XSSFDrawing drawing = sheet.createDrawingPatriarch();
    
    if (drawing == null) { // 如果 excel中没有图片
      return list;
    }
    
    for (XSSFShape shape : drawing.getShapes()) {
      if (shape instanceof XSSFPicture) {
        XSSFPicture picture = (XSSFPicture) shape;
        ClientAnchor anchor = picture.getPreferredSize();
        int row = anchor.getRow1();
        int column = anchor.getCol1();
        byte[] picData = picture.getPictureData().getData();
        String imgBase64 = Byte2Base64.byte2Base64(picData);
        imgBase64 = imgBase64.replaceAll("\r", "").replaceAll("\n", "");
        list.add(new ExcelPicture(row, column, imgBase64));
      }
    }
    return list;
  }
  
  private void setValue2QuestionInfo(QuestionInfo info, String kValue,
      String cellValue, List<ExcelPicture> excelPictureList, int rowNum) {
    log.info("setValue2QuestionInfo");
    Object setValue = cellValue;
    if ("tableNumber".equals(kValue)) {
      if(!cellValue.isEmpty()){
        setValue = Integer.valueOf(cellValue);
      }
      allQNumList.add(cellValue);
    }
    
    if ("screenNumber".equals(kValue)) {
      if(cellValue.isEmpty()){
        errorList.add("第" + (rowNum + 1) + "行屏幕序号未填写");
      }
      allScreenNumList.add(cellValue);
    }
    
    if (kValue != null && !kValue.equals("") && cellValue != null
        && !cellValue.equals("")) {
      if (kValue.equals("title") || kValue.equals("guideLanguage")) {
        while (cellValue.contains("<image>")) {
          if (excelPictureList.isEmpty()) {
            errorList.add("第" + (rowNum + 1) + "行image标签没有图片与之匹配");
            break;
          }
          cellValue = cellValue.replaceFirst("<image>",
              "<img src=\'data:image/jpg;base64,"
                  + excelPictureList.get(0).getBase64Code() + "\'/>");
          // 每次都获取第一张图片并且移除第一张图片
          excelPictureList.remove(0);
        }
        setValue = cellValue;
      }
      
      if ("questionNumber".equals(kValue)) {
        qnumList.add(setValue.toString().trim());
      }
      
      if ("screenNumber".equals(kValue)) {
        setValue = Integer.valueOf(cellValue);
        screenNumList.add((Integer) setValue);
      }
      
      if ("questionType".equals(kValue)) {
        setValue = Integer.parseInt(Constant.COLUMN_TO_FIELD.get(cellValue));
      }
      
      if ("choice".equals(kValue)) {
        String choiceStr = cellValue.replace(" ", "");
        String newChoiceStr = "";
        // 避免同似“A.”以外的点的影响 (匹配对象是 非字母. 替换的是. 未用正则)
        for (int c = 0; c < choiceStr.length(); c++) {
          if (choiceStr.charAt(c) == '.'
              && !((choiceStr.charAt(c - 1) < 91 && choiceStr.charAt(c - 1) > 64) || (choiceStr
                  .charAt(c - 1) < 123 && choiceStr.charAt(c - 1) > 96))) {
            newChoiceStr = newChoiceStr + "`";
          } else {
            newChoiceStr = newChoiceStr + choiceStr.charAt(c);
          }
        }
        choiceStr = newChoiceStr;
        String[] choiceArr = choiceStr.replace("\t", "").split("\\.");
        List<ChoiceInfo> choiceList = new ArrayList<ChoiceInfo>();
        // [A,男 B,女]
        for (int j = 0; j < choiceArr.length - 1; j++) {
          ChoiceInfo choiceInfo = new ChoiceInfo();
          choiceInfo.setName(choiceArr[j]
              .trim()
              .substring(choiceArr[j].trim().length() - 1,
                  choiceArr[j].trim().length()).trim().toUpperCase());
          if (j != choiceArr.length - 2) {
            choiceInfo.setContent(choiceArr[j + 1].trim()
                .substring(0, choiceArr[j + 1].trim().length() - 1).trim()
                .replace('`', '.'));
          } else {
            choiceInfo.setContent(choiceArr[j + 1].trim()
                .substring(0, choiceArr[j + 1].trim().length()).trim()
                .replace('`', '.'));
          }
          while (choiceInfo.getContent().contains("<image>")) {
            if (excelPictureList.isEmpty()) {
              errorList.add("第" + (rowNum + 1) + "行image标签没有图片与之匹配");
              break;
            }
            String content = choiceInfo.getContent().replaceFirst(
                "<image>",
                "<img src=\'data:image/jpg;base64,"
                    + excelPictureList.get(0).getBase64Code() + "\'/>");
            choiceInfo.setContent(content);
            // 每次都获取第一张图片并且移除第一张图片
            excelPictureList.remove(0);
          }
          choiceList.add(choiceInfo);
        }
        setValue = choiceList;
      }
      if (kValue.equals("jump")) {
        quesNumHaveJumpList.add(info.getQuestionNumber());
      }
      // 采用反射
      Class<QuestionInfo> tempClass = QuestionInfo.class;
      Field fields;
      try {
        fields = tempClass.getDeclaredField(kValue);
        fields.setAccessible(true);
        fields.set(info, setValue);
      } catch (IllegalArgumentException e) {
        log.error(e.getMessage());
      } catch (IllegalAccessException e) {
        log.error(e.getMessage());
      } catch (NoSuchFieldException e) {
        log.error(e.getMessage());
      } catch (SecurityException e) {
        log.error(e.getMessage());
      }
    }
  }
  
  private void checkQuestionNum() {
    for (int i = 0; i < allQNumList.size(); i++) {
      if (i != allQNumList.size() - 1) {
        if (allQNumList.get(i).equals("")) {
          errorList.add("第" + (i + noDataRowNum + 1) + "行，题目序号未连续");
          continue;
        }
        
        if (!allQNumList.get(i + 1).equals("") && Integer.valueOf(allQNumList.get(i)) != Integer.valueOf(allQNumList
            .get(i + 1)) - 1) {
          errorList.add("第" + (i + noDataRowNum + 1) + "行，题目序号未连续");
        }
      }
    }
  }
  
  private void checkExcel(String[] attributes) {
    log.info("checkExcel !");
    int i = 1;
    List<Integer> qNumList = new ArrayList<Integer>();
    List<String> realQNumList = new ArrayList<String>();
    for (QuestionInfo info : questionList) {
      if (trueTableHeadList.contains("序号*")) {
        if (info.getTableNumber() != null && info.getTableNumber() <= 0) {
          String msg = "第" + (i + noDataRowNum) + "行，序号栏有误";
          errorList.add(msg);
        } else {
          if (qNumList.contains(info.getTableNumber())) {
            String msg = "第" + (i + noDataRowNum) + "行，序号栏序号重复";
            errorList.add(msg);
          } else {
            qNumList.add(info.getTableNumber());
          }
        }
      }
      if (trueTableHeadList.contains("题目序号*")) {
        if (info.getQuestionNumber() == null || info.getQuestionNumber().equals("")) {
          String msg = "第" + (i + noDataRowNum) + "行，题目序号栏漏填";
          errorList.add(msg);
        }else{
          if (realQNumList.contains(info.getQuestionNumber())) {
            String msg = "第" + (i + noDataRowNum) + "行，题目序号栏序号重复";
            errorList.add(msg);
          } else {
            realQNumList.add(info.getQuestionNumber());
          }
        }
      }
      if (trueTableHeadList.contains("同题标志*")) {
        if (info.getSameFlag() == null || info.getSameFlag().equals("")) {
          String msg = "第" + (i + noDataRowNum) + "行，同题标志栏漏填";
          errorList.add(msg);
        }
      }
      if (trueTableHeadList.contains("题目内容*")) {
        if (info.getTitle() == null || info.getTitle().equals("")) {
          String msg = "第" + (i + noDataRowNum) + "行，题目内容栏漏填";
          errorList.add(msg);
        }
      }
      if (info.getQuestionType() != null && (info.getQuestionType() == QuestionTypeEnum.SIGLECHOICE.getValue() || info.getQuestionType() == QuestionTypeEnum.MULCHOICE.getValue()
          || info.getQuestionType() == QuestionTypeEnum.SIGLECHOICEBLANK.getValue() || info.getQuestionType() == QuestionTypeEnum.MULCHOICEBLANK.getValue())) {
        if (info.getChoice() == null || info.getChoice().size() == 0) {
          String msg = "第" + (i + noDataRowNum) + "行，选项栏漏填";
          errorList.add(msg);
        } else {
          Set<String> nameSet = new HashSet<String>();
          for (ChoiceInfo choiceInfo : info.getChoice()) {
            if (regexFind(choiceInfo.getContent(), "[a-zA-Z]")) {
              String msg = "第" + (i + noDataRowNum) + "行，选项栏中选项"
                  + choiceInfo.getName() + "中可能存在漏写.";
              tipList.add(msg);
            }
            nameSet.add(choiceInfo.getName().toUpperCase());
          }
          if(nameSet.size() != info.getChoice().size()){
            String msg = "第" + (i + noDataRowNum) + "行，选择题选项中选项号存在重复";
            errorList.add(msg);
          }else{
            char n = 'A';
            for(int s = 0; s < nameSet.size(); s++){
              char nn = (char) (n + s);
              if(nameSet.contains(nn+"")){
                continue;
              }else{
                String msg = "第" + (i + noDataRowNum) + "行，选择题选项中选项号存在不连续";
                errorList.add(msg);
              }
            }
          }
          if (info.getQuestionType() == QuestionTypeEnum.SIGLECHOICEBLANK.getValue() || info.getQuestionType() == QuestionTypeEnum.MULCHOICEBLANK.getValue()) {
            ChoiceInfo choiceInfo = info.getChoice().get(
                info.getChoice().size() - 1);
            String cc = choiceInfo.getContent();
            if (!cc.contains(Constant.FILL_IN_BLANK_PLACEHOLDER)) {
              String msg = "第" + (i + noDataRowNum) + "行，选择填空题需要再选项中添加#代表填空";
              errorList.add(msg);
            }
          }
        }
        if (info.getStructure() != null && info.getStructure().equals("结构性")) {
          if (info.getCountScoreWay() == null) {
            String msg = "第" + (i + noDataRowNum) + "行，计分方式栏漏填";
            errorList.add(msg);
          } else {
            String scoring = info.getCountScoreWay().trim();
            scoring = getScoreStr(scoring);
            String[] scoreArr = scoring.split(",");
            if (info.getChoice() != null
                && scoreArr.length != info.getChoice().size()) {
              String msg = "第" + (i + noDataRowNum) + "行，计分方式栏数目与选项数目不匹配";
              errorList.add(msg);
            }
            for (int s = 0; s < scoreArr.length; s++) {
              if (!regexFind(scoreArr[s], "^[0-9]*$")) {
                String msg = "第" + (i + noDataRowNum) + "行，计分方式栏计分值有误";
                errorList.add(msg);
                break;
              }
            }
          }
        } else {
          if (info.getCountScoreWay() != null && !info.getCountScoreWay().equals("")) {
            String scoring = info.getCountScoreWay().trim();
            scoring = getScoreStr(scoring);
            String[] scoreArr = scoring.split(",");
            if (info.getChoice() != null
                && scoreArr.length != info.getChoice().size()) {
              String msg = "第" + (i + noDataRowNum) + "行，计分方式栏数目与选项数目不匹配";
              errorList.add(msg);
            }
            for (int s = 0; s < scoreArr.length; s++) {
              if (!regexFind(scoreArr[s], "^[0-9]*$")) {
                String msg = "第" + (i + noDataRowNum) + "行，计分方式栏计分值有误";
                errorList.add(msg);
                break;
              }
            }
          }
        }
      }
      
      if (trueTableHeadList.contains("总维度*")) {
        if (info.getDimension() == null
            || info.getDimension().equals("")) {
          String msg = "第" + (i + noDataRowNum) + "行，总维度栏漏填";
          errorList.add(msg);
        }
      }
      if (trueTableHeadList.contains("一级指标*")) {
        if (info.getFirstIndex() == null
            || info.getFirstIndex().equals("")) {
          String msg = "第" + (i + noDataRowNum) + "行，一级指标栏漏填";
          errorList.add(msg);
        }
      }
      if (trueTableHeadList.contains("二级指标*")) {
        if (info.getSecondIndex() == null
            || info.getSecondIndex().equals("")) {
          String msg = "第" + (i + noDataRowNum) + "行，二级指标栏漏填";
          errorList.add(msg);
        }
      }
      if (info.getJump() != null) {
        String[] scoreArr = info.getJump().split(",");
        if (info.getChoice() != null && info.getChoice().size() > 0
            && scoreArr.length != info.getChoice().size()) {
          String msg = "第" + (i + noDataRowNum) + "行，跳转栏跳转数目与选项数目不匹配";
          errorList.add(msg);
        }
        boolean flag = false;
        if (info.getChoice() != null && info.getChoice().size() > 0) {
          flag = checkFormet(info, Constant.JUMP_PLACEHOLDER);
        }
        if (flag == true) {
          String msg = "第" + (i + noDataRowNum)
              + "行，此题为跳转题，跳转项目中的选项数量与题目的选项数量不一致或者符号'@'后面的题号有误";
          errorList.add(msg);
        }
      }
      i++;
    }
  }
  
  private boolean checkFormet(QuestionInfo info, String breakStr) {
    List<String> choiceNameList = new ArrayList<String>();
    String[] sArr = null;
    if (breakStr.equals("=")) {
      sArr = info.getCountScoreWay().split(",");
    }
    if (breakStr.equals(Constant.JUMP_PLACEHOLDER)) {
      sArr = info.getJump().split(",");
    }
    for (ChoiceInfo choiceInfo : info.getChoice()) {
      choiceNameList.add(choiceInfo.getName());
    }
    boolean flag = false;
    for (int j = 0; j < sArr.length; j++) {
      String jumpStr = sArr[j];
      if (jumpStr.contains(breakStr)) {
        int index = jumpStr.indexOf(breakStr);
        String choiceName = jumpStr.substring(0, index).trim();
        String target = jumpStr.substring(index + 1, jumpStr.length()).trim();
        if (choiceName.length() != 1) {
          flag = true;
        } else {
          if (!((choiceName.charAt(0) < 91 && choiceName.charAt(0) > 64) || (choiceName
              .charAt(0) < 123 && choiceName.charAt(0) > 96))) {
            flag = true;
          } else {
            if (!choiceNameList.contains(choiceName)) {
              flag = true;
            }
          }
        }
        if (breakStr.equals(Constant.JUMP_PLACEHOLDER)) {
          if (!qnumList.contains(target)) {
            flag = true;
          }
        }
        if (jumpStr.length() <= 2) {
          flag = true;
        }
      } else {
        flag = true;
      }
    }
    return flag;
  }
  
  // 获取计分方式字符串
  private String getScoreStr(String sStr) {
    if (sStr.substring(0, 1).equals(",") || sStr.substring(0, 1).equals("，")) {
      sStr = sStr.substring(1, sStr.length());
      getScoreStr(sStr);
    } else {
      return sStr;
    }
    return sStr;
  }

// =======================正则方法===========================
// 正则匹配 获取匹配的个数
private int matchFindNum(String regex, String search) {
  Pattern pattern = Pattern.compile(search);
  Matcher matcher = pattern.matcher(regex);
  int num = 0;
  while (matcher.find()) {
    num++;
  }
  return num;
}

// 是否匹配到 boolean
private boolean regexFind(String regex, String search) {
  Pattern pattern = Pattern.compile(search);
  Matcher matcher = pattern.matcher(regex);
  return matcher.find();
}

public List<QuestionInfo> getQuestionList() {
  return questionList;
}

public void setQuestionList(List<QuestionInfo> questionList) {
  this.questionList = questionList;
}

public List<String> getErrorList() {
  return errorList;
}

public void setErrorList(List<String> errorList) {
  this.errorList = errorList;
}

public List<String> getTipList() {
  return tipList;
}

public void setTipList(List<String> tipList) {
  this.tipList = tipList;
}

public List<String> getQuesNumHaveJumpList() {
  return quesNumHaveJumpList;
}

public void setQuesNumHaveJumpList(List<String> quesNumHaveJumpList) {
  this.quesNumHaveJumpList = quesNumHaveJumpList;
}

public List<String> getQnumList() {
  return qnumList;
}

public void setQnumList(List<String> qnumList) {
  this.qnumList = qnumList;
}

public List<Integer> getScreenNumList() {
  return screenNumList;
}

public void setScreenNumList(List<Integer> screenNumList) {
  this.screenNumList = screenNumList;
}

public List<String> getTrueTableHeadList() {
  return trueTableHeadList;
}

public void setTrueTableHeadList(List<String> trueTableHeadList) {
  this.trueTableHeadList = trueTableHeadList;
}

public List<String> getAllQNumList() {
  return allQNumList;
}

public void setAllQNumList(List<String> allQNumList) {
  this.allQNumList = allQNumList;
}

public List<String> getAllScreenNumList() {
  return allScreenNumList;
}

public void setAllScreenNumList(List<String> allScreenNumList) {
  this.allScreenNumList = allScreenNumList;
}

public int getNoDataRowNum() {
  return noDataRowNum;
}

public void setNoDataRowNum(int noDataRowNum) {
  this.noDataRowNum = noDataRowNum;
}
}