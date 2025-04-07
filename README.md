# 美住町バス比較サイト

美住町バス停（神奈川中央交通）の「茅ヶ崎駅行き」と「辻堂駅行き」のバスを一画面で比較し、どちらが早く来るかを判断できるモバイル向けWebサイトです。

## 概要

このプロジェクトは、美住町バス停での「次のバスはどっち？」という日常的な疑問を解決するために開発されました。

### 主な機能

- 茅ヶ崎駅行きと辻堂駅行きの「あと何分で来るか」を一画面表示
- 平日/土曜/休日ダイヤの自動切り替え
- モバイルファーストで見やすいUI

## 技術スタック

- フロントエンド: HTML + CSS + JavaScript（Vanilla JS）
- バックエンド: Python（BeautifulSoup）
- インフラ: AWS S3 + CloudFront

## プロジェクト構造

```
/
├── frontend/          # フロントエンドコード
│   ├── css/           # スタイルシート
│   ├── js/            # JavaScript
│   └── index.html     # メインページ
├── backend/           # バックエンドコード
│   ├── scraper/       # スクレイピングスクリプト
│   └── data/          # 生成されるデータ
└── deploy/            # デプロイ設定
```

## セットアップ方法

1. リポジトリをクローン: `git clone https://github.com/makikub/misumi-bus-comparison.git`
2. バックエンドセットアップ: `cd misumi-bus-comparison/backend && pip install -r requirements.txt`
3. スクレイピング実行: `python scraper/main.py`
4. フロントエンド確認: `frontend/index.html` をブラウザで開く

## 対象バス情報

- **バス会社**: 神奈川中央交通
- **バス停**: 美住町（茅ヶ崎市）
- **対象路線**:
  - [茅ヶ崎駅行き](https://www.kanachu.co.jp/sp/diagram/timetable01?cs=0000802161-6&nid=00127236)
  - [辻堂駅行き](https://www.kanachu.co.jp/sp/diagram/timetable01?cs=0000801834-12&nid=00127236)
