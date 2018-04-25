package com.ly.edu.scale;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.ly.edu.common.Constant;
import com.ly.edu.common.QuestionTypeEnum;
import com.ly.edu.scale.element.*;
import com.ly.edu.scale.model.ChoiceInfo;
import com.ly.edu.scale.model.QuestionInfo;
import com.ly.edu.util.KeyHolder;
import com.ly.edu.util.ZipUtilsForScale;

/**
 * @author gangwu3
 *
 */
public class MakeRPK {
  
  public Set<String> pathSourse = new HashSet<String>();
  
  private Logger log = Logger.getLogger(MakeRPK.class);
  private String rpkPath = null;
  
  // 生成的最终文件包
  private String rpkFilePath = null;

  public Set<String> getPathSourse() {
    return pathSourse;
  }
  public void setPathSourse(Set<String> pathSourse) {
    this.pathSourse = pathSourse;
  }
  public String getRpkPath() {
    return rpkPath;
  }
  public void setRpkPath(String rpkPath) {
    this.rpkPath = rpkPath;
  }
  public String getRpkFilePath() {
    return rpkFilePath;
  }
  public void setRpkFilePath(String rpkFilePath) {
    this.rpkFilePath = rpkFilePath;
  }
  
  public String makeRPK(List<QuestionInfo> questionList, List<String> quesNumHaveJumpList, String workLocation) {
    // 生成rpk的临时保存路径
    makeRpkPath(workLocation);
    // 生成xml
    makeXml(questionList, quesNumHaveJumpList);
    rpkFilePath = makeRpk();
    return rpkFilePath;
  }

  private void makeXml(List<QuestionInfo> questionList, List<String> quesNumHaveJumpList) {
    for (QuestionInfo questionInfo : questionList) {
      if (questionInfo.getQuestionType() == QuestionTypeEnum.FILLINBALK
          .getValue()
          || questionInfo.getQuestionType() == QuestionTypeEnum.SORTQUESTION
              .getValue()) {
        dealFillBlank(questionInfo);
      } else if (questionInfo.getQuestionType() == QuestionTypeEnum.SIGLECHOICE
          .getValue()
          || questionInfo.getQuestionType() == QuestionTypeEnum.SIGLECHOICEBLANK
              .getValue()) {
        dealSingleChoice(questionInfo);
      } else if (questionInfo.getQuestionType() == QuestionTypeEnum.TABLEQUESTION
          .getValue()) {
        dealTableQuestion(questionInfo);
      } else if (questionInfo.getQuestionType() == QuestionTypeEnum.SLIDERQUESTION
          .getValue()) {
        continue;
      } else {
        dealMultiChoice(questionInfo);
      }
    }
     dealPaper(questionList, quesNumHaveJumpList);
  }
  
  private Map<Integer,String> findSpecialCharactersIndex(String str) {
    Map<Integer,String> map = new LinkedHashMap<Integer,String>();
    StringBuffer sb = new StringBuffer();
    int startNum = 0;
    for (int i = 0; i < str.length(); i++) {
      sb.append(str.charAt(i));
      if (-1 != sb.indexOf("#", startNum)) {
        int index = sb.indexOf("#", startNum);
        startNum = index + 1;
        map.put(index, "#");
      }
      if (-1 != sb.indexOf("$%", startNum)) {
        int index = sb.indexOf("$%", startNum);
        startNum = index + 2;
        map.put(index, "$%");
      }
      if (-1 != sb.indexOf("^&", startNum)) {
        int index = sb.indexOf("^&", startNum);
        startNum = index + 2;
        map.put(index, "^&");
      }
      if (-1 != sb.indexOf("<u>", startNum)) {
        int index = sb.indexOf("<u>", startNum);
        startNum = index + 3;
        map.put(index, "<u>");
      }
      if (-1 != sb.indexOf("</u>", startNum)) {
        int index = sb.indexOf("</u>", startNum);
        startNum = index + 4;
        map.put(index, "</u>");
      }
      if (-1 != sb.indexOf("<border>", startNum)) {
        int index = sb.indexOf("<border>", startNum);
        startNum = index + 8;
        map.put(index, "<border>");
      }
      if (-1 != sb.indexOf("</border>", startNum)) {
        int index = sb.indexOf("</border>", startNum);
        startNum = index + 9;
        map.put(index, "</border>");
      }
      if (-1 != sb.indexOf("<du>", startNum)) {
        int index = sb.indexOf("<du>", startNum);
        startNum = index + 4;
        map.put(index, "<du>");
      }
      if (-1 != sb.indexOf("</du>", startNum)) {
        int index = sb.indexOf("</du>", startNum);
        startNum = index + 5;
        map.put(index, "</du>");
      }
      if (-1 != sb.indexOf("<dot>", startNum)) {
        int index = sb.indexOf("<dot>", startNum);
        startNum = index + 5;
        map.put(index, "<dot>");
      }
      if (-1 != sb.indexOf("</dot>", startNum)) {
        int index = sb.indexOf("</dot>", startNum);
        startNum = index + 6;
        map.put(index, "</dot>");
      }
      if (-1 != sb.indexOf("<strong>", startNum)) {
        int index = sb.indexOf("<strong>", startNum);
        startNum = index + 8;
        map.put(index, "<strong>");
      }
      if (-1 != sb.indexOf("</strong>", startNum)) {
        int index = sb.indexOf("</strong>", startNum);
        startNum = index + 9;
        map.put(index, "</strong>");
      }
      if (-1 != sb.indexOf("<img src=", startNum)) {
        int index = sb.indexOf("<img src=", startNum);
        startNum = index + 9;
        map.put(index, "<img src=");
      }
      if (-1 != sb.indexOf("<br>", startNum)) {
        int index = sb.indexOf("<br>", startNum);
        startNum = index + 4;
        map.put(index, "<br>");
      }
      if (-1 != sb.indexOf("<big>", startNum)) {
        int index = sb.indexOf("<big>", startNum);
        startNum = index + 5;
        map.put(index, "<big>");
      }
      if (-1 != sb.indexOf("</big>", startNum)) {
        int index = sb.indexOf("</big>", startNum);
        startNum = index + 6;
        map.put(index, "</big>");
      }
    }
    return map;
  }
  
