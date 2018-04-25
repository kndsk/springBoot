
package com.ly.edu.util;

import com.ly.edu.common.Constant;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.*;

import java.awt.Color;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExcelUtil
{
	
	/*
	 * 入参说明 map key值为sheetName value为一个sheet的所有值
	 */
	
	public Map<String, List<List<String>>> getDataMap()
	{
		return dataMap;
	}
	
	public void setDataMap(Map<String, List<List<String>>> dataMap)
	{
		this.dataMap = dataMap;
	}
	
	private Map<String, List<List<String>>>	dataMap	= new HashMap<String, List<List<String>>>();
	
	public static String createExcelFile(Map<String, List<List<String>>> map, String fileName)
	{
		try
		{
			XSSFWorkbook wb = new XSSFWorkbook(); // 创建一个Excel
			for (Map.Entry<String, List<List<String>>> entry : map.entrySet())
			{
				List<List<String>> sheetData = (List<List<String>>) entry.getValue(); // sheetData
				String sheetName = entry.getKey(); // sheetName
				XSSFSheet sheet = wb.createSheet(sheetName);
				sheet.setColumnWidth(1,20*256);
				sheet.setColumnWidth(3,15*256);
				sheet.setColumnWidth(4,15*256);
				sheet.setColumnWidth(5,15*256);
				createSheetHead(sheetData.get(0), sheet, wb); // 默认情况下只有一个头部
				for (int i = 1; i < sheetData.size(); i++)
				{
					createRowCell(wb, sheet, sheetData.get(i), i);
				}
			}
			String filePath = fileName + "." + Constant.OFFICE_EXCEL_2007_POSTFIX;
			File file = new File(filePath);
			if (!file.exists())
			{
				file.createNewFile();
			}
			FileOutputStream out = new FileOutputStream(file);
			wb.write(out);
			if (out != null)
			{
				out.close();
			}
			return file.getAbsolutePath();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	private static void createRowCell(XSSFWorkbook wb, XSSFSheet sheet, List<String> rowData, int j)
	{
		// HSSFCellStyle style = wb.createCellStyle();
		XSSFFont font = wb.createFont();
		font.setFontHeightInPoints((short) 10);// 设置字体大小
		// style.setFont(font);
		// style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		XSSFRow row = null;
		XSSFCell cell = null;
		row = sheet.createRow(j);// 创建一个行
		for (int i = 0; i < rowData.size(); i++)
		{
			cell = row.createCell(i);
			// cell.setCellStyle(style);
			cell.setCellValue(rowData.get(i));
		}
	}
	
	private static void createSheetHead(List<String> headDataList, XSSFSheet sheet, XSSFWorkbook workbook)
	{
		XSSFRow row = sheet.createRow(0);// 创建一个行
		XSSFCellStyle style = workbook.createCellStyle();
		XSSFFont font = workbook.createFont();
		font.setFontHeightInPoints((short) 11);// 设置字体大小
		font.setColor(HSSFColor.WHITE.index);
		style.setFont(font);
		XSSFColor myColor = new XSSFColor(new Color(112, 173, 71));
		style.setFillForegroundColor(myColor);// 设置背景色
		style.setFillPattern(XSSFCellStyle.SOLID_FOREGROUND);
		style.setAlignment(XSSFCellStyle.ALIGN_CENTER);
		row.setHeight((short) 400);
		XSSFCell cell;
		for (int i = 0; i < headDataList.size(); i++)
		{
			cell = row.createCell(i);
			cell.setCellValue(headDataList.get(i));
			cell.setCellStyle(style);
		}
	}
	
	public static String createExcelFile1(Map<String, List<List<String>>> map, String fileName)
	{
		try
		{
			Workbook wb = new SXSSFWorkbook(); // 创建一个Excel
			for (Map.Entry<String, List<List<String>>> entry : map.entrySet())
			{
				List<List<String>> sheetData = (List<List<String>>) entry.getValue(); // sheetData
				String sheetName = entry.getKey(); // sheetName
				Sheet sheet = wb.createSheet(sheetName);
				createSheetHead1(sheetData.get(0), sheet, wb); // 默认情况下只有一个头部
				for (int i = 1; i < sheetData.size(); i++)
				{
					createRowCell1(wb, sheet, sheetData.get(i), i);
				}
			}
			String filePath = fileName + "." + Constant.OFFICE_EXCEL_2007_POSTFIX;
			File file = new File(filePath);
			if (!file.exists())
			{
				file.createNewFile();
			}
			FileOutputStream out = new FileOutputStream(file);
			wb.write(out);
			if (out != null)
			{
				out.close();
			}
			return file.getAbsolutePath();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}
	
	private static void createRowCell1(Workbook wb, Sheet sheet, List<String> rowData, int j)
	{
		// HSSFCellStyle style = wb.createCellStyle();
		Font font = wb.createFont();
		font.setFontHeightInPoints((short) 10);// 设置字体大小
		// style.setFont(font);
		// style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		Row row = null;
		Cell cell = null;
		row = sheet.createRow(j);// 创建一个行
		for (int i = 0; i < rowData.size(); i++)
		{
			cell = row.createCell(i);
			// cell.setCellStyle(style);
			cell.setCellValue(rowData.get(i));
		}
	}
	
	private static void createSheetHead1(List<String> headDataList, Sheet sheet, Workbook workbook)
	{
		Row row = sheet.createRow(0);// 创建一个行
		CellStyle style = workbook.createCellStyle();
		Font font = workbook.createFont();
		font.setFontHeightInPoints((short) 11);// 设置字体大小
		style.setFont(font);
		style.setFillPattern(CellStyle.SOLID_FOREGROUND);
		style.setAlignment(CellStyle.ALIGN_CENTER);
		row.setHeight((short) 400);
		Cell cell;
		for (int i = 0; i < headDataList.size(); i++)
		{
			cell = row.createCell(i);
			cell.setCellValue(headDataList.get(i));
			cell.setCellStyle(style);
		}
	}
	
	public void readExcel(int noDataRowNum, String fileName, InputStream is)
	{
		if (fileName.endsWith(Constant.OFFICE_EXCEL_2003_POSTFIX))
		{
			readTestUserExcel03(noDataRowNum, is);
		}
		else if (fileName.endsWith(Constant.OFFICE_EXCEL_2007_POSTFIX))
		{
			readTestUserExcel07(noDataRowNum, is);
		}
	}
	
	private void readTestUserExcel03(int noDataRowNum, InputStream is)
	{
		HSSFWorkbook hssfWorkbook = null;
		try
		{
			hssfWorkbook = new HSSFWorkbook(is);
			// 逐行获取数据
			for (int i = 0; i < hssfWorkbook.getNumberOfSheets(); i++)
			{
				HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(0);
				List<List<String>> rowList = new ArrayList<List<String>>();
				for (int rowNum = noDataRowNum + 1; rowNum <= hssfSheet.getLastRowNum(); rowNum++)
				{
					HSSFRow hssfRow = hssfSheet.getRow(rowNum);
					if (hssfRow != null && hssfRow.getPhysicalNumberOfCells() <= 0)
					{
						continue;
					}
					List<String> cellList = new ArrayList<String>();
					for (int j = 0; j < hssfRow.getLastCellNum(); j++)
					{
						cellList.add(getCellValue(hssfRow.getCell(j)));
					}
					rowList.add(cellList);
				}
				dataMap.put(hssfSheet.getSheetName(), rowList);
			}
		}
		catch (IOException e)
		{
			e.printStackTrace();
			return;
		}
		finally
		{
			try
			{
				if (is != null)
				{
					is.close();
				}
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
		}
	}
	
	private void readTestUserExcel07(int noDataRowNum, InputStream is)
	{
		XSSFWorkbook xssfWorkbook = null;
		try
		{
			xssfWorkbook = new XSSFWorkbook(is);
			// 模板默认只会有一个sheet
			XSSFRow xssfRow = null;
			for (XSSFSheet xssfSheet : xssfWorkbook)
			{
				List<List<String>> rowList = new ArrayList<List<String>>();
				for (int rowNum = noDataRowNum + 1; rowNum <= xssfSheet.getLastRowNum(); rowNum++)
				{
					xssfRow = xssfSheet.getRow(rowNum);
					if (xssfRow != null && xssfRow.getPhysicalNumberOfCells() <= 0)
					{
						continue;
					}
					List<String> cellList = new ArrayList<String>();
					for (int i = 0; i < xssfRow.getLastCellNum(); i++)
					{
						cellList.add(getCellValue(xssfRow.getCell(i)));
					}
					rowList.add(cellList);
				}
				dataMap.put(xssfSheet.getSheetName(), rowList);
			}
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				if (is != null)
				{
					is.close();
				}
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
		}
	}
	
	private String getCellValue(XSSFCell xssfCell)
	{
		if (xssfCell == null)
		{
			return "";
		}
		else if (xssfCell.getCellType() == XSSFCell.CELL_TYPE_BOOLEAN)
		{
			return String.valueOf(xssfCell.getBooleanCellValue());
		}
		else if (xssfCell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC)
		{
			xssfCell.setCellType(Cell.CELL_TYPE_STRING);
			return String.valueOf(xssfCell.getStringCellValue());
		}
		else if (xssfCell.getCellType() == XSSFCell.CELL_TYPE_BLANK)
		{
			return "";
		}
		else
		{
			return String.valueOf(xssfCell.getStringCellValue());
		}
	}
	
	private String getCellValue(HSSFCell hssfCell)
	{
		if (hssfCell == null)
		{
			return "";
		}
		else if (hssfCell.getCellType() == HSSFCell.CELL_TYPE_BOOLEAN)
		{
			return String.valueOf(hssfCell.getBooleanCellValue());
		}
		else if (hssfCell.getCellType() == HSSFCell.CELL_TYPE_NUMERIC)
		{
			hssfCell.setCellType(Cell.CELL_TYPE_STRING);
			return String.valueOf(hssfCell.getStringCellValue());
		}
		else if (hssfCell.getCellType() == HSSFCell.CELL_TYPE_BLANK)
		{
			return "";
		}
		else
		{
			return String.valueOf(hssfCell.getStringCellValue());
		}
	}
}
