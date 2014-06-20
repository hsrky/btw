/**
 * This is fast scratch and unpolished JavaScript source code, 
 * which (only) intended to demonstrate websocket connectivity in 
 * most plain and straight forward way.
 
 * INPUT/OUTPUT contracts:
 
 * CLIENT: {msg: {to: '', txt: ''}}
 * SERVER: {msg: {frm: '', private: '`true|fase`', txt: '`actual message`', ts: '`timestamp`'}}

 * CLIENT: {users: ''}
 * SERVER: {users: [[name, id], [name, id]]} (auto send when user in/out)

 * SERVER: {err: 'error string'}
 * SERVER: {connected: {id: '', name: ''}}
**/

var currentSessionId = null; // unique user id of current user
var allUsers = null; // a dict of users currently logged on
var showMessage = function(from, from_id, txt, ts, isSystemMessage) {
    // message received and show to user in dialog way
    var sys = isSystemMessage ? 'system' : '';  // need to distinguish system message and user message.
    var temp = $($.t('\
                <div class="message-container {from_id}"> \
                    <div class="from {sys}">{from}</div>: \
                    <div class="text {sys}" title="{ts}">{txt}</div> \
                </div>\
                ', {from_id: from_id, ts: ts.toLocaleString(), sys: sys}));
    $('.from', temp).text(from);
    $('.text', temp).text(txt);
    
    var conv = $('.conversation');
    conv.append(temp).scrollTop(conv[0].scrollHeight);
};

var msgHandle = function(action, args) {
    // handling instruction/message received
    if(action === 'users') {
        var data = JSON.parse(args);
        allUsers = data;
        var list = $('.user-list');
        list.children().remove();
        
        for(var user in data) {
            var name = data[user];
            if(user === currentSessionId) {
                name += ' (You)';
            }
            
            list.append($('<li>').prop('id', user).text(name));
        }
        
    } else if (action === 'msg') {
        
        var from = allUsers[args.frm],
            txt = args.txt,
            ts = new Date(parseInt(args.ts, 10) * 1000);
        
        if(args.frm === currentSessionId) {
            from += ' (You)';
        }
        showMessage(from, args.frm, txt, ts, false);
        
    } else if (action === 'err') {
        showMessage('[SYSTEM]', 'system', args, new Date(), true);
        
    } else if (action === 'connected') {
        currentSessionId = args.id;
    }
};

var wsHandle = {
    // handling communication with backend and dispatch valid message to `msgHandle'
    ws: null,  // websocket instance saved here
    bind: function() {
        wsHandle.ws.onmessage = wsHandle.onmessage;
        wsHandle.ws.onerror = wsHandle.onerror;
        wsHandle.ws.onclose = wsHandle.onclose;
        wsHandle.ws.onopen = wsHandle.onopen;
    },
    onmessage: function(resp) {
        var data = JSON.parse(resp.data);
        for(var d in data) {
            msgHandle(d, data[d]);
        }
    },
    
    onerror: function(resp) {
        console.log('Unexpected error', resp);
        var msg = 'Unexpected error: ' + resp;
        showMessage('[SYSTEM]', 'system', msg, new Date(), true);
    }, 
    
    onclose: function(resp) {
        $('.btn-send', '.messaging').prop('disabled', true);
        $('.user-list').children().remove();
        var connect_btn = $('.btn-connect', '.connect');
        connect_btn.attr('value', 'Connect');
        connect_btn.prop('disabled', false);
    },
    
    onopen: function(resp) {
        var connect_btn = $('.btn-connect', '.connect');
        connect_btn.attr('value', 'Disconnect');
        connect_btn.prop('disabled', false);
        $('.btn-send', '.messaging').prop('disabled', false);
    }
};

var clickHandle = {
    // Mapping functionalities and UI's clicks
    leftPanelBar: function() {
        var left = $(this),
            targetMargin = left.css('margin-left'),
            margin = parseFloat(targetMargin.replace('px', ''), 10);
        
        if(margin >= 0) {
            // auto get width percentage
            var marginPercentage = parseInt(left.css('width'), 10) / parseInt($('html').css('width'), 10);
            targetMargin = '-' + marginPercentage * 100 + '%';
            
        } else if (margin < 0) {
            targetMargin = '0px';
            
        } 
        
        left.animate({'margin-left': targetMargin}, 350);
    },
    
    connect_disconnect: function() {
        if($(this).val() === 'Connect') {
            clickHandle.connect($(this));
        } else {
            clickHandle.disconnect($(this));
        }
    },
    
    disconnect: function($btn) {
        if(wsHandle.ws) {
            wsHandle.ws.close();
        }
    },
    
    connect: function($btn) {
        //y = new WebSocket('ws://192.168.72.129:8889/msg?name=dsds')
        var $scope = $('.connect'),
            ip = $('.ip', $scope).val(),
            port = $('.port', $scope).val(),
            name = $('.name', $scope).val(),
            url = 'ws://' + ip + ':' + port + '/msg';
        
        if(name) {
            url += '?name=' + name;
        }
        
        if(wsHandle.ws) {
            wsHandle.ws.close();
            wsHandle.ws = null;
        }
        
        // here we connect to websocket, and instance are saved in `wsHandle`.`ws'
        wsHandle.ws = new WebSocket(url);
        wsHandle.bind();
        $btn.prop('disabled', true);
    },
    
    send: function() {
        var msg = $('.text', $('.messaging'));
        if(wsHandle.ws) {
            var obj = {msg: {to: '', txt: msg.val()}};
            wsHandle.ws.send(JSON.stringify(obj));
            msg.val('');
        }
    }
};

$(document).ready(function() {
    // entry point
    $('.left-panel').click(clickHandle.leftPanelBar);
    $('.btn-connect', $('.connect')).click(clickHandle.connect_disconnect);
    $('.btn-send', $('.messaging')).click(clickHandle.send);
});