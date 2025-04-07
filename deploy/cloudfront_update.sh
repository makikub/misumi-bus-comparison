#!/bin/bash

# CloudFront Distribution ID
CF_DIST_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"

# CloudFrontのキャッシュを削除
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"

echo "CloudFront invalidation created!"