  private Span getElementBySpecialCharacters(String str, int num,
      String base64Str) {
    Span rspan = null;
    Span span = new Span();
    if (str.equals("#")) {
      TextEntryInteraction tei = new TextEntryInteraction();
      tei.setResponseIdentifier("RESPONSE" + num);
      span.setTextEntryInteraction(tei);
      span.setStyle("width:auto;height:auto;max-width: 810px;");
      rspan = span;
    }
    if (str.equals("^&")) {
      TextEntryInteraction tei = new TextEntryInteraction();
      tei.setResponseIdentifier("RESPONSE" + num);
      tei.setChoiceLimit("true");
      span.setTextEntryInteraction(tei);
      span.setStyle("width:auto;height:auto;max-width: 810px;");
      rspan = span;
    }
    if (str.equals("$%")) {
      ExtendedTextInteraction eti = new ExtendedTextInteraction();
      eti.setResponseIdentifier("RESPONSE" + num);
      span.setExtendedTextInteraction(eti);
      rspan = span;
    }
    if (str.equals("<img src=")) {
      Img img = new Img();
      img.setSrc(base64Str);
      span.setImg(img);
      span.setStyle("width:auto;height:auto;max-width: 810px;");
      rspan = span;
    }
    if (str.equals("<br>")) {
      Br br = new Br();
      span.setBr(br);
      span.setStyle("width:auto;height:auto;max-width: 810px;");
      rspan = span;
    }
    return rspan;
  }
  
  private String getStyleStr(List<String> list) {
    String style = "width:auto;height:auto;max-width: 810px;";
    for (int i = 0; i < list.size(); i++) {
      if (list.get(i).equals("<border>")) {
        style += "display:inline;border-width:thin;border-style:solid;";
      }
      if (list.get(i).equals("<big>")) {
        style += "font-size:24px;";
      }
      if (list.get(i).equals("<u>")) {
        style += "border-bottom:1px solid #000;";
      }
      if (list.get(i).equals("<du>")) {
        style += "border-bottom:thick double black;";
      }
      if (list.get(i).equals("<dot>")) {
        style += "display:inline;border-bottom:thick dashed black;width:auto;";
      }
      if (list.get(i).equals("<strong>")) {
        style += "font-weight:bold;";
      }
    }
    return style;
  }
  
  /**
   * 
   * @param
   * @param str
   */
  private List<Span> handleText(String str, int responseBeginNum) {
    List<Span> list = new ArrayList<Span>();
    Map<Integer,String> map = findSpecialCharactersIndex(str);
    //存放文本样式列表
    List<String> styleList = new ArrayList<String>();
    //判断是否含有特殊符号
    if (map.isEmpty()) {
      Span span = new Span();
      span.setSpan(str);
      list.add(span);
    } else {   
      int startNum = 0;
      for (Integer key : map.keySet()) {
        if (key != 0) {
          String styleStr = getStyleStr(styleList);
          String content = str.substring(startNum, key);
          if(!content.isEmpty()){
            // 处理排序题(数字).前加换行
            if (regexFind(content, "\\(\\d+\\)\\.")) {
              //strs里没有了(数字).
              String[] strs = content.split("\\(\\d+\\)\\.");
              if (strs[0].length() != 0) {
                Span span = new Span();
                span.setStyle(styleStr);
                span.setSpan(strs[0]);
                list.add(span);
              }
              for (int i = 1; i < strs.length; i++) {
                int num1 = 0;
                int num2 = 0;
                if(!strs[i-1].isEmpty()){
                  num1 = content.indexOf(strs[i-1]) + strs[i-1].length();
                }
                if(!strs[i].isEmpty()){
                  num2 = content.indexOf(strs[i]);
                }
                Span s = new Span();
                Br br = new Br();
                s.setBr(br);
                list.add(s);
                Span span = new Span();
                span.setSpan(content.substring(num1, num2).trim() + strs[i]);
                span.setStyle(styleStr);
                list.add(span);
              }
            } else {
              Span span = new Span();
              span.setSpan(content);
              span.setStyle(styleStr);
              list.add(span);
            }
          }
        }
        String base64Str = "";
        //获取base64码和startNum
        if (map.get(key).equals("<img src=")) {
          int endIndex = str.indexOf("\'/", key + 9);
          base64Str = str.substring(key + 10, endIndex);
          startNum = endIndex+3;
        }
        //获取除去样式以外的特殊符号转换后的element
        Span span1 = getElementBySpecialCharacters(map.get(key),
            responseBeginNum, base64Str);
        if (span1 != null) {
          list.add(span1);
          //客户端response增加
          if (!map.get(key).equals("<img src=>") || !map.get(key).equals("<br>")) {
            responseBeginNum++;
          }
        } else {
          // 处理样式 存在list中 遇到结束的倒序去除和棋对称的样式符
          if (map.get(key).contains("/")) {
            for (int n = styleList.size() - 1; n >= 0; n--) {
              if (styleList.get(n).equals(
                  "<" + map.get(key).substring(2, map.get(key).length() - 1)
                      + ">")) {
                styleList.remove(styleList.get(n));
                break;
              }
            }
          } else {
            styleList.add(map.get(key));
          }
        }
        if (!map.get(key).equals("<img src=")) {
          // 更新开始下标
          startNum = key + map.get(key).length();
        }
      }
      
      //处理最后一个标签后的内容
      Span span = new Span();
      //处理排序选前三项
      String con = str.substring(startNum, str.length());
      if (regexFind(con, "\\(\\d+\\)\\.")) {
        String[] strs = con.split("\\(\\d+\\)\\.");
        if (strs[0].length() != 0) {
          Span sp = new Span();
          sp.setStyle("width:auto;height:auto;max-width: 810px;");
          sp.setSpan(strs[0]);
          list.add(sp);
        }
        for (int i = 1; i < strs.length; i++) {
          int num1 = 0;
          int num2 = 0;
          if(!strs[i-1].isEmpty()){
            num1 = con.indexOf(strs[i-1]) + strs[i-1].length();
          }
          if(!strs[i].isEmpty()){
            num2 = con.indexOf(strs[i]);
          }
          Span s = new Span();
          Br br = new Br();
          s.setBr(br);
          list.add(s);
          Span sp1 = new Span();
          sp1.setSpan(con.substring(num1, num2).trim() + strs[i]);
          sp1.setStyle("width:auto;height:auto;max-width: 810px;");
          list.add(sp1);
        }
      }else{
        span.setSpan(con);
        span.setStyle("width:auto;height:auto;max-width: 810px;");
        list.add(span);
      }
    }
    return list;
  }
  
