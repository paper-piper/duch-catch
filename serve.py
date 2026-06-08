import os, sys
os.chdir('/Users/yoyo/Documents/duck-game')
port = int(os.environ.get('PORT', 8742))
import http.server, socketserver
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", port), Handler) as httpd:
    httpd.serve_forever()
