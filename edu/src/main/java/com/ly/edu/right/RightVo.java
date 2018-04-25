package com.ly.edu.right;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.ly.edu.common.Constant;
import com.ly.edu.domain.SysRight;

public class RightVo {
  
  /**
   * id
   */
  private int id;
  
  /**
   * 名称
   */
  private String name;
  
  /**
   * url（父权限为null）
   */
  private String url;
  
  /**
   * 排序标志
   */
  private int sort;
  
  /**
   * 英语名称
   */
  private String enName;
  
  /**
   * 子权限集合
   */
  private List<RightVo> sonRightVoList;
  
  public int getId() {
    return id;
  }
  
  public void setId(int id) {
    this.id = id;
  }
  
  public String getName() {
    return name;
  }
  
  public void setName(String name) {
    this.name = name;
  }
  
  public String getUrl() {
    return url;
  }
  
  public void setUrl(String url) {
    this.url = url;
  }
  
  public int getSort() {
    return sort;
  }
  
  public void setSort(int sort) {
    this.sort = sort;
  }
  
  public String getEnName() {
    return enName;
  }
  
  public void setEnName(String enName) {
    this.enName = enName;
  }
  
  public List<RightVo> getSonRightVoList() {
    return this.sonRightVoList;
  }
  
  public void setSonRightVoList(List<RightVo> sonRightVoList) {
    this.sonRightVoList = sonRightVoList;
  }
  
  public static List<RightVo> buildRightTree(List<SysRight> rights) {
    List<RightVo> rightVoList = new ArrayList<RightVo>();
    
    Set<SysRight> rightSet = new HashSet<SysRight>(rights);
    
    rights.clear();
    rights.addAll(rightSet);
    
    for (int i = 0; i < rights.size(); i++) {
      SysRight right = rights.get(i);
      int praentId = right.getParentId();
      if (praentId == Constant.RIGHT_ROOT) {
        RightVo rightVo = getRightTree(right, rights);
        rightVoList.add(rightVo);
      }
    }
    
    for (RightVo rightVo : rightVoList) {
      List<RightVo> sonRightVo = rightVo.getSonRightVoList();
      sortRightList(sonRightVo);
      
    }
    sortRightList(rightVoList);
    
    return rightVoList;
  }
  
  /**
   * 排序
   * 
   * @param mapList
   */
  private static void sortRightList(List<RightVo> mapList) {
    Collections.sort(mapList, new Comparator<RightVo>() {
      @Override
      public int compare(RightVo b1, RightVo b2) {
        if (b1.getSort() < b2.getSort()) {
          return -1;
        } else {
          return 1;
        }
      }
    });
  }
  
  /**
   * 递归获取权限树信息
   * 
   * @param column
   * @param columnList
   * @return
   */
  private static RightVo getRightTree(SysRight right, List<SysRight> rights) {
    RightVo rightVo = new RightVo();
    rightVo.setId(right.getId());
    rightVo.setName(right.getRightName());
    rightVo.setUrl(right.getContent());
    rightVo.setSort(right.getRemark());
    rightVo.setEnName(right.getEnName());
    
    Set<RightVo> sonRightSet = new HashSet<RightVo>();
    for (int i = 0; i < rights.size(); i++) {
      SysRight sonRight = rights.get(i);
      if (right.getId() == sonRight.getParentId()) {
        RightVo sonRightVo = getRightTree(sonRight, rights);
        sonRightSet.add(sonRightVo);
      }
    }
    
    rightVo.setSonRightVoList(new ArrayList<RightVo>(sonRightSet));
    return rightVo;
  }
  
}