  private int getCharsNum(String str1, String str2) {
    int num = 0;
    int index = -1;
    while ((index = str1.indexOf(str2, index)) > -1) {
      index++;
      num++;
    }
    return num;
  }
  
  private void dealFillBlank(QuestionInfo questionInfo) {
    ItemBody ib = new ItemBody();
    // 替换中文括号至英文
    String newTitle = questionInfo.getTitle().replace(" ", "")
        .replace("（", "(").replace("）", ")");
    int sortChoiceNum = matchFindNum(newTitle, Constant.SORT_NEED_ENTER);
    int sortNum = getCharsNum(newTitle, Constant.SORT_QUESTION_PLACEHOLDER);
    int fillNum = getCharsNum(newTitle, Constant.FILL_IN_BLANK_PLACEHOLDER);
    int shortNum = getCharsNum(newTitle, Constant.ESSAY_QUESTION_PLACEHOLDER);
    int responseNum = sortNum + shortNum + fillNum;
    List<ResponseDeclaration> rdl = new ArrayList<ResponseDeclaration>();
    for (int i = 0; i < responseNum; i++) {
      ResponseDeclaration rd = new ResponseDeclaration();
      rd.setIdentifier("RESPONSE" + i);
      rdl.add(rd);
    }
    OutcomeDeclaration od = new OutcomeDeclaration();
    od.setIdentifier("SCORE");
    
    if (questionInfo.getGuideLanguage() != null
        && questionInfo.getGuideLanguage() != "") {
      List<Span> introduction_list = handleText(
          questionInfo.getGuideLanguage(), 0);
      Prompt p1 = new Prompt();
      p1.setSpan(introduction_list);
      p1.setArea("introduction_area");
      ib.setPrompt(p1);
    }
    
    Sequence sequence = new Sequence();
    sequence.setSpan(questionInfo.getQuestionNumber() + ".");
    ib.setSequence(sequence);
    
    List<Span> title_list = handleText(newTitle, 0);
    ib.setSpan(title_list);
    
    ResponseProcessing rp = new ResponseProcessing();
    AssessmentItem ai = new AssessmentItem();
    ai.setResponseDeclaration(rdl);
    ai.setOutcomeDeclaration(od);
    ai.setItemBody(ib);
    ai.setResponseProcessing(rp);
    if (sortChoiceNum != 0) {
      ai.setChoiceLimit(sortChoiceNum + "");
    }
    
    ai.setQuesType(questionInfo.getQuestionType()+"");
    String secondIndicator = "";
    String key = "";
    if (questionInfo.getSecondIndex() != null) {
      secondIndicator = questionInfo.getSecondIndex();
    } else {
      secondIndicator = "目录";
    }
    if (questionInfo.getKeyWord() != null) {
      key = questionInfo.getKeyWord();
    } else {
      key = "题目" + questionInfo.getQuestionNumber();
    }
    ai.setQuesNum(questionInfo.getQuestionNumber());
    ai.setKeyword(key);
    ai.setSecondIndex(secondIndicator);
    ai.setSameFlag(questionInfo.getSameFlag());
    ai.setDemension(questionInfo.getDimension());
    ai.setFirstIndex(questionInfo.getFirstIndex());
    ai.setThirdIndex(questionInfo.getThirdIndex());
    ai.setStructure(questionInfo.getStructure());
    if(questionInfo.getDemographic() != null && !questionInfo.getDemographic().isEmpty()){
      ai.setDemographic(questionInfo.getDemographic());
    }
    if(questionInfo.getConstraints() != null && !questionInfo.getConstraints().isEmpty()){
      ai.setConstraints(questionInfo.getConstraints());
    }
    
    JAXBUtil.jaxbObjectToXML(ai, rpkPath + "/item.xml");
    
    String rpkName = String.valueOf(questionInfo.getQuestionNumber());
    doZip(rpkPath + "/item.xml", rpkName);
  }
  
