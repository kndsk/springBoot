package com.ly.edu.scale;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import com.ly.edu.common.QuestionTypeEnum;
import com.ly.edu.scale.element.AssessmentItem;
import com.ly.edu.scale.element.AssessmentItemRef;
import com.ly.edu.scale.element.AssessmentSection;
import com.ly.edu.scale.element.AssessmentTest;
import com.ly.edu.scale.element.Prompt;
import com.ly.edu.scale.element.SimpleChoice;
import com.ly.edu.scale.element.Span;
import com.ly.edu.scale.element.Td;
import com.ly.edu.scale.element.Tr;
import com.ly.edu.scale.model.ChoiceInfo;
import com.ly.edu.scale.model.QuestionInfo;
import com.ly.edu.util.KeyHolder;
import com.ly.edu.util.ZipUtilsForScale;

/**
 * @author gangwu3
 *
 */
public class ReadRPKFile {
  private String rpkPath = null;
  private String rpkFilePath = null;
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
  public List<QuestionInfo> readRPKFile(InputStream is, String workLocation) {
    try {
      makeRpkPath(workLocation);
      unzipFile(rpkPath, is);
      File file = new File(rpkPath);
      File[] tempList = file.listFiles();
      for (int i = 0; i < tempList.length; i++) {
       if (tempList[i].isFile() && tempList[i].getName().contains(".rpk")) {
        unzipFile(rpkPath + "/"+tempList[i].getName().substring(0, tempList[i].getName().length()-4), new FileInputStream(tempList[i]));
       }
      }
      AssessmentTest at = JAXBUtil4Paper.jaxbXMLToObject(rpkPath + "/" + "paper.xml");
      List<QuestionInfo> questionInfoList = new ArrayList<QuestionInfo>();
      for(AssessmentSection as:at.getTestPart().getAssessmentSection()){
        for(AssessmentItemRef air:as.getAssessmentItemRef()){
          String identifier = air.getIdentifier();
          AssessmentItem ai = JAXBUtil.jaxbXMLToObject(rpkPath+"/"+identifier+"/item.xml");
          QuestionInfo questionInfo = convertToQuestionInfo(ai, at);
          questionInfoList.add(questionInfo);
        }
      }
      rpkFilePath = makeRpk();
      return questionInfoList;
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    }
  }
  
  
  private QuestionInfo convertToQuestionInfo(AssessmentItem ai, AssessmentTest at){
    QuestionInfo questionInfo = new QuestionInfo();
    String qType = ai.getQuesType();
    questionInfo.setQuestionType(Integer.valueOf(qType));
    String qNum = ai.getQuesNum();
    questionInfo.setQuestionNumber(qNum);
    questionInfo.setDimension(ai.getDemension());
    questionInfo.setFirstIndex(ai.getFirstIndex());
    questionInfo.setSameFlag(ai.getSameFlag());
    questionInfo.setSecondIndex(ai.getSecondIndex());
    questionInfo.setKeyWord(ai.getKeyword());
    questionInfo.setStructure(ai.getStructure());
    
    questionInfo.setConstraints(ai.getConstraints());
    questionInfo.setCountScoreWay(ai.getScoreWay());
    questionInfo.setDemographic(ai.getDemographic());
    questionInfo.setJump(ai.getJump());
    questionInfo.setThirdIndex(ai.getThirdIndex());
    
    if(questionInfo.getQuestionType() == QuestionTypeEnum.SIGLECHOICE.getValue() || questionInfo.getQuestionType() == QuestionTypeEnum.SIGLECHOICEBLANK.getValue()){
      questionInfo = getSingleChoiceQuestionInfo(questionInfo, ai);
    }else if(questionInfo.getQuestionType() == QuestionTypeEnum.MULCHOICE.getValue() || questionInfo.getQuestionType() == QuestionTypeEnum.MULCHOICEBLANK.getValue()){
      questionInfo = getMultiChoiceQuestionInfo(questionInfo, ai);
    }else if(questionInfo.getQuestionType() == QuestionTypeEnum.TABLEQUESTION.getValue()){
      questionInfo = getTableQuestionInfo(questionInfo, at, ai);
    }else{
      questionInfo = getFillBlankQuestionInfo(questionInfo, ai);
    }
     return questionInfo;
  }
  
  private List<String> getStyleStr(String styleStr){
    List<String> style = new ArrayList<String>();
    if(styleStr.contains("display:inline;border-width:thin;border-style:solid;")){
      style.add("<border>");
    }
    if(styleStr.contains("font-size:24px;")){
      style.add("<big>");
    }
    if(styleStr.contains("border-bottom:1px solid #000;")){
      style.add("<u>");
    }
    if(styleStr.contains("border-bottom:thick double black;")){
      style.add("<du>");
    }
    if(styleStr.contains("display:inline;border-bottom:thick dashed black;width:auto;")){
      style.add("<dot>");
    }
    if(styleStr.contains("font-weight:bold;")){
      style.add("<strong>");
    }
    return style;
  }
  
