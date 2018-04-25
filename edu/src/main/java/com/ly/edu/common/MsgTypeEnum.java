package com.ly.edu.common;

/**
 * Created by gyxu on 16/7/26.
 */

public enum MsgTypeEnum {
    // 创建项目
    PROJECTCREATE {
        @Override
        public int getValue() {
            return 0;
        }

        @Override
        public String getName() {
            return "project_create";
        }
    },

    // 发布项目
    PROJECTPUBLISH {
        @Override
        public int getValue() {
            return 1;
        }

        @Override
        public String getName() {
            return "project_publish";
        }
    },

    // 结束项目
    PROJECTEND {
        @Override
        public int getValue() {
            return 2;
        }

        @Override
        public String getName() {
            return "project_end";
        }
    },

    // 提交答案
    RESULTSUBMIT {
        @Override
        public int getValue() {
            return 3;
        }

        @Override
        public String getName() {
            return "result_submit";
        }
    },

    // 清除答案
    RESULTCLEAR {
        @Override
        public int getValue() {
            return 4;
        }

        @Override
        public String getName() {
            return "result_clear";
        }
    };

    public abstract int getValue();

    public abstract String getName();
}