  private void dealSingleChoice(QuestionInfo questionInfo) {
    AssessmentItem ai = new AssessmentItem();
    int choiceNum = questionInfo.getChoice().size();
    int fillNum = 0;
    for (int i = 0; i < choiceNum; i++) {
      String choiceStr = questionInfo.getChoice().get(i).getContent();
      int num = getCharsNum(choiceStr, Constant.FILL_IN_BLANK_PLACEHOLDER);
      fillNum = fillNum + num;
    }
    List<ResponseDeclaration> rdl = new ArrayList<ResponseDeclaration>();
    for (int i = 0; i < fillNum + 1; i++) {
      ResponseDeclaration rd = new ResponseDeclaration();
      rd.setIdentifier("RESPONSE" + i);
      rdl.add(rd);
    }
    OutcomeDeclaration od = new OutcomeDeclaration();
    od.setIdentifier("SCORE");
    
    ChoiceInteraction ci = new ChoiceInteraction();
    ci.setResponseIdentifier("RESPONSE0");
    ci.setMaxChoices("1");
    
    List<Prompt> pl = new ArrayList<Prompt>();
    if (questionInfo.getGuideLanguage() != null
        && questionInfo.getGuideLanguage() != "") {
      List<Span> introduction_list = handleText(
          questionInfo.getGuideLanguage(), 0);
      Prompt p1 = new Prompt();
      p1.setSpan(introduction_list);
      p1.setArea("introduction_area");
      pl.add(p1);
    }
    
    Prompt p2 = new Prompt();
    p2.setArea("q_title");
    List<Span> ssl1 = handleText(questionInfo.getTitle(), 0);
    p2.setSpan(ssl1);
    
    Sequence sequence = new Sequence();
    sequence.setSpan(questionInfo.getQuestionNumber() + ".");
    p2.setSequence(sequence);
    
    pl.add(p2);
    ci.setPrompt(pl);
    
    String haveBlankChoiceStr = "";
    List<SimpleChoice> scl = new ArrayList<SimpleChoice>();
    for (int i = 0; i < choiceNum; i++) {
      String content = questionInfo.getChoice().get(i).getContent();
      String name = questionInfo.getChoice().get(i).getName();
      SimpleChoice sc = new SimpleChoice();
      sc.setIdentifier(name);
      if (content.contains("#")) {
        sc.setFillBlankChoice(content);
        haveBlankChoiceStr = content;
        content = content.replaceAll("#", "______");
      }
      sc.setSpan(handleText(content, 0));
      scl.add(sc);
    }
    ci.setSimpleChoice(scl);
    if (!haveBlankChoiceStr.isEmpty()) {
      ci.setSpan(handleText(haveBlankChoiceStr, 1));
      ai.setBlankChoice("true");
    }
    ci.setShuffle("false");
    
    ItemBody ib = new ItemBody();
    ib.setChoiceInteraction(ci);
    ResponseProcessing rp = new ResponseProcessing();
    ai.setResponseDeclaration(rdl);
    ai.setOutcomeDeclaration(od);
    ai.setItemBody(ib);
    ai.setResponseProcessing(rp);
    ai.setClazz("ygpj-single-choice");
    
    ai.setQuesType(questionInfo.getQuestionType()+"");
    String secondIndicator = "";
    String key = "";
    if (questionInfo.getSecondIndex() != null) {
      secondIndicator = questionInfo.getSecondIndex();
    } else {
      secondIndicator = "目录";
    }
    if (questionInfo.getKeyWord() != null) {
      key = questionInfo.getKeyWord();
    } else {
      key = "题目" + questionInfo.getQuestionNumber();
    }
    ai.setQuesNum(questionInfo.getQuestionNumber());
    ai.setKeyword(key);
    ai.setSecondIndex(secondIndicator);
    ai.setSameFlag(questionInfo.getSameFlag());
    ai.setDemension(questionInfo.getDimension());
    ai.setFirstIndex(questionInfo.getFirstIndex());
    ai.setThirdIndex(questionInfo.getThirdIndex());
    ai.setStructure(questionInfo.getStructure());
    if (questionInfo.getDemographic() != null
        && !questionInfo.getDemographic().isEmpty()) {
      ai.setDemographic(questionInfo.getDemographic());
    }
    if(questionInfo.getCountScoreWay() != null && !questionInfo.getCountScoreWay().isEmpty()){
      ai.setScoreWay(questionInfo.getCountScoreWay());
    }
    if(questionInfo.getConstraints() != null && !questionInfo.getConstraints().isEmpty()){
      ai.setConstraints(questionInfo.getConstraints());
    }
    if(questionInfo.getJump() != null && !questionInfo.getJump().isEmpty()){
      ai.setJump(questionInfo.getJump());
    }
    
    JAXBUtil.jaxbObjectToXML(ai, rpkPath + "/item.xml");
    
    String rpkName = String.valueOf(questionInfo.getQuestionNumber());
    doZip(rpkPath + "/item.xml", rpkName);
  }
  
