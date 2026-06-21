#!/bin/bash
set -e
# 機密値はAWS Secrets Managerに直接入力するか、環境変数で渡すこと
# このファイルをgitにコミットする前にシークレットを削除すること

# Step 1: SSM
aws ssm put-parameter --name "/hostage/supabase-url" --value "https://mvhebepjrmocmbaxgtmu.supabase.co" --type String --region ap-northeast-1 --overwrite
echo "[OK] SSM done"

# Step 2: Secrets Manager（CDKデプロイ済み）
# 実行前に環境変数をセットすること:
#   export SUPABASE_SERVICE_ROLE_KEY="..."
#   export NOTION_TOKEN="..."
#   export CRON_SECRET="..."
aws secretsmanager put-secret-value --secret-id hostage/supabase-service-role-key --secret-string "$SUPABASE_SERVICE_ROLE_KEY" --region ap-northeast-1
echo "[OK] supabase-service-role-key done"
aws secretsmanager put-secret-value --secret-id hostage/notion-token --secret-string "$NOTION_TOKEN" --region ap-northeast-1
echo "[OK] notion-token done"
aws secretsmanager put-secret-value --secret-id hostage/cron-secret --secret-string "$CRON_SECRET" --region ap-northeast-1
echo "[OK] cron-secret done"
