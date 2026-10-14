#!/usr/bin/env python3
"""Servidor estático de open-histories: como http.server, pero con Cache-Control sensato.
HTML/JS/CSS/JSON se revalidan siempre (así un despliegue nuevo se ve al instante, también tras Cloudflare);
fuentes, audio e iconos pueden cachearse un día."""
import http.server
import os
import sys

LONG = ('.woff2', '.mp3', '.png', '.svg')


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        path = self.path.split('?', 1)[0]
        if path.endswith(LONG):
            self.send_header('Cache-Control', 'public, max-age=86400')
        else:
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, *a):  # silencioso
        pass


if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else '.'
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 8090
    os.chdir(root)
    http.server.ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