  private void dealMultiChoice(QuestionInfo questionInfo) {
    AssessmentItem ai = new AssessmentItem();
    int choiceNum = questionInfo.getChoice().size();
    int fillNum = 0;
    for (int i = 0; i < choiceNum; i++) {
      String choiceStr = questionInfo.getChoice().get(i).getContent();
      int num = getCharsNum(choiceStr, Constant.FILL_IN_BLANK_PLACEHOLDER);
      fillNum = fillNum + num;
    }
    List<ResponseDeclaration> rdl = new ArrayList<ResponseDeclaration>();
    for (int i = 0; i < fillNum + 1; i++) {
      ResponseDeclaration rd = new ResponseDeclaration();
      rd.setIdentifier("RESPONSE" + i);
      rdl.add(rd);
    }
    OutcomeDeclaration od = new OutcomeDeclaration();
    od.setIdentifier("SCORE");
    
    ChoiceInteraction ci = new ChoiceInteraction();
    ci.setResponseIdentifier("RESPONSE0");
    String maxChoice = "";
    String title = questionInfo.getTitle();
    if (title.contains("多选")) {
      int index = title.indexOf("多选");
      for (int i = index + 2; i < title.length(); i++) {
        // ASCII码 数字
        if (title.charAt(i) < 58 && title.charAt(i) > 47) {
          maxChoice += title.charAt(i);
        } else {
          break;
        }
      }
    }
    if (maxChoice.isEmpty()) {
      maxChoice = choiceNum + "";
    }
    ci.setMaxChoices(maxChoice);
    
    List<Prompt> pl = new ArrayList<Prompt>();
    if (questionInfo.getGuideLanguage() != null
        && questionInfo.getGuideLanguage() != "") {
      List<Span> introduction_list = handleText(
          questionInfo.getGuideLanguage(), 0);
      Prompt p1 = new Prompt();
      p1.setSpan(introduction_list);
      p1.setArea("introduction_area");
      pl.add(p1);
    }
    Prompt p2 = new Prompt();
    p2.setArea("q_title");
    p2.setSpan(handleText(title, 0));
    Sequence sequence = new Sequence();
    sequence.setSpan(questionInfo.getQuestionNumber() + ".");
    p2.setSequence(sequence);
    pl.add(p2);
    ci.setPrompt(pl);
    
    String haveBlankChoiceStr = "";
    int maxLen = getMaxLenOfChoiceContent(questionInfo);
    Table table = new Table();
    Tbody tbody = new Tbody();
    List<Tr> trlist = new ArrayList<Tr>();
    if (maxLen <= 15 && questionInfo.getChoice().size() > 5) {
      Tr tr = null;
      List<Td> tdlist = null;
      for (int n = 0; n < questionInfo.getChoice().size(); n++) {
        ChoiceInfo choiceInfo = questionInfo.getChoice().get(n);
        if (n % 2 == 0) {
          tr = new Tr();
          tdlist = new ArrayList<Td>();
        }
        
        Td td1 = new Td();
        Prompt tdp1 = new Prompt();
        String content = choiceInfo.getContent();
        if (content.contains("#")) {
          haveBlankChoiceStr = content;
          content = content.replaceAll("#", "______");
        }
        tdp1.setSpan(handleText(content, 0));
        td1.setPrompt(tdp1);
        tdlist.add(td1);
        
        Td td2 = new Td();
        SimpleChoice tdsc1 = new SimpleChoice();
        tdsc1.setIdentifier(choiceInfo.getName());
        if (!haveBlankChoiceStr.isEmpty()) {
          tdsc1.setFillBlankChoice(haveBlankChoiceStr);
        }
        td2.setSimpleChoice(tdsc1);
        tdlist.add(td2);
        
        if (n % 2 != 0 || n == questionInfo.getChoice().size() - 1) {
          tr.setTd(tdlist);
          trlist.add(tr);
        }
      }
    } else {
      for (int n = 0; n < questionInfo.getChoice().size(); n++) {
        ChoiceInfo choiceInfo = questionInfo.getChoice().get(n);
        Tr tr = new Tr();
        List<Td> tdlist = new ArrayList<Td>();
        
        Td td1 = new Td();
        Prompt tdp1 = new Prompt();
        String content = choiceInfo.getContent();
        if (content.contains("#")) {
          haveBlankChoiceStr = content;
          content = content.replaceAll("#", "______");
        }
        tdp1.setSpan(handleText(content, 0));
        td1.setPrompt(tdp1);
        tdlist.add(td1);
        
        Td td2 = new Td();
        SimpleChoice tdsc1 = new SimpleChoice();
        tdsc1.setIdentifier(choiceInfo.getName());
        if (!haveBlankChoiceStr.isEmpty()) {
          tdsc1.setFillBlankChoice(haveBlankChoiceStr);
        }
        td2.setSimpleChoice(tdsc1);
        tdlist.add(td2);
        
        tr.setTd(tdlist);
        trlist.add(tr);
      }
    }
    
    tbody.setTr(trlist);
    table.setTbody(tbody);
    ci.setTable(table);
    ci.setShuffle("false");
    
    if (!haveBlankChoiceStr.isEmpty()) {
      ci.setSpan(handleText(haveBlankChoiceStr, 1));
      ai.setBlankChoice("true");
    }
    
    ItemBody ib = new ItemBody();
    ib.setChoiceInteraction(ci);
    
    ResponseProcessing rp = new ResponseProcessing();
    
    ai.setResponseDeclaration(rdl);
    ai.setOutcomeDeclaration(od);
    ai.setItemBody(ib);
    ai.setResponseProcessing(rp);
    ai.setClazz("ygpj-table-checkbox");
    
    ai.setQuesType(questionInfo.getQuestionType()+"");
    String secondIndicator = "";
    String key = "";
    if (questionInfo.getSecondIndex() != null) {
      secondIndicator = questionInfo.getSecondIndex();
    } else {
      secondIndicator = "目录";
    }
    if (questionInfo.getKeyWord() != null) {
      key = questionInfo.getKeyWord();
    } else {
      key = "题目" + questionInfo.getQuestionNumber();
    }
    ai.setQuesNum(questionInfo.getQuestionNumber());
    ai.setKeyword(key);
    ai.setSecondIndex(secondIndicator);
    ai.setSameFlag(questionInfo.getSameFlag());
    ai.setDemension(questionInfo.getDimension());
    ai.setFirstIndex(questionInfo.getFirstIndex());
    ai.setThirdIndex(questionInfo.getThirdIndex());
    ai.setStructure(questionInfo.getStructure());
    if (questionInfo.getDemographic() != null
        && !questionInfo.getDemographic().isEmpty()) {
      ai.setDemographic(questionInfo.getDemographic());
    }
    if(questionInfo.getCountScoreWay() != null && !questionInfo.getCountScoreWay().isEmpty()){
      ai.setScoreWay(questionInfo.getCountScoreWay());
    }
    if(questionInfo.getConstraints() != null && !questionInfo.getConstraints().isEmpty()){
      ai.setConstraints(questionInfo.getConstraints());
    }
    
    JAXBUtil.jaxbObjectToXML(ai, rpkPath + "/item.xml");
    
    String rpkName = String.valueOf(questionInfo.getQuestionNumber());
    doZip(rpkPath + "/item.xml", rpkName);
  }
  
