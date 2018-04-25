package com.ly.softdog;

public class dongle{
    static{System.loadLibrary("SoftDongle");}
    public static native String GetAllowOnce(String name, String value);
//    public static void main(String[] args){
//        //System.load("/fullpath/libSoftDongle.so");
//        String name = "VSPP";
//        String value = "VSPP200";
//        if (args.length > 0) name = args[0];
//        if (args.length > 1) value = args[1];
//        String result = dongle.GetAllowOnce(name, value);
//        System.out.println(result);
//    }
}
