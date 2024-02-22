package com.junmo.core.exception;

import com.junmo.core.enums.CodeEnum;

import java.io.Serializable;

/**
 * @author: sucf
 * @date: 2023/1/9 10:38
 * @description:
 */
public class DaoException extends RuntimeException implements Serializable {

    /**
     * 错误码
     *
     * @see com.junmo.core.enums.CodeEnum
     */
    public String code;

    public DaoException(String msg) {
        super(msg);
    }

    public DaoException(Throwable t) {
        super(t);
    }

    public DaoException(String msg, Throwable t) {
        super(msg, t);
    }

    public DaoException(String code, String msg) {
        super(msg);
        this.code = code;
    }

    public DaoException(CodeEnum errorInfo) {
        this(errorInfo.getCode(), errorInfo.getText());
    }

    public String getCode() {
        return code;
    }
}