  // 关于表格题的处理
  private void dealTableQuestion(QuestionInfo questionInfo) {
    ResponseDeclaration rd = new ResponseDeclaration();
    rd.setIdentifier("RESPONSE0");
    List<ResponseDeclaration> rdl = new ArrayList<ResponseDeclaration>();
    rdl.add(rd);
    OutcomeDeclaration od = new OutcomeDeclaration();
    od.setIdentifier("SCORE");
    
    ChoiceInteraction ci = new ChoiceInteraction();
    ci.setResponseIdentifier("RESPONSE0");
    ci.setMaxChoices("1");
    ci.setShuffle("false");
    
    Table table = new Table();
    List<Tr> trlist = new ArrayList<Tr>();
    //
    Tr tr1 = new Tr();
    List<Td> tr1_tdlist1 = new ArrayList<Td>();
    Td tr1_td1 = new Td();
    tr1_td1.setStyle("text-align: center;");
    tr1_tdlist1.add(tr1_td1);
    for (int i = 0; i < questionInfo.getChoice().size(); i++) {
      Td tr1_td = new Td();
      tr1_td
          .setSpan(handleText(questionInfo.getChoice().get(i).getContent(), 0));
      tr1_tdlist1.add(tr1_td);
    }
    
    tr1.setTd(tr1_tdlist1);
    trlist.add(tr1);
    
    //
    Tr tr2 = new Tr();
    List<Td> tr2_tdlist1 = new ArrayList<Td>();
    
    Td tr2_td1 = new Td();
    Prompt tr2_tdp1 = new Prompt();
    tr2_tdp1.setArea("q_title");
    Sequence tr2_tdps1 = new Sequence();
    tr2_tdps1.setSpan(questionInfo.getQuestionNumber() + ".");
    tr2_tdp1.setSequence(tr2_tdps1);
    tr2_tdp1.setSpan(handleText(questionInfo.getTitle(), 0));
    tr2_td1.setPrompt(tr2_tdp1);
    tr2_tdlist1.add(tr2_td1);
    
    for (int i = 0; i < questionInfo.getChoice().size(); i++) {
      Td tr2_td2 = new Td();
      SimpleChoice tr2_tdsc2 = new SimpleChoice();
      tr2_tdsc2.setIdentifier(questionInfo.getChoice().get(i).getName());
      List<Span> tlist = handleText(questionInfo.getChoice().get(i)
          .getContent(), 0);
      for (int n = 0; n < tlist.size(); n++) {
        tlist.get(n).setStyle("display:none;");
      }
      tr2_tdsc2.setSpan(tlist);
      tr2_td2.setSimpleChoice(tr2_tdsc2);
      tr2_tdlist1.add(tr2_td2);
    }
    
    tr2.setTd(tr2_tdlist1);
    trlist.add(tr2);
    
    table.setTr(trlist);
    ci.setTable(table);
    
    ItemBody ib = new ItemBody();
    ib.setChoiceInteraction(ci);
    
    ResponseProcessing rp = new ResponseProcessing();
    
    AssessmentItem ai = new AssessmentItem();
    ai.setResponseDeclaration(rdl);
    ai.setOutcomeDeclaration(od);
    ai.setItemBody(ib);
    ai.setResponseProcessing(rp);
    ai.setClazz("ygpj-table-choice");
    
    ai.setQuesType(QuestionTypeEnum.TABLEQUESTION.getValue()+"");
    String secondIndicator = "";
    String key = "";
    if (questionInfo.getSecondIndex() != null) {
      secondIndicator = questionInfo.getSecondIndex();
    } else {
      secondIndicator = "目录";
    }
    if (questionInfo.getKeyWord() != null) {
      key = questionInfo.getKeyWord();
    } else {
      key = "题目" + questionInfo.getQuestionNumber();
    }
    ai.setQuesNum(questionInfo.getQuestionNumber());
    ai.setKeyword(key);
    ai.setSecondIndex(secondIndicator);
    ai.setSameFlag(questionInfo.getSameFlag());
    ai.setDemension(questionInfo.getDimension());
    ai.setFirstIndex(questionInfo.getFirstIndex());
    ai.setThirdIndex(questionInfo.getThirdIndex());
    ai.setStructure(questionInfo.getStructure());
    if (questionInfo.getDemographic() != null
        && !questionInfo.getDemographic().isEmpty()) {
      ai.setDemographic(questionInfo.getDemographic());
    }
    if(questionInfo.getCountScoreWay() != null && !questionInfo.getCountScoreWay().isEmpty()){
      ai.setScoreWay(questionInfo.getCountScoreWay());
    }
    if(questionInfo.getConstraints() != null && !questionInfo.getConstraints().isEmpty()){
      ai.setConstraints(questionInfo.getConstraints());
    }
    
    JAXBUtil.jaxbObjectToXML(ai, rpkPath + "/item.xml");
    
    doZip(rpkPath + "/item.xml", String.valueOf(questionInfo.getQuestionNumber()));
  }
  
