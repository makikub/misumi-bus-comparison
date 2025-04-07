#!/bin/bash

# AWS S3バケット名
S3_BUCKET="misumi-bus-comparison"

# フロントエンドディレクトリ
FRONTEND_DIR="../frontend"

# まずスクレイピングを実行して最新のデータを取得
cd ../backend/scraper
python main.py
cd ../../deploy

# S3にフロントエンドファイルをアップロード
echo "Syncing frontend files to S3..."
aws s3 sync $FRONTEND_DIR s3://$S3_BUCKET --delete --cache-control="max-age=3600"

# index.htmlのみキャッシュ設定を短く
aws s3 cp $FRONTEND_DIR/index.html s3://$S3_BUCKET/index.html --cache-control="max-age=300"

# データファイルのキャッシュ設定も短く
aws s3 cp $FRONTEND_DIR/data/ s3://$S3_BUCKET/data/ --recursive --cache-control="max-age=300"

echo "Sync completed!"