  private String getEndStyleStr(List<String> styleSet1, List<String> styleSet2){
    String endStyle = "";
    Iterator<String> iter = styleSet1.iterator();
    List<String> endList = new ArrayList<String>();
    while(iter.hasNext()){
      String str = iter.next();
      if(!styleSet2.contains(str)){
        endList.add(str);
      }
    }
    for(int i = endList.size()-1; i >= 0; i--){
      endStyle += endList.get(i).substring(0, 1)+"/"+endList.get(i).substring(1);
    }
    return endStyle;
  }
  
  private String getAddStyleStr(List<String> styleSet1, List<String> styleSet2){
    String addStyle = "";
    Iterator<String> iter = styleSet2.iterator();
    while(iter.hasNext()){
      String str = iter.next();
      if(!styleSet1.contains(str)){
        addStyle += str;
      }
    }
    return addStyle;
  }
  
  private QuestionInfo getFillBlankQuestionInfo(QuestionInfo questionInfo, AssessmentItem ai){
    Integer type = questionInfo.getQuestionType();
    List<Span> guideLanguageList = ai.getItemBody().getPrompt().getSpan();
    String guideLanguage = ""; 
    List<String> styleSet = new ArrayList<String>();
    for(Span span : guideLanguageList){
      List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
      String endStyle = getEndStyleStr(styleSet, style);
      String addStyle = getAddStyleStr(styleSet, style);
      styleSet = style;
      if(span.getSpan() == null){
        if(span.getImg() != null){
          String src = span.getImg().getSrc();
          String imgStr = "<img src='"+src + "' />";
          guideLanguage += imgStr;
        }
      }
      guideLanguage += endStyle + addStyle + (span.getSpan()==null?"":span.getSpan());
    }
    questionInfo.setGuideLanguage(guideLanguage);
    String title = "";
    List<Span> titleList = ai.getItemBody().getSpan();
    styleSet = new ArrayList<String>();
    for(Span span : titleList){
      List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
      String endStyle = getEndStyleStr(styleSet, style);
      String addStyle = getAddStyleStr(styleSet, style);
      styleSet = style;
      if(span.getExtendedTextInteraction() == null && span.getTextEntryInteraction() == null){
        if(span.getSpan() == null){
          if(span.getImg() != null){
            String src = span.getImg().getSrc();
            String imgStr = "<img src='"+src + "' />";
            title += imgStr;
          }
        }
        title += endStyle + addStyle + (span.getSpan()==null?"":span.getSpan());
      }else{
        if(type == QuestionTypeEnum.SORTQUESTION.getValue()){
          title += "^&";
        }else if(type == QuestionTypeEnum.FILLINBALK.getValue()){
          title += "#";
        }else if(span.getExtendedTextInteraction() != null){
          title += "$%";
        }else{
          title += "#";
        }
      }
    }
    questionInfo.setTitle(title);
    return questionInfo;
  }
  
  private QuestionInfo getSingleChoiceQuestionInfo(QuestionInfo questionInfo, AssessmentItem ai){
    List<Prompt> promptList = ai.getItemBody().getChoiceInteraction().getPrompt();
    String guideLanguage = "";
    String title = "";
    List<String> styleSet = new ArrayList<String>();
    for(Prompt p: promptList){
      if(p.getArea().equals("introduction_area")){
        List<Span> guideLanguageList = p.getSpan();
        for(Span span : guideLanguageList){
          List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
          String endStyle = getEndStyleStr(styleSet, style);
          String addStyle = getAddStyleStr(styleSet, style);
          styleSet = style;
          if(span.getSpan() == null){
            if(span.getImg() != null){
              String src = span.getImg().getSrc();
              String imgStr = "<img src='"+src + "' />";
              guideLanguage += imgStr;
            }
          }
          guideLanguage += endStyle + addStyle + (span.getSpan()==null?"":span.getSpan());
        }
      }
      if(p.getArea().equals("q_title")){
        List<Span> titleList = p.getSpan();
        styleSet = new ArrayList<String>();
        for(Span span : titleList){
          List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
          String endStyle = getEndStyleStr(styleSet, style);
          String addStyle = getAddStyleStr(styleSet, style);
          styleSet = style;
          if(span.getSpan() == null){
            if(span.getImg() != null){
              String src = span.getImg().getSrc();
              String imgStr = "<img src='"+src + "' />";
              title += imgStr;
            }
          }
          title += endStyle + addStyle + (span.getSpan()==null?"":span.getSpan());
        }
      }
    }
    List<SimpleChoice> simpleChoiceList = ai.getItemBody().getChoiceInteraction().getSimpleChoice();
    List<ChoiceInfo> choiceList = new ArrayList<ChoiceInfo>();
    styleSet = new ArrayList<String>();
    for(SimpleChoice sc : simpleChoiceList){
      ChoiceInfo ci = new ChoiceInfo();
      ci.setName(sc.getIdentifier());
      List<Span> choiceContentList = sc.getSpan();
      String content = "";
      for(Span span:choiceContentList){
        List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
        String endStyle = getEndStyleStr(styleSet, style);
        String addStyle = getAddStyleStr(styleSet, style);
        styleSet = style;
        if(span.getSpan() == null){
          if(span.getImg() != null){
            String src = span.getImg().getSrc();
            String imgStr = "<img src='"+src + "' />";
            content += imgStr;
          }
        }
        content += endStyle + addStyle +  (span.getSpan()==null?"":span.getSpan().replace("______", "#"));
      }
      ci.setContent(content);
      choiceList.add(ci);
    }
    questionInfo.setGuideLanguage(guideLanguage);
    questionInfo.setTitle(title);
    questionInfo.setChoice(choiceList);
    return questionInfo;
  }
  
