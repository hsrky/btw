WebSocket Example
=================
Bare minimum websocket example

Requirements
------------
- Python 2.7+
- Python Tornado Web Server (install: `pip install tornado`) (http://www.tornadoweb.org/)
- [WebSocket compliance browser](http://caniuse.com/websockets)

Run
---
Required two servers:

### 1. Backend ###
```
$> python backend/messaging.py
```

### 2. Client ###
```
$> cd web && python -m SimpleHTTPServer 8000
```
Access page via: `http://<BACKEND_IP>:8000/messaging.html`, and change IP to <BACKEND_IP> before connect.

Code structure
--------------
```
./README.md                   | This file
./backend/messaging.py        | Websocket server (tornado web server)
./web/messaging.html          | Client page
./web/less/messaging.less     | Uncompiled LESS style sheet for client page
./web/javascript/messaging.js | JavaScript that do communications
./web/javascript/lib/*        | Third party JavaScript library.
```