  private void doZip(String path, String num) {
    log.info("doZip !");
    // 读取文件
    File f = new File(path);
    FileInputStream fis = null;
    try {
      fis = new FileInputStream(f);
    } catch (FileNotFoundException e) {
      log.error(e.getMessage());
    }
    BufferedInputStream bis = new BufferedInputStream(fis);
    byte[] buf = new byte[1024];
    int len;
    FileOutputStream fos = null;
    String fileName = "";
    // 考虑到表格题3a 3b 3c等情况出现
    Pattern pattern = Pattern.compile("[a-zA-Z]+");
    String[] strs = pattern.split(num);
    String numPart = strs[0];
    fileName = rpkPath + "/"
        + f.getName().substring(0, f.getName().lastIndexOf(".")) + numPart
        + ".rpk";
    try {
      fos = new FileOutputStream(fileName);
    } catch (FileNotFoundException e) {
      log.error(e.getMessage());
    }
    BufferedOutputStream bos = new BufferedOutputStream(fos);
    ZipOutputStream zos = new ZipOutputStream(bos);// 压缩包
    ZipEntry ze = new ZipEntry(f.getName());// 这是压缩包名里的文件名
    try {
      zos.putNextEntry(ze);// 写入新的 ZIP 文件条目并将流定位到条目数据的开始处
    } catch (IOException e) {
      log.error(e.getMessage());
    }
    
    try {
      while ((len = bis.read(buf)) != -1) {
        zos.write(buf, 0, len);
        zos.flush();
      }
    } catch (IOException e) {
      log.error(e.getMessage());
    }
    pathSourse.add(fileName);
    try {
      if (bis != null) {
        bis.close();
      }
      if (zos != null) {
        zos.close();
      }
      if (bos != null) {
        bos.close();
      }
      if (fos != null) {
        fos.close();
      }
      if (fis != null) {
        fis.close();
      }
    } catch (IOException e) {
      log.error(e.getMessage());
    }
  }
  
  private int getMaxLenOfChoiceContent(QuestionInfo info) {
    int maxLen = 0;
    for (int n = 0; n < info.getChoice().size(); n++) {
      String tempContent = info.getChoice().get(n).getContent();
      tempContent = tempContent.replace("<du>", "").replace("</du>", "")
          .replace("<big>", "").replace("</big>", "").replace("<border>", "")
          .replace("</border>", "").replace("<dot>", "").replace("</dot>", "")
          .replace("<strong>", "").replace("</strong>", "").replace("<u>", "")
          .replace("</u>", "");
      if (tempContent.length() > maxLen) {
        maxLen = tempContent.length();
      }
    }
    return maxLen;
  }
  
  // 生成paper.xml
  private void dealPaper(List<QuestionInfo> questionList, List<String> quesNumHaveJumpList) {
    AssessmentTest at = new AssessmentTest();
    at.setIdentifier("paper");
    at.setTitle("paper");
    
    OutcomeDeclaration od = new OutcomeDeclaration();
    od.setIdentifier("SCORE");
    DefaultValue dv = new DefaultValue();
    dv.setValue("0");
    od.setDefaultValue(dv);
    
    at.setOutcomeDeclaration(od);
    
    TestPart tp = new TestPart();
    tp.setIdentifier("part01");
    tp.setNavigationMode("nonlinear");
    tp.setSubmissionMode("simultaneous");
    TimeLimits tls = new TimeLimits();
    tls.setMinTime("900");
    tls.setMaxTime("1800");
    tp.setTimeLimits(tls);
    
    // 表格题处理
    int itemNum = questionList.size();
    HashMap<Integer,ArrayList<String>> tableNumsMap = new HashMap<Integer,ArrayList<String>>();
    for (int i = 0; i < itemNum; i++) {
      if (questionList.get(i).getQuestionType() == QuestionTypeEnum.TABLEQUESTION
          .getValue()) {
        if (tableNumsMap.containsKey(questionList.get(i).getScreenNumber())) {
          ArrayList<String> temp = tableNumsMap.get(questionList.get(i)
              .getScreenNumber());
          temp.add(questionList.get(i).getQuestionNumber());
          tableNumsMap.put(questionList.get(i).getScreenNumber(), temp);
        } else {
          ArrayList<String> temp = new ArrayList<String>();
          temp.add(questionList.get(i).getQuestionNumber());
          tableNumsMap.put(questionList.get(i).getScreenNumber(), temp);
        }
      }
    }
    
    List<AssessmentSection> aslist = new ArrayList<AssessmentSection>();
    List<AssessmentItemRef> airlist1 = new ArrayList<AssessmentItemRef>();
    AssessmentSection as = null;
    int i = 1;
    int tempJ = 0;
    for (int j = 0; j < itemNum; j++) {
      QuestionInfo tempInfo = questionList.get(j);
      if (tableNumsMap.containsKey(tempInfo.getScreenNumber())) {// 如果是表格题
        // 一组表格题题号
        ArrayList<String> tempNums = tableNumsMap.get(tempInfo.getScreenNumber());
        // 一组表格题的第一题
        if (0 == tempNums.indexOf(tempInfo.getQuestionNumber())) {
          // 处理表格前的题
          if (as != null) {
            as.setAssessmentItemRef(airlist1);
            aslist.add(as);
            airlist1 = new ArrayList<AssessmentItemRef>();
            as = null;
          }
          
          String id = "section";
          if (i < 10) {
            id = id + "0" + i;
          } else {
            id = id + i;
          }
          as = new AssessmentSection();
          as.setIdentifier(id);
          as.setTitle("");
          as.setVisible("true");
          
          RubricBlock block = new RubricBlock();
          block.setView("candidate");
          block.setSpan(handleText(tempInfo.getGuideLanguage(), 0));
          as.setRubricBlock(block);
          
          String th = tempInfo.getQuestionNumber();
          id = "item" + th ;
          
          AssessmentItemRef air = new AssessmentItemRef();
          air.setHref(id + ".rpk");
          air.setIdentifier(id);
          air.setScreen(String.valueOf(tempInfo.getScreenNumber()));
          
          airlist1.add(air);
          
          // as的id值
          i++;
          // 将表格题添加 表格题只有一题的情况
          if (tempNums.size() == tempNums.indexOf(tempInfo.getQuestionNumber()) + 1) {// 如果是最后一题
            as.setAssessmentItemRef(airlist1);
            aslist.add(as);
            airlist1 = new ArrayList<AssessmentItemRef>();
            as = null;
          }
        } else {
          // 表格题非第一题
          String th = tempInfo.getQuestionNumber();
          String id = "item" + th;
          
          AssessmentItemRef air = new AssessmentItemRef();
          air.setHref(id + ".rpk");
          air.setIdentifier(id);
          air.setScreen(String.valueOf(tempInfo.getScreenNumber()));
          
          airlist1.add(air);
          
          // 将表格题添加
          if (tempNums.size() == tempNums.indexOf(tempInfo.getQuestionNumber()) + 1) {// 如果是最后一题
            as.setAssessmentItemRef(airlist1);
            aslist.add(as);
            airlist1 = new ArrayList<AssessmentItemRef>();
            as = null;
          }
        }
      } else { // 如果是其它类型题目
        String num = "";
        String id = "section";
        if (as == null) {                      
          if (i < 10) {
            id = id + "0" + i;
          } else {
            id = id + i;
          }
          
          as = new AssessmentSection();
          as.setIdentifier(id);
          as.setTitle("");
          as.setVisible("true");
          
          i++;
        }
        if (tempJ < quesNumHaveJumpList.size()) {
          num = quesNumHaveJumpList.get(tempJ);
        }
        String realNum = tempInfo.getQuestionNumber();
          
        AssessmentItemRef air = new AssessmentItemRef();
        air.setHref("item" + realNum + ".rpk");
        air.setIdentifier("item" + realNum);
        air.setScreen(String.valueOf(tempInfo.getScreenNumber()));
        
        if (realNum.equals(num)) {
          String jump = tempInfo.getJump();
          String[] jumpArr = jump.trim().split(",");
          List<BranchRule> brlist = new ArrayList<BranchRule>();
          for (int n = 0; n < jumpArr.length; n++) {
            String[] choiceJumpArr = jumpArr[n].split("@");
            BranchRule br1 = new BranchRule();
            QuestionInfo info = getQuestioInfoByQuestionNum(choiceJumpArr[1], questionList);
            if (info.getQuestionType() == QuestionTypeEnum.TABLEQUESTION
                .getValue()) {
              br1.setTarget("item" + info.getSameFlag());
            } else {
              br1.setTarget("item" + choiceJumpArr[1].trim());
            }
            Variable variable1 = new Variable();
            //默认都是RESPONSE0
            variable1.setIdentifier("item" + realNum + ".RESPONSE0");
            BaseValue baseValue1 = new BaseValue();
            baseValue1.setBaseType("identifier");
            baseValue1.setValue(jumpArr[n].split("@")[0].trim());
            Match match1 = new Match();
            match1.setVariable(variable1);
            match1.setBaseValue(baseValue1);
            br1.setMatch(match1);
            brlist.add(br1);
          }
          air.setBranchRule(brlist);
          tempJ++;
        }
        airlist1.add(air);
        as.setAssessmentItemRef(airlist1);
      }
      // 处理表格题后面的题
      if (as != null && j == itemNum - 1) {
        as.setAssessmentItemRef(airlist1);
        aslist.add(as);
        airlist1 = new ArrayList<AssessmentItemRef>();
        as = null;
      }
    }
    tp.setAssessmentSection(aslist);
    at.setTestPart(tp);
    
    JAXBUtil4Paper.jaxbObjectToXML(at, rpkPath + "/paper.xml");
    pathSourse.add(rpkPath + "/paper.xml");
  }
  
