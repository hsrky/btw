# This is fast scratch and unpolished python source code, 
# which (only) intended to demonstrate websocket connectivity via tornado lib
# in most plain and straight forward way.
import tornado.websocket
import tornado.ioloop
import tornado.web

import os, binascii

import hashlib
import json
import time

class WSHandler(tornado.websocket.WebSocketHandler):
    '''
    Main handler of websocket

    INPUT/OUTPUT contracts:
    
    CLIENT: {msg: {to: '', txt: ''}}
    SERVER: {msg: {frm: '', private: '`true|fase`', txt: '`actual message`', ts: '`timestamp`'}}

    CLIENT: {users: ''}
    SERVER: {users: [[name, id], [name, id]]} (auto send when user in/out)

    SERVER: {err: 'error string'}
    SERVER: {connected: {id: '', name: ''}}
    '''
    users = dict()
    connections = dict()
    memory = dict(anon_count=0)
    def open(self):
        '''
        This will be called when a user try to connect to this server
        ws = new WebSocket('ws://192.168.72.129:8889/?name=your name'); ws.onmessage = function(resp) {...};
        '''
        if len(self.users) >= 20:
            self.write_message(dict(err='Unable to join server, it is full.'))
            self.close()
            return

        # prepare user's basic data
        name = self.get_query_argument('name', '')
        if not name:
            self.memory['anon_count'] = self.memory['anon_count'] + 1
            name = 'Anonymous #{0}'.format(self.memory['anon_count'])
        
        # save to memory for user's connection
        key = self._get_user_key()
        self.connections[key] = self
        self.users[key] = name
        
        # tell users their key and name saved
        reply = dict(connected=dict(id=key, name=name))
        self.write_message(json.dumps(reply))
        
        # tell other users someone joined
        self._notify_user_list_changes()
        print 'Total connections: {0}'.format(len(self.users))
        
    def on_message(self, message):
        '''
        React on message sent by client
        ws.send(JSON.stringify({...}))
        '''
        data = dict()
        
        try:
            data = json.loads(message)
        except:
            print 'Unexpected input, ignore: {0}'.format(message)
            import traceback
            print traceback.print_exc()
            self.write_message(dict(err='Unexpected input data.'))
            return
        
        for d in data:
            if d == 'msg':
                self._action_message(data[d]['txt'], data[d]['to'])
            elif d == 'users':
                self.write_message(self._msg_users_list())
            else:
                pass
                # no other yet

    def on_close(self):
        '''
        When a user disconnect from server
        '''
        key = False
        for c in self.connections:
            if self.connections[c] == self:
                key = c
                break
                
        if key != False:
            del self.connections[c]
            del self.users[c]
            
        self.close()
        
        # tell other users someone left
        self._notify_user_list_changes()
        print 'Connection closed. {0} connection(s) left.'.format(len(self.connections))

    def _get_user_key(self):
        '''
        Generate unique session key for each user
        '''
        key = ''
        try:
            base = '{0}{1}SALT'.format(self.request.remote_ip, self.request.headers['Sec-Websocket-Key'])
            key = hashlib.md5(base).hexdigest()
        except:
            print 'Failed to generate unique key for this request.'
            import traceback
            print traceback.print_exc()
        
        return key
    
    def _msg_users_list(self):
        '''
        return all connected clients
        '''
        users = dict(users=json.dumps(self.users))
        return json.dumps(users)
    
    def _notify_user_list_changes(self):
        '''
        notify all connected clients on client connected/disconnected
        '''
        for c in self.connections:
            self.connections[c].write_message(self._msg_users_list())
    
    def _action_message(self, message, target_user=None):
        '''
        Action: send message to client
        # OUT: {msg: {frm: '', private: '`true|fase`', txt: '`actual message`', ts: '`timestamp`'}}
        '''
        is_private_msg = True if target_user else False
        self_id = self._get_user_key()
        
        resp = dict(msg=dict(frm=self_id, private=is_private_msg, txt=message, ts=int(time.time())))
        
        if target_user:
            # to a user
            conn = self.connections[target_user]
            if conn:
                conn.write_message(resp)
        else:
            # to all            
            for c in self.connections:
                #if c == self_id:
                #    continue   
                self.connections[c].write_message(resp)

# setup routing
application = tornado.web.Application([
    (r'/msg', WSHandler)
])

# entry point
if __name__ == "__main__":
#    import daemon
#    log = open('tornado.' + str(port) + '.log', 'a+')
#    ctx = daemon.DaemonContext(stdout=log, stderr=log,  working_directory='.')
#    ctx.open()
    port = 8889
    application.listen(port)
    print 'Messaging service starting at port {0}'.format(port)
    tornado.ioloop.IOLoop.instance().start()