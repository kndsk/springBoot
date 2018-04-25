
package com.ly.edu.util;

import java.util.Calendar;

public class DataTimeUtils
{
	/**
	 * 接口用时
	 * @param start
	 * @param end
	 * @param msg
	 */
	public static void duration(long startTime, long endTime, String msg)
	{
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(endTime - startTime);
		System.out.println(msg + "---耗时: " + c.get(Calendar.MINUTE) + "分 " + c.get(Calendar.SECOND) + "秒 " + c.get(Calendar.MILLISECOND) + " 毫秒");
	}
	
}