  private QuestionInfo getQuestioInfoByQuestionNum(String qNum, List<QuestionInfo> questionList) {
    for (QuestionInfo q : questionList) {
      if (q.getQuestionNumber().equals(qNum)) {
        return q;
      }
    }
    return null;
  }
  
  private String makeRpk() {
    // log.info("makeLastRPK !");
    File ff = new File(rpkPath);
    File[] ffs = ff.listFiles();
    for (File f : ffs) {
      if (f.getName().equals("item.xml")) {
        f.delete();
        break;
      }
    }
    File targetFile = null;
    ZipUtilsForScale zipUtilsForScale = new ZipUtilsForScale();
    try {
      targetFile = zipUtilsForScale.compress(rpkPath);
    } catch (Exception e1) {
      log.error(e1.getMessage());
    }
    return targetFile.getAbsolutePath();
  }
  
  public void delTempFile() {
    File file = new File(rpkPath);
    delFile(file);
    new File(rpkFilePath).delete();
  }
  
  public boolean delFile(File file) {
    if (file.isDirectory()) {
      String[] children = file.list();
      for (int i = 0; i < children.length; i++) {
        boolean success = delFile(new File(file, children[i]));
        if (!success) {
          return false;
        }
      }
    }
    return file.delete();
  }
  
  public boolean deleteDir(File dir) {
    if (dir.isDirectory()) {
        String[] children = dir.list();
        for (int i=0; i<children.length; i++) {
            boolean success = deleteDir(new File(dir, children[i]));
            if (!success) {
                return false;
            }
        }
    }
    // 目录此时为空，可以删除
    return dir.delete();
}
  
  private String makeRpkPath(String workLocation) {
    String uidPath = KeyHolder.getKey();
    String srcPath = workLocation;
    rpkPath = srcPath + File.separator + "temp" + uidPath;
    while ((new File(rpkPath).exists())) {
      rpkPath = srcPath + File.separator + "temp" + uidPath;
    }
    File fileMkdirs = new File(rpkPath);
    fileMkdirs.mkdirs();
    return rpkPath;
  }
  
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
  
//是否匹配到 boolean
private boolean regexFind(String regex, String search) {
 Pattern pattern = Pattern.compile(search);
 Matcher matcher = pattern.matcher(regex);
 return matcher.find();
}
}
