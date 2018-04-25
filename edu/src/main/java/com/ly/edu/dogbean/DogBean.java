package com.ly.edu.dogbean;

import com.ly.softdog.dongle;
import org.springframework.stereotype.Component;

import java.util.Date;

/**
 * Created by Administrator on 2016/9/2.
 */

public class DogBean {

    private Date expireTime;

    private String dogVirity;

    public Date getExpireTime() {
        return expireTime;
    }

    public String getDogVirity() {
        if (dogVirity == null) {
            String result = dongle.GetAllowOnce("PRODUCT", "MANAGER10");
            if (result.equals("OK")) {
                Date now = new Date();
                expireTime = new Date(now.getTime() + 1000 * 60 * 10);
                dogVirity = result;
                return result;
            }
        }
        return dogVirity;
    }

    public boolean isExpire() {
        Date now = new Date();
        if (now.getTime() > expireTime.getTime()) {
            dogVirity = null;
            return true;
        }
        return false;
    }

    public void setDogVirity(String dogVirity) {
        this.dogVirity = dogVirity;
    }
}
