package com.ly.edu.scale;

import java.io.File;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import com.ly.edu.scale.element.AssessmentTest;

public class JAXBUtil4Paper {
  public static AssessmentTest jaxbXMLToObject(String path) {
    try {
        JAXBContext context = JAXBContext.newInstance(AssessmentTest.class);
        Unmarshaller un = context.createUnmarshaller();
        AssessmentTest emp = (AssessmentTest) un.unmarshal(new File(path));
        return emp;
    } catch (JAXBException e) {
        e.printStackTrace();
    }
    return null;
}


  public static void jaxbObjectToXML(AssessmentTest ai, String path) {

    try {
        JAXBContext context = JAXBContext.newInstance(AssessmentTest.class);
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
