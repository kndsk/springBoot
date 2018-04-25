
package com.ly.edu.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddress;

/**
 * @author gangwu3
 * 
 */
public class ReadExcelMergeCellUtil
{
	private static Map<String, List<String>> addToMap(Map<String, List<String>> map, String key, String val)
	{
		if (map.containsKey(key))
		{
			map.get(key).add(val);
		}
		else
		{
			List<String> list = new ArrayList<String>();
			list.add(val);
			map.put(key, list);
		}
		return map;
	}
	
	/**
	 * 读取excel数据
	 * 
	 * @param path
	 */
	public static Map<String, List<String>> readExcelToObj(InputStream is)
	{
		Workbook wb = null;
		try
		{
			wb = WorkbookFactory.create(is);
			Map<String, List<String>> map = readExcel(wb, 0, 0, 0);
			return map;
		}
		catch (InvalidFormatException e)
		{
			e.printStackTrace();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 读取excel文件
	 * 
	 * @param wb
	 * @param sheetIndex
	 *            sheet页下标：从0开始
	 * @param startReadLine
	 *            开始读取的行:从0开始
	 * @param tailLine
	 *            去除最后读取的行
	 */
	private static Map<String, List<String>> readExcel(Workbook wb, int sheetIndex, int startReadLine, int tailLine)
	{
		Sheet sheet = wb.getSheetAt(sheetIndex);
		Row row = null;
		Map<String, List<String>> map = new LinkedHashMap<String, List<String>>();
		for (int i = startReadLine; i < sheet.getLastRowNum() - tailLine + 1; i++)
		{
			row = sheet.getRow(i);
			String key = "";
			String val = "";
			String tval = "";
			for (Cell c : row)
			{
				c.setCellType(Cell.CELL_TYPE_STRING);
				boolean isMerge = isMergedRegion(sheet, i, c.getColumnIndex());
				// 判断是否具有合并单元格
				if (isMerge)
				{
					String rs = getMergedRegionValue(sheet, row.getRowNum(), c.getColumnIndex());
					tval = rs;
				}
				else
				{
					tval = c.getRichStringCellValue().toString();
				}
				if (c.getColumnIndex() == 0)
				{
					key = tval;
				}
				else
				{
					val = tval;
				}
			}
			map = addToMap(map, key, val);
		}
		return map;
	}
	
	/**
	 * 获取合并单元格的值
	 * 
	 * @param sheet
	 * @param row
	 * @param column
	 * @return
	 */
	private static String getMergedRegionValue(Sheet sheet, int row, int column)
	{
		int sheetMergeCount = sheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergeCount; i++)
		{
			CellRangeAddress ca = sheet.getMergedRegion(i);
			int firstColumn = ca.getFirstColumn();
			int lastColumn = ca.getLastColumn();
			int firstRow = ca.getFirstRow();
			int lastRow = ca.getLastRow();
			if (row >= firstRow && row <= lastRow)
			{
				if (column >= firstColumn && column <= lastColumn)
				{
					Row fRow = sheet.getRow(firstRow);
					Cell fCell = fRow.getCell(firstColumn);
					return getCellValue(fCell);
				}
			}
		}
		return null;
	}
	
	/**
	 * 判断指定的单元格是否是合并单元格
	 * 
	 * @param sheet
	 * @param row
	 *            行下标
	 * @param column
	 *            列下标
	 * @return
	 */
	private static boolean isMergedRegion(Sheet sheet, int row, int column)
	{
		
		int sheetMergeCount = sheet.getNumMergedRegions();
		for (int i = 0; i < sheetMergeCount; i++)
		{
			
			CellRangeAddress range = sheet.getMergedRegion(i);
			int firstColumn = range.getFirstColumn();
			int lastColumn = range.getLastColumn();
			int firstRow = range.getFirstRow();
			int lastRow = range.getLastRow();
			if (row >= firstRow && row <= lastRow)
			{
				if (column >= firstColumn && column <= lastColumn)
				{
					return true;
				}
			}
		}
		return false;
	}
	
	/**
	 * 获取单元格的值
	 * 
	 * @param cell
	 * @return
	 */
	private static String getCellValue(Cell cell)
	{
		if (cell == null)
			return "";
		if (cell.getCellType() == Cell.CELL_TYPE_STRING)
		{
			return cell.getStringCellValue();
		}
		else if (cell.getCellType() == Cell.CELL_TYPE_BOOLEAN)
		{
			return String.valueOf(cell.getBooleanCellValue());
		}
		else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA)
		{
			return cell.getCellFormula();
		}
		else if (cell.getCellType() == Cell.CELL_TYPE_NUMERIC)
		{
			return String.valueOf(cell.getNumericCellValue());
		}
		return "";
	}
}
