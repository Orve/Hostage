import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class HostageSecretsStack extends cdk.Stack {
  public readonly supabaseServiceRoleKey: secretsmanager.Secret;
  public readonly notionToken: secretsmanager.Secret;
  public readonly cronSecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // CRITICAL: 全シークレットにRETAINポリシーを設定する
    // cdk destroy / スタック再作成でも削除されない
    this.supabaseServiceRoleKey = new secretsmanager.Secret(this, 'SupabaseServiceRoleKey', {
      secretName: 'hostage/supabase-service-role-key',
      description: 'Supabase Service Role Key — RLSをバイパスする権限を持つ。Lambda以外からのアクセスを禁止する',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.notionToken = new secretsmanager.Secret(this, 'NotionToken', {
      secretName: 'hostage/notion-token',
      description: 'Notion Integration Token',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.cronSecret = new secretsmanager.Secret(this, 'CronSecret', {
      secretName: 'hostage/cron-secret',
      description: 'Cron APIキー — daily damageエンドポイントの認証に使用',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
  }
}
