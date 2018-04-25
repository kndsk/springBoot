package com.ly.edu.scale.model;

/**
 * 
 * <p>多选题互斥规则。<p>
 *
 * 创建日期 2017年4月6日<br>
 * @author  ydzhang2<br>
 * @version $Revision$ $Date$
 * @since   1.0.0
 */
public class MagicRule {
    private String primary;
    private String secondary;

    public String getPrimary() {
        return primary;
    }

    public void setPrimary(String primary) {
        this.primary = primary;
    }

    public String getSecondary() {
        return secondary;
    }

    public void setSecondary(String secondary) {
        this.secondary = secondary;
    }
}
