package com.ly.edu.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

public class ObjectUtils {
  public static Object deepClone(Object cloneObj) {
    // 将对象写到流里
    ByteArrayOutputStream bo = new ByteArrayOutputStream();
    ObjectOutputStream oo = null;
    ObjectInputStream oi = null;
    Object obj = null;
    try {
      oo = new ObjectOutputStream(bo);
      oo.writeObject(cloneObj);
      // 从流里读出来
      ByteArrayInputStream bi = new ByteArrayInputStream(bo.toByteArray());
      oi = new ObjectInputStream(bi);
      obj = oi.readObject();
    } catch (IOException e) {
      e.printStackTrace();
    } catch (ClassNotFoundException e) {
      e.printStackTrace();
    }
    return obj;
  }
}
