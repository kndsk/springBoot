package com.ly.edu.filter;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain) throws IOException, ServletException {
        HttpServletRequest hrequest = (HttpServletRequest) request;
        HttpServletResponse hresponse = (HttpServletResponse) response;

        String uri = hrequest.getServletPath();
        if (hrequest.getSession().getAttribute("schoolUser") != null || hrequest.getSession().getAttribute("sysUser") != null) {
            chain.doFilter(request, response);
        } else {
            if (uri.endsWith("login") || uri.equals("/")|| uri.endsWith("login.jsp") || uri.contains("/resources") ) {
                chain.doFilter(request, response);
            } else {
                //hresponse.sendRedirect(hrequest.getContextPath());
                PrintWriter out = hresponse.getWriter();
                out.print("<script>parent.window.location.href='" + hrequest.getContextPath() + "'</script>");
            }
        }
    }

    @Override
    public void destroy() {

    }

}