  private QuestionInfo getMultiChoiceQuestionInfo(QuestionInfo questionInfo, AssessmentItem ai){
    List<Prompt> promptList = ai.getItemBody().getChoiceInteraction().getPrompt();
    String guideLanguage = "";
    String title = "";
    List<String> styleSet = new ArrayList<String>();
    for(Prompt p: promptList){
      if(p.getArea().equals("introduction_area")){
        List<Span> guideLanguageList = p.getSpan();
        for(Span span : guideLanguageList){
          List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
          String endStyle = getEndStyleStr(styleSet, style);
          String addStyle = getAddStyleStr(styleSet, style);
          styleSet = style;
          if(span.getSpan() == null){
            if(span.getImg() != null){
              String src = span.getImg().getSrc();
              String imgStr = "<img src='"+src + "' />";
              guideLanguage += imgStr;
            }
          }
          guideLanguage += endStyle + addStyle + (span.getSpan()==null?"":span.getSpan());;
        }
      }
      if(p.getArea().equals("q_title")){
        List<Span> titleList = p.getSpan();
        styleSet = new ArrayList<String>();
        for(Span span : titleList){
          List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
          String endStyle = getEndStyleStr(styleSet, style);
          String addStyle = getAddStyleStr(styleSet, style);
          styleSet = style;
          if(span.getSpan() == null){
            if(span.getImg() != null){
              String src = span.getImg().getSrc();
              String imgStr = "<img src='"+src + "' />";
              title += imgStr;
            }
          }
          title += endStyle + addStyle + (span.getSpan()==null?"":span.getSpan());
        }
      }
    }
    List<Tr> trList = ai.getItemBody().getChoiceInteraction().getTable().getTbody().getTr();
    List<ChoiceInfo> choiceList = new ArrayList<ChoiceInfo>();
    styleSet = new ArrayList<String>();
    for(Tr tr : trList){
      List<Td> tdList = tr.getTd();
      ChoiceInfo ci = null;
      for(int n = 0; n < tdList.size(); n++){
        Td td = tdList.get(n);
        if(n%2 == 0){
           ci = new ChoiceInfo();
        }
        if(td.getPrompt() != null){
          List<Span> choiceContentList = td.getPrompt().getSpan();
          String content = "";
          for(Span span:choiceContentList){
            List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
            String endStyle = getEndStyleStr(styleSet, style);
            String addStyle = getAddStyleStr(styleSet, style);
            styleSet = style;
            if(span.getSpan() == null){
              if(span.getImg() != null){
                String src = span.getImg().getSrc();
                String imgStr = "<img src='"+src + "' />";
                content += imgStr;
              }
            }
            content += endStyle + addStyle +  (span.getSpan()==null?"":span.getSpan().replace("______", "#"));
            ci.setContent(content);
            choiceList.add(ci);
          }
        }else{
          ci.setName(td.getSimpleChoice().getIdentifier());
        }
      }
    }
    questionInfo.setGuideLanguage(guideLanguage);
    questionInfo.setTitle(title);
    questionInfo.setChoice(choiceList);
    return questionInfo;
  }
  
