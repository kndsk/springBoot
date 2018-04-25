package com.ly.edu.mapper;

import com.ly.edu.common.MyMapper;
import com.ly.edu.domain.SchoolRecorder;
import org.apache.ibatis.annotations.Param;

/**
 * Created by admin on 2017/11/21.
 */
public interface SchoolRecorderMapper extends MyMapper<SchoolRecorder> {
    /**
     * ����¼��Ա��Ϣ
     * @param recorder
     * @return
     */
    boolean saveRecorderInfo(SchoolRecorder recorder);

    /**
     * ������ݿ��Ƿ����¼��Ա��Ϣ
     * @param recorder
     * @return
     */
    SchoolRecorder checkRecorderInfo(SchoolRecorder recorder);

    /**
     * ����¼��Ա��Ϣ
     * @param recorder
     * @return
     */
    boolean updateRecorderInfo(SchoolRecorder recorder);

    /**
     * ��ȡ¼ȡ��Ա�������Ϣ
     * @param schoolCode
     * @param exam_room
     * @return
     */
    SchoolRecorder getRecoderInfo(@Param("schoolCode")String schoolCode, @Param("exam_room")String exam_room);
}
