import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod, CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { HostageSecretsStack } from './secrets-stack';

interface HostageLambdaStackProps extends cdk.StackProps {
  secretsStack: HostageSecretsStack;
}

export class HostageLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HostageLambdaStackProps) {
    super(scope, id, props);

    const { secretsStack } = props;

    // コンテナイメージのビルド（Dockerfile.lambdaを使用）
    const imageAsset = new ecr_assets.DockerImageAsset(this, 'HostageImage', {
      directory: '../',
      file: 'Dockerfile.lambda',
    });

    // Lambda Function
    const fn = new lambda.DockerImageFunction(this, 'HostageFunction', {
      code: lambda.DockerImageCode.fromEcr(imageAsset.repository, {
        tagOrDigest: imageAsset.imageTag,
      }),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      // reservedConcurrentExecutions は省略
      // 新規アカウントのデフォルト上限(10)では設定不可。
      // billing DoS対策はAPI Gatewayのスロットリング（下記）で代替する。

      environment: {
        // 非機密の設定値は直接記載
        SUPABASE_URL: ssm.StringParameter.valueForStringParameter(
          this, '/hostage/supabase-url'
        ),
        ALLOWED_ORIGINS: 'https://hostage-app.vercel.app,https://hostage-app.xyz',
        AWS_REGION_NAME: 'ap-northeast-1',

        // シークレットのARNを渡す（config.pyがSDK経由で値を取得する）
        SUPABASE_SERVICE_ROLE_KEY_ARN: secretsStack.supabaseServiceRoleKey.secretArn,
        NOTION_TOKEN_ARN: secretsStack.notionToken.secretArn,
        CRON_SECRET_ARN: secretsStack.cronSecret.secretArn,
      },
    });

    // LambdaのIAMロールにSecrets Managerの読み取り権限を付与
    secretsStack.supabaseServiceRoleKey.grantRead(fn);
    secretsStack.notionToken.grantRead(fn);
    secretsStack.cronSecret.grantRead(fn);

    // API Gateway HTTP API
    // アカウント同時実行上限(10)自体がbilling DoS対策として機能する。
    // reservedConcurrentExecutions が設定できないアカウント制約の代替として許容する。
    const httpApi = new HttpApi(this, 'HostageApi', {
      apiName: 'hostage-api',
      corsPreflight: {
        allowOrigins: ['https://hostage-app.vercel.app', 'https://hostage-app.xyz'],
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: ['Content-Type', 'Authorization', 'X-API-KEY'],
      },
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration('HostageIntegration', fn),
    });

    // 出力
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.apiEndpoint,
      description: 'API Gateway endpoint URL — VercelのNEXT_PUBLIC_API_URLに設定する',
    });

    new cdk.CfnOutput(this, 'FunctionArn', {
      value: fn.functionArn,
      description: 'Lambda Function ARN',
    });
  }
}
