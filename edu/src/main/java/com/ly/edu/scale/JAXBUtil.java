package com.ly.edu.scale;

import java.io.File;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.ly.edu.scale.element.AssessmentItem;


public class JAXBUtil {
  public static AssessmentItem jaxbXMLToObject(String path) {
    try {
        JAXBContext context = JAXBContext.newInstance(AssessmentItem.class);
        Unmarshaller un = context.createUnmarshaller();
        AssessmentItem emp = (AssessmentItem) un.unmarshal(new File(path));
        return emp;
    } catch (JAXBException e) {
        e.printStackTrace();
    }
    return null;
}


  public static void jaxbObjectToXML(AssessmentItem ai, String path) {

    try {
        JAXBContext context = JAXBContext.newInstance(AssessmentItem.class);
        Marshaller m = context.createMarshaller();
        m.setProperty(javax.xml.bind.Marshaller.JAXB_ENCODING, "UTF-8");
        //for pretty-print XML in JAXB
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);

        // Write to File
        m.marshal(ai, new File(path));
    } catch (JAXBException e) {
        e.printStackTrace();
    }
}
}
