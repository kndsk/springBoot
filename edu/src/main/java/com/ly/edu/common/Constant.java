
package com.ly.edu.common;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class Constant
{
	
	/***************** project state *****************************/
	// 0<--->1--->2--->3
	// 未发布
	public static final int									PROJECT_UN_PUBLISHED			= 0;
	// 已经发布
	public static final int									PROJECT_PUBLISHED				= 1;
	// 结束
	public static final int									PROJECT_OVER					= 2;
	// 统计分析完成
	public static final int									PROJECT_EVALUATED				= 3;
	// 已经发布，结束、统计分析完成
	public static final int									PROJECT_EXCEPT_UN_PUBLISHED		= 11;
	// 结束，统计分析完成
	public static final int									PROJECT_OVER_EVALUATED			= 12;
	/*************************************************************/
	
	/************** task state ************************************/
	// 0---->1
	public static final int									TASK_INITIALIZE					= 0;
	public static final int									TASK_EVALUATED					= 1;
	public static final int									TASK_END						= 2;
	/*************************************************************/
	
	/******** project delete ***************************************************************************/
	// 任务未删除
	public static final int									NOT_DELETE						= 0;
	// 任务删除
	public static final int									DELETE							= 1;
	/****************************************************************************************************/
	
	/********* result state ******************************************************************************/
	// 未考试
	public static final int									BEGIN_PAPER						= 0;
	// 已经考试
	public static final int									END_PAPER						= 1;
	/****************************************************************************************************/
	
	public static final String								TASK_SUFFIX						= "task";
	public static final String								SPLIT							= "_";
	
	/********************************************************************************************/
	/********************************* 以下为测评监管页面使用到的常量类 *************************************/
	
	/**** 测评用时分段 ****/
	public static Map<Integer, String>						TIME_SECTION					= new HashMap<Integer, String>()
																							{
																								private static final long	serialVersionUID	= 1L;
																								{
																									put(0, "first");
																									put(5, "second");
																									put(10, "third");
																									put(15, "fourth");
																									put(20, "fifth");
																									put(25, "sixth");
																									put(30, "seventh");
																								}
																							};
	public static final String								AVG_TIME						= "avgTime";
	public static final String								MIN_TIME						= "minTime";
	public static final String								MAX_TIME						= "maxTime";
	
	/****** 对于每日测评的任务，根据当前时间推算出任务现在测评到第几次 ****/
	public static final Integer								SINGLE_TEST						= 0;
	public static final Integer								DAILY_TEST						= 1;
	
	/****** 测评监管下载明细数据头 ***********************************************************************/
	public static final List<String>						MONITOR_DETAILS					= new ArrayList<String>()
																							{
																								/**
     * 
     */
																								private static final long	serialVersionUID	= 1L;
																								
																								{
																									add("省份");
																									add("地市");
																									add("区县");
																									add("学校");
																									add("年级");
																									add("班级");
																									add("学籍号");
																									add("姓名");
																									add("登录名");
																									add("作答时间");
																									add("作答状态");
																								}
																							};
	
	/********************************************************************************************/

    /**
     * 测评监管-测评进度导出明细数据头_学校模式
     */
    public static final List<String> PROGRESS_DETAILS_SCHOOL = new ArrayList<String>() {
        private static final long serialVersionUID = 1L;
        {
            add("省份");
            add("地市");
            add("区县");
            add("学校");
            add("账号");
            add("完成情况");
            add("状态");
        }
    };

	/**
	 * 测评监管-测评进度导出明细数据头_全国模式
	 */
	public static final List<String> PROGRESS_DETAILS_ALL = new ArrayList<String>() {
		private static final long serialVersionUID = 1L;
		{
			add("序号");
			add("省份");
			add("教师数量");
			add("已完成教师数量");
			add("未完成教师数量");
			add("完成占比");
		}
	};

	/**
	 * 测评监管-测评进度导出明细数据头_省份模式
	 */
	public static final List<String> PROGRESS_DETAILS_PROVINCE = new ArrayList<String>() {
		private static final long serialVersionUID = 1L;
		{
			add("序号");
			add("省份");
			add("地市");
			add("教师数量");
			add("已完成教师数量");
			add("未完成教师数量");
			add("完成占比");
		}
	};

	/**
	 * 测评监管-测评进度导出明细数据头_地市模式
	 */
	public static final List<String> PROGRESS_DETAILS_CITY = new ArrayList<String>() {
		private static final long serialVersionUID = 1L;
		{
			add("序号");
			add("地市");
			add("区县");
			add("教师数量");
			add("已完成教师数量");
			add("未完成教师数量");
			add("完成占比");
		}
	};

	/**
	 * 测评监管-测评进度导出明细数据头_区县模式
	 */
	public static final List<String> PROGRESS_DETAILS_DISTRICT = new ArrayList<String>() {
		private static final long serialVersionUID = 1L;
		{
			add("序号");
			add("区县");
			add("学校");
			add("教师数量");
			add("已完成教师数量");
			add("未完成教师数量");
			add("完成占比");
		}
	};
	
	/********************************************* 统计分析 ***************************************************/
	public static final HashMap<String, CategoryEnum>		CATEGORY_MAP					= new HashMap<String, CategoryEnum>()
																							{
																								private static final long	serialVersionUID	= 1L;
																								{
																									put("学校", CategoryEnum.School);
																									put("区县", CategoryEnum.District);
																									put("地市", CategoryEnum.City);
																									put("整体", CategoryEnum.All);
																								}
																							};
	
	public static final Map<String, Object>					DEFAULT_CATEGORY_MAP			= new LinkedHashMap<String, Object>()
																							{
																								private static final long	serialVersionUID	= 1L;
																								{
																									put("整体", "整体");
																									put("地市", "地市");
																									put("区县", "区县");
																									put("学校", "学校");
																								}
																							};
	
	public static Map<String, Integer>						DEFAULT_SCORE					= new HashMap<String, Integer>()
																							{
																								private static final long	serialVersionUID	= 10L;
																								{
																									put("A", 1);
																									put("B", 2);
																									put("C", 3);
																									put("D", 4);
																									put("E", 5);
																									put("F", 6);
																									put("G", 7);
																									put("H", 8);
																									put("I", 9);
																									put("J", 10);
																									put("K", 11);
																									put("L", 12);
																									put("M", 13);
																									put("N", 14);
																									put("O", 15);
																									put("P", 16);
																									put("Q", 17);
																									put("R", 18);
																									put("S", 19);
																									put("T", 20);
																									put("U", 21);
																									put("V", 22);
																									put("W", 23);
																									put("X", 24);
																									put("Y", 25);
																									put("Z", 26);
																								}
																								
																							};
	
	public static final List<String>						ANALY_ANSWER_DETAILS			= new ArrayList<String>()
																							{
																								/**
     * 
     */
																								private static final long	serialVersionUID	= 1L;
																								
																								{
																									add("省份");
																									add("地市");
																									add("区县");
																									add("学校");
																									add("学籍号");
																									add("登录名");
																									add("问卷名称");
																									add("答卷序号");
																								}
																							};
	public static final List<String>						ANALY_ANSWER_DETAILS1			= new ArrayList<String>()
																							{
																								private static final long	serialVersionUID	= 1L;
																								
																								{
																									add("登录名");
																									add("作答状态");
																								}
																							};
	
	public static final String								U_BEGIN							= "<u>";
	public static final String								U_END							= "</u>";
	public static final String								B_BEGIN							= "<border>";
	public static final String								B_END							= "</border>";
	public static final String								D_BEGIN							= "<du>";
	public static final String								D_END							= "</du>";
	public static final String								BIG_BEGIN						= "<big>";
	public static final String								BIG_END							= "</big>";
	public static final String								STRONG_BEGIN					= "<strong>";
	public static final String								STRONG_END						= "</strong>";
	public static final String								DOT_BEGIN						= "<dot>";
	public static final String								DOT_END							= "</dot>";
	public static final String								P_BEGIN							= "<p>";
	public static final String								P_END							= "</p>";
	
	/********************************************* 统计分析 ***************************************************/
	
	// excel常量
	public static final String								OFFICE_EXCEL_2003_POSTFIX		= "xls";
	public static final String								OFFICE_EXCEL_2007_POSTFIX		= "xlsx";
	public static final String								EMPTY							= "";
	
	// excel的栏位信息和question的字段映射
	public final static HashMap<String, String>				COLUMN_TO_FIELD					= new HashMap<String, String>()
																							{
																								private static final long	serialVersionUID	= 1L;
																								{
																									put("序号*", "tableNumber");
																									put("题目序号*", "questionNumber");
																									put("屏幕序号*", "screenNumber");
																									put("同题标志*", "sameFlag");
																									put("题目指导语", "guideLanguage");
																									put("题目内容*", "title");
																									put("题型*", "questionType");
																									put("选项", "choice");
																									put("限定条件", "constraints");
																									put("计分方式", "countScoreWay");
																									put("题目属性*", "structure");
																									put("群体变量", "demographic");
																									put("跳转", "jump");
																									put("总维度*", "dimension");
																									put("一级指标*", "firstIndex");
																									put("二级指标*", "secondIndex");
																									put("三级指标", "thirdIndex");
																									put("关键词", "keyWord");
																									put("单选题", String.valueOf(QuestionTypeEnum.SIGLECHOICE.getValue()));
																									put("多选题", String.valueOf(QuestionTypeEnum.MULCHOICE.getValue()));
																									put("填空题", String.valueOf(QuestionTypeEnum.FILLINBALK.getValue()));
																									put("单选填空题", String.valueOf(QuestionTypeEnum.SIGLECHOICEBLANK.getValue()));
																									put("多选填空题", String.valueOf(QuestionTypeEnum.MULCHOICEBLANK.getValue()));
																									put("简答题", String.valueOf(QuestionTypeEnum.SHORTANSWER.getValue()));
																									put("排序题", String.valueOf(QuestionTypeEnum.SORTQUESTION.getValue()));
																									put("表格题", String.valueOf(QuestionTypeEnum.TABLEQUESTION.getValue()));
																									put("滑动题", String.valueOf(QuestionTypeEnum.SLIDERQUESTION.getValue()));
																									put("结构性", "0");
																									put("非结构性", "1");
																								}
																							};
	
	// 1月
	public static final int									ONE_MONTH						= 1;
	// 6月
	public static final int									SIX_MONTH						= 6;
	// 12月
	public static final int									TWELVE_MONTH					= 12;
	// 1号
	public static final int									ONE_DAY							= 1;
	// 30号
	public static final int									THIRTH_DAY						= 30;
	// 31号
	public static final int									THIRTH_ONE_DAY					= 31;
	
	// 地图中展示当前数据
	public static final int									ING_TASK						= 1;
	
	// 地图中展示已经结束任务数据
	public static final int									END_TASK						= 0;
	
	// 填空题占位符
	public static final String								FILL_IN_BLANK_PLACEHOLDER		= "#";
	
	// 问答题占位符
	public static final String								ESSAY_QUESTION_PLACEHOLDER		= "$%";
	
	// 排序题占位符
	public static final String								SORT_QUESTION_PLACEHOLDER		= "^&";
	
	// 跳转占位符
	public static final String								JUMP_PLACEHOLDER				= "@";
	
	// 排序题需要换行
	public static final String								SORT_NEED_ENTER					= "\\(\\d+\\)\\.";
	
	public static final String								SORT_NEED_ENTER_WITHOUT_POINT	= "\\(\\d+\\)[^\\.]";
	
	// word中此行是选项的正则表达式即包含 “A.”
	public static final String								OPTION_ITEM						= "[a-zA-Z]+\\.";
	
	// 特殊字符正则表达式
	public static final String								SPECIAL_CHARACTER				= "[^a-zA-Z0-9\u4e00-\u9fa5\\(\\)\\（\\）\\【\\】\\[\\]]+";
	
	// 是否包含字母
	public static final String								HAVE_LETTER						= ".*[a-zA-Z]+.*";
	
	// 整数正则表达式
	public static final String								INTEGER							= "[0-9]+";
	
	// 日志 增、删、改、查看
	public static final int									INSERT							= 1;
	
	public static final int									DEL								= 2;
	
	public static final int									UPDATE							= 3;
	
	public static final int									VIEW							= 4;
	
	public static final String								ASSESSMENT_MANAGE				= "测评管理";
	
	public static final String								PAPER_MANAGE					= "问卷管理";
	
	public static final String								ASSESSMENT_MONITOR				= "测评监管";
	
	public static final String								STATISTICS_ANAlYSIS				= "统计分析";

	public static final String								SPORT_STATISTICS				= "体育录入统计";
	
	public static final String								SCALE_LIBRARY					= "量表库";
	
	public static final String								DECISION_ANALYSIS				= "决策分析";
	
	public static final String								USER_MANAGE						= "用户管理";
	
	public static final int									SUCCESS							= 1;
	
	public static final int									FAIL							= 0;
	
	public static final String								SUCCESS_LOGIN					= "成功登录系统";
	
	public static final int									TEN_THOUSAND					= 10000;
	
	/** 模块 **/
	public static final int									MODULE							= 0;
	
	/** 方法 **/
	public static final int									FUNCTION						= 1;
	
	/** 女 **/
	public static final int									FEMALE							= 0;
	
	public static final String								STR_FEMALE						= "女";
	
	/** 男 **/
	public static final int									MALE							= 1;
	
	public static final String								STR_MALE						= "男";
	
	public static final int									RIGHT_ROOT						= 0;
	
	public static final HashMap<Integer, SectionEnum>		SEC_MAP							= new HashMap<Integer, SectionEnum>()
																							{
																								
																								private static final long	serialVersionUID	= 2033268511063530696L;
																								
																								{
																									put(SectionEnum.PRIMARY.getValue(), SectionEnum.PRIMARY);
																									put(SectionEnum.MIDDLE.getValue(), SectionEnum.MIDDLE);
																									put(SectionEnum.HIGH.getValue(), SectionEnum.HIGH);
																									put(SectionEnum.ALL.getValue(), SectionEnum.ALL);
																								}
																							};
	
	public static final HashMap<Integer, ClientRoleEnum>	CLIENT_ROLE_MAP					= new HashMap<Integer, ClientRoleEnum>()
																							{
																								
																								private static final long	serialVersionUID	= 7219140145012676133L;
																								
																								{
																									put(ClientRoleEnum.HEADER.getValue(), ClientRoleEnum.HEADER);
																									put(ClientRoleEnum.TEACHER.getValue(), ClientRoleEnum.TEACHER);
																									put(ClientRoleEnum.PARENT.getValue(), ClientRoleEnum.PARENT);
																									put(ClientRoleEnum.STUDENT.getValue(), ClientRoleEnum.STUDENT);
																								}
																							};
	
	// 学科常量集合
	public static final HashMap<Integer, SubjectEnum>		SUBJECT_MAP						= new HashMap<Integer, SubjectEnum>()
																							{
																								
																								private static final long	serialVersionUID	= 1L;
																								
																								{
																									put(SubjectEnum.HEADER_PAPER.getValue(), SubjectEnum.HEADER_PAPER);
																									put(SubjectEnum.TEACHER_PAPER.getValue(), SubjectEnum.TEACHER_PAPER);
																									put(SubjectEnum.MASTERTEA_PAPER.getValue(), SubjectEnum.MASTERTEA_PAPER);
																									put(SubjectEnum.MORAL_SOCIAL_PAPER.getValue(), SubjectEnum.MORAL_SOCIAL_PAPER);
																									put(SubjectEnum.SCIENCE_PAPER.getValue(), SubjectEnum.SCIENCE_PAPER);
																									put(SubjectEnum.PHYSICAL_PAPER.getValue(), SubjectEnum.PHYSICAL_PAPER);
																									put(SubjectEnum.BIOLOGICAL_PAPER.getValue(), SubjectEnum.BIOLOGICAL_PAPER);
																									put(SubjectEnum.GEOGRAPHY_PAPER.getValue(), SubjectEnum.GEOGRAPHY_PAPER);
																									put(SubjectEnum.IDEOLOGICAL_PAPER.getValue(), SubjectEnum.IDEOLOGICAL_PAPER);
																									put(SubjectEnum.NATURE_PAPER.getValue(), SubjectEnum.NATURE_PAPER);
																								}
																							};
	
	public static final HashMap<Integer, PaperStateEnum>	PAPER_STATE_MAP					= new HashMap<Integer, PaperStateEnum>()
																							{
																								
																								private static final long	serialVersionUID	= 1L;
																								
																								{
																									put(PaperStateEnum.NOTPUBLISH.getValue(), PaperStateEnum.NOTPUBLISH);
																									put(PaperStateEnum.HADPUBLISH.getValue(), PaperStateEnum.HADPUBLISH);
																									put(PaperStateEnum.HADUSE.getValue(), PaperStateEnum.HADUSE);
																								}
																							};
	
	public static final int									WORD_03							= 3;
	
	public static final int									WORD_07							= 7;
	
	public static final List<String>						PROJECT_SHEET_HEAD				= new ArrayList<String>()
																							{

																								private static final long	serialVersionUID	= 1L;
																								{
																									add("省份");
																									add("地市");
																									add("区县");
																									add("学校");
																									add("角色");
																									add("学科");
																									add("年级");
																									add("班级");
																									add("学籍号");
																									add("姓名");
																									add("登录名");
																									add("密码");
																								}
																							};

	public static final List<String>						SPORT_NATIONAL_SHEET_HEAD				= new ArrayList<String>()
	{

		private static final long	serialVersionUID	= 1L;
		{
			add("序号");
			add("省份");
			add("应测学生数量");
			add("已录入学生数量");
			add("缺测学生数量");
			add("已录入百分比（%）");
			add("状态");
		}
	};
	public static final List<String>						SPORT_PROVINCE_SHEET_HEAD				= new ArrayList<String>()
	{

		private static final long	serialVersionUID	= 1L;
		{
			add("序号");
			add("区县");
			add("应测学生数量");
			add("已录入学生数量");
			add("缺测学生数量");
			add("已录入百分比（%）");
			add("状态");
		}
	};
	public static final List<String>						SPORT_COUNTRY_SHEET_HEAD				= new ArrayList<String>()
	{

		private static final long	serialVersionUID	= 1L;
		{
			add("序号");
			add("学校");
			add("应测学生数量");
			add("已录入学生数量");
			add("缺测学生数量");
			add("已录入百分比（%）");
			add("状态");
		}
	};
	
	// 数据库每条操作条目
	public static final int									DATA_OPR_NUM					= 1000;
	
	// 单选题
	public static final int									SINGLE_CHOICE_TYPE				= 1;
	// 多选题
	public static final int									MULTI_CHOICE_TYPE				= 2;
	// 填空题
	public static final int									FILL_BLANK_TYPE					= 3;
	// 单选填空题
	public static final int									SINGLE_CHOICE_FILL_TYPE			= 4;
	// 多选填空题
	public static final int									MULTI_CHOICE_FILL_TYPE			= 5;
	// 表格题
	public static final int									TABLE_TYPE						= 6;
	// 排序题
	public static final int									SORT_TYPE						= 7;
	// 滑动题
	public static final int									SLIDE_TYPE						= 8;
	// 简答题
	public static final int									SHORT_ANSWER_TYPE				= 9;
	// 量表题
	public static final int									SCALE_TYPE						= 10;
	// 段落
	public static final int									PARAGRAPH_TYPE					= 11;
	
	// 漏选
	public static final String								BM_NOT_ANSWER					= "99";
	// 溢出
	public static final String								BM_NOT_AREA_ANSWER				= "97";
	
	// 选中
	public static final String								CHECKBOX_SELECTED				= "1";
	// 未选中
	public static final String								CHECKBOX_NOT_SELECTED			= "0";
	
	// 未填
	public static final String								NOT_FILL						= "";
	
	// 填空标签
	public static final String								FILL_TAG						= "<input";
	/************体育成绩录入时各测试项目的取值范围***********************/
	//4年级身高最低标准
	public static final float  FOUR_HEIGHT_MIN = 90;
	//4年级身高最高标准
	public static final float  FOUR_HEIGHT_MAX = 170;
	//8年级身高最高标准
	public static final float  EIGHT_HEIGHT_MAX = 200;
	//8年级身高最低标准
	public static final float  EIGHT_HEIGHT_MIN = 100;
	//4年级体重最高标准
	public static final float  FOUR_WEIGHT_MAX = 100;
	//4年级体重最低标准
	public static final float  FOUR_WEIGHT_MIN = 15;
	//8年级体重最高标准
	public static final float  EIGHT_WEIGHT_MAX = 130;
	//8年级体重最低标准
	public static final float  EIGHT_WEIGHT_MIN = 23;
	//4年级握力最低标准
	public static final float  FOUR_POWER_MIN = 0;
	//4年级握力最高标准
	public static final float  FOUR_POWER_MAX = 40;
	//8年级男生握力最高标准
	public static final float  EIGHT_POWER_BOY_MAX = 70;
	//8年级男生握力最低标准
	public static final float  EIGHT_POWER_BOY_MIN = 10;
	//8年级女生握力最低标准
	public static final float  EIGHT_POWER_GIRL_MIN = 5;
	//8年级女生握力最高标准
	public static final float  EIGHT_POWER_GIRL_MAX = 50;
	//视力最低标准
	public static final double  EYE_MIN = 4.0;
	//视力最高标准
	public static final double  EYE_MAX = 5.3;
	//4年级肺活量最低标准
	public static final int  FOUR_BREATH_MIN = 700;
	//4年级肺活量最高标准
	public static final int  FOUR_BREATH_MAX = 3500;
	//8年级男生肺活量最低标准
	public static final int  EIGHT_BREATH_BOY_MIX = 1000;
	//8年级男生肺活量最高标准
	public static final int  EIGHT_BREATH_BOY_MAX = 7000;
	//8年级女生肺活量最低标准
	public static final int  EIGHT_BREATH_GIRL_MIX = 1000;
	//8年级女生肺活量最高标准
	public static final int  EIGHT_BREATH_GIRL_MAX = 4500;
	//4年级50米短跑最短时间
	public static final double  FOUR_FIFTY_METER_MIN = 6.5;
	//4年级50米短跑最长时间
	public static final double  FOUR_FIFTY_METER_MAX = 16.0;
	//8年级50米短跑最短时间
	public static final double  EIGHT_FIFTY_METER_MIX = 6.0;
	//8年级50米短跑最长时间
	public static final double  EIGHT_FIFTY_METER_MAX = 14.0;
	//4年级男生立定跳远最低标准
	public static final int  FOUR_JUMP_BOY_MIN = 80;
	//4年级男生立定跳远最高标准
	public static final int  FOUR_JUMP_BOY_MAX = 230;
	//4年级女生立定跳远最低标准
	public static final int  FOUR_JUMP_GIRL_MIN = 75;
	//4年级女生立定跳远最高标准
	public static final int  FOUR_JUMP_GIRL_MAX = 220;
	//8年级男生立定跳远最低标准
	public static final int  EIGHT_JUMP_BOY_MIN = 90;
	//8年级男生立定跳远最高标准
	public static final int  EIGHT_JUMP_BOY_MAX = 270;
	//8年级女生立定跳远最低标准
	public static final int  EIGHT_JUMP_GIRL_MIN = 85;
	//8年级女生立定跳远最高标准
	public static final int  EIGHT_JUMP_GIRL_MAX = 250;
	//4年级男生15米折返跑次数最低标准
	public static final int  FOUR_FIFTH_METER_BOY_MIN = 0;
	//4年级男生15米折返跑次数最高标准
	public static final int  FOUR_FIFTH_METER_BOY_MAX = 44;
	//4年级女生15米折返跑次数最低标准
	public static final int  FOUR_FIFTH_METER_GIRL_MIN = 0;
	//4年级女生15米折返跑次数最高标准
	public static final int  FOUR_FIFTH_METER_GIRL_MAX = 35;
	//8年级男生15米折返跑次数最低标准
	public static final int  EIGHT_FIFTH_METER_BOY_MIN = 0;
	//8年级男生15米折返跑次数最高标准
	public static final int  EIGHT_FIFTH_METER_BOY_MAX = 70;
	//8年级女生15米折返跑次数最低标准
	public static final int  EIGHT_FIFTH_METER_GIRL_MIN = 0;
	//8年级女生15米折返跑次数最高标准
	public static final int  EIGHT_FIFTH_METER_GIRL_MAX = 42;
    //默认的float类型缺省值
	public static final float DEFAULT_FLOAT_VALUE = -1;
	//默认的int类型缺省值
	public static final int DEFAULT_INT_VALUE = -1;

}
