/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package btw.winter.controller;

import btw.winter.object.Greeting;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author lee.ky
 */
@Controller
public class Root {
    
    private static final String template = "Hello, %s";
    private final AtomicLong counter = new AtomicLong();
    
    @RequestMapping("/greeting")
    public @ResponseBody Greeting greeting(
            @RequestParam(value="name", required=false, defaultValue="World!") String name
        ) {
        return new Greeting(counter.incrementAndGet(),
                            String.format(template, name));
    }
    
    @RequestMapping(value="/", method=RequestMethod.GET)
    public String index() {
        return "index";
    }

    @RequestMapping(value="/tleaf", method=RequestMethod.GET)
    public String tleaf() {
        return "tleaf";
    }
    
    @RequestMapping("/hello/{name}")
    public @ResponseBody String hello(@PathVariable String name) {
        return "You're in path '" + name + "'!!";
    }
    
}
