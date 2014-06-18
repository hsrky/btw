/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package btw.winter.object;

/**
 *
 * @author lee.ky
 */
public class MessageData {
    private final long id;
    private final String message;
    
    public MessageData(long id, String message) {
        this.id = id;
        this.message = message;
    }

    public long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }
    
}
