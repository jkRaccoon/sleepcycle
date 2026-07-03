#!/usr/bin/env bash
# sleepcycle 도구를 bal.pe.kr 버킷의 tools/sleepcycle/ prefix 로 배포.
# BalHub 스택 outputs(BucketName/DistributionId)을 재사용.
# subdir-migrate.sh 가 자동 생성한 파일 — pregweek 파일럿 scripts/deploy.sh 패턴 이식.
set -euo pipefail

TOOL="sleepcycle"
SITE_DIR="/Users/jikwangkim/work/balpekr/sleepcycle"
STACK_NAME="BalHub"
AWS_REGION="${AWS_REGION:-ap-northeast-2}"
export AWS_PROFILE="raccoon"

cd "$SITE_DIR"
[[ -d node_modules ]] || npm install --prefer-offline --no-audit --no-fund
BUILD_TARGET=subdir npm run build

BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE" \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)
DIST=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE" \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)

echo "==> sync dist/ → s3://$BUCKET/tools/$TOOL/ (--delete: 이 prefix 한정)"
aws s3 sync "dist/" "s3://$BUCKET/tools/$TOOL/" --delete --profile "$AWS_PROFILE"

echo "==> invalidate /tools/$TOOL/*"
aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/tools/$TOOL/*" --profile "$AWS_PROFILE" --output text >/dev/null
echo "==== $TOOL 배포 완료: https://bal.pe.kr/tools/$TOOL/ ===="