  private String getGuideLanguageStr(AssessmentTest at, String qNum){
    List<AssessmentSection> asList = at.getTestPart().getAssessmentSection();
    String guideLanguage = "";
    for(AssessmentSection as : asList){
      if(as.getRubricBlock() != null){
        List<AssessmentItemRef> airList = as.getAssessmentItemRef();
        for(AssessmentItemRef air : airList){
          if(air.getIdentifier().equals("item"+qNum)){
            List<Span> guideLanguageList = as.getRubricBlock().getSpan();
            List<String> styleSet = new ArrayList<String>();
            for(Span span : guideLanguageList){
              List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
              String endStyle = getEndStyleStr(styleSet, style);
              String addStyle = getAddStyleStr(styleSet, style);
              styleSet = style;
              if(span.getSpan() == null){
                if(span.getImg() != null){
                  String src = span.getImg().getSrc();
                  String imgStr = "<img src='"+src + "' />";
                  guideLanguage += imgStr;
                }
              }
              guideLanguage += endStyle + addStyle +  (span.getSpan()==null?"":span.getSpan());
            }
            break;
          }
        }
      }
      if(guideLanguage.length() > 0){
        break;
      }
    }
    return guideLanguage;
  }
  
  private QuestionInfo getTableQuestionInfo(QuestionInfo questionInfo, AssessmentTest at, AssessmentItem ai){
    String qNum = questionInfo.getQuestionNumber();
    String guideLanguage = getGuideLanguageStr(at, qNum);
    questionInfo.setGuideLanguage(guideLanguage);
    List<Tr> trList = ai.getItemBody().getChoiceInteraction().getTable().getTr();
    for(Tr tr : trList){
      boolean flag = false;
      List<Td> tdList = tr.getTd();
      for(Td td : tdList){
        if(td.getStyle() != null && td.getStyle().equals("text-align: center;")){
          flag = true;
          break;
        }
      }
      if(flag == true){
        continue;
      }
      tdList = tr.getTd();
      List<ChoiceInfo> choiceList = new ArrayList<ChoiceInfo>();
      for(Td td : tdList){
        if(td.getPrompt() != null){
          List<Span> titleList = td.getPrompt().getSpan();
          List<String> styleSet = new ArrayList<String>();
          String title = "";
          for(Span span : titleList){
            List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
            String endStyle = getEndStyleStr(styleSet, style);
            String addStyle = getAddStyleStr(styleSet, style);
            styleSet = style;
            if(span.getSpan() == null){
              if(span.getImg() != null){
                String src = span.getImg().getSrc();
                String imgStr = "<img src='"+src + "' />";
                title += imgStr;
              }
            }
            title += endStyle + addStyle + (span.getSpan()==null?"":span.getSpan());
          }
          questionInfo.setTitle(title);
        }else{
          SimpleChoice sc = td.getSimpleChoice();
          List<Span> choiceContentList = sc.getSpan();
          List<String> styleSet = new ArrayList<String>();
          String content = "";
          for(Span span:choiceContentList){
            ChoiceInfo ci = new ChoiceInfo();
            ci.setName(sc.getIdentifier());
            List<String> style = span.getStyle()==null?new ArrayList<String>():getStyleStr(span.getStyle());
            String endStyle = getEndStyleStr(styleSet, style);
            String addStyle = getAddStyleStr(styleSet, style);
            styleSet = style;
            if(span.getSpan() == null){
              if(span.getImg() != null){
                String src = span.getImg().getSrc();
                String imgStr = "<img src='"+src + "' />";
                content += imgStr;
              }
            }
            content += endStyle + addStyle +  (span.getSpan()==null?"":span.getSpan());
            ci.setContent(content);
            choiceList.add(ci);
          }
        }
      }
      questionInfo.setChoice(choiceList);
    }
    return questionInfo;
  }
  
  public void unzipFile(String directory, InputStream is) throws Exception{
    try    {        
      ZipInputStream zis = new ZipInputStream(is);
      ZipEntry ze = zis.getNextEntry();
      File parent = new File(directory);
      if (!parent.exists())        {
        parent.mkdirs();
       }        
      while (ze != null)        {
        String name = ze.getName();
        File child = new File(parent, name);
        FileOutputStream output = new FileOutputStream(child);
        byte[] buffer = new byte[10240];
        int bytesRead = 0;
        while ((bytesRead = zis.read(buffer)) > 0)            {
          output.write(buffer, 0, bytesRead);            
          }            
        output.flush();
        output.close();
        ze = zis.getNextEntry();
        }
      zis.close();
      }    catch (IOException e)    {
        
      }
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
  
  private String makeRpk() {
    File targetFile = null;
    File f = new File(rpkPath);
    File[] fs = f.listFiles();
    for(int i = 0 ; i < fs.length; i++){
      if(fs[i].isDirectory()){
        deleteDir(fs[i]);
      }
    }
    ZipUtilsForScale zipUtilsForScale = new ZipUtilsForScale();
    try {
      targetFile = zipUtilsForScale.compress(rpkPath);
    } catch (Exception e1) {
      e1.printStackTrace();
    }
    return targetFile.getAbsolutePath();
  }
}
