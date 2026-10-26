# Serveur de dev : comme `python -m http.server`, mais sans cache navigateur
# (sinon les modules JS modifiés restent en cache et l'app affiche une ancienne version).
import functools
import http.server
import os
import sys


class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8766
bind = sys.argv[2] if len(sys.argv) > 2 else '127.0.0.1'
handler = functools.partial(NoCache, directory=os.path.dirname(os.path.abspath(__file__)))
http.server.ThreadingHTTPServer((bind, port), handler).serve_forever()
