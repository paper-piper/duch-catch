import http.server
import webbrowser
import os

PORT = 8000
DIR  = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIR)

webbrowser.open(f'http://localhost:{PORT}')

http.server.test(
    HandlerClass=http.server.SimpleHTTPRequestHandler,
    port=PORT,
    bind='127.0.0.1',
)
