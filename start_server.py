#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
美住町バス比較サイト 簡易Webサーバー

使い方:
1. このスクリプトをプロジェクトのルートディレクトリで実行
2. ブラウザで http://localhost:8000 にアクセス
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# サーバーのポート番号
PORT = 8000

# フロントエンドディレクトリへのパス
FRONTEND_DIR = "frontend"

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # ルートURLの場合はindex.htmlにリダイレクト
        if self.path == '/':
            self.path = '/index.html'
        
        # パスをフロントエンドディレクトリに変更
        if not self.path.startswith('/frontend/'):
            self.path = f'/frontend{self.path}'
        
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

def start_server():
    """簡易Webサーバーを起動"""
    # カレントディレクトリに移動
    os.chdir(Path(__file__).parent)
    
    # サーバーを作成
    handler = MyHttpRequestHandler
    httpd = socketserver.TCPServer(("", PORT), handler)
    
    print(f"美住町バス比較サイト 開発サーバー起動")
    print(f"サーバーが http://localhost:{PORT} で起動しました")
    print(f"終了するにはCtrl+Cを押してください")
    
    # ブラウザで自動的に開く
    webbrowser.open(f"http://localhost:{PORT}")
    
    # サーバーを起動
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nサーバーを停止します...")
        httpd.shutdown()

if __name__ == "__main__":
    start_server()
