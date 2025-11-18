export class Statics {

  /**
     * Cloudfront and Route53 Zone ID and name for the zone for data public buckets. decouples stacks to not pass
     * the actual zone between stacks. This param is set by DNSStack and should not be modified after.
     */
  static readonly accountHostedZoneId: string = '/gemeente-nijmegen/account/hostedzone/id';
  static readonly accountHostedZoneName: string = '/gemeente-nijmegen/account/hostedzone/name';
  static readonly accountRootHostedZonePath: string = '/gemeente-nijmegen/account/hostedzone';
  static readonly certificateArn: string = '/riool-storage/cloudfront/certificate/arn';
  static readonly certificatePath: string = '/riool-storage/cloudfront/certificate';

  static readonly wafPath: string = '/cdk/riool-storage/waf';
  static readonly ssmWafAclArn: string = '/cdk/riool-storage/waf/acl-arn';

  static readonly projectName = 'riool-storage';

  static readonly gnBuildCodeStarConnectionArn = 'arn:aws:codestar-connections:eu-central-1:836443378780:connection/9d20671d-91bc-49e2-8680-59ff96e2ab11';

  static readonly deploymentEnvironment = {
    account: '836443378780',
    region: 'eu-central-1',
  };

  static readonly acceptanceEnvironment = {
    account: '766983128454',
    region: 'eu-central-1',
  };

  static readonly productionEnvironment = {
    account: '549334216741',
    region: 'eu-central-1',
  };

  static readonly backupEnvironment = {
    account: '751076321715',
    region: 'eu-west-1', // Different region!
  };

  static readonly backupEnvironmentAcceptance = {
    account: '766983128454', // Same acceptance account!
    region: 'eu-west-1', // Different region!
  };


  // SSM parameters
  static readonly ssmRioolBucketsManagedPolicyArn = '/riool-storage/policies/riool-buckets-managment';
  static readonly ssmBackupRoleArn = '/riool-storage/backup/role-arn';
  static readonly ssmCloudfrontdomainName = '/riool-storage/cloudfront/domainName';
  static readonly ssmCloudfrontDistributionId = '/riool-storage/cloudfront/distributionId';
  static readonly ssmRioolStorageKmsKeyArn = '/riool-storage/kmskey/arn';

  // Statics
  static readonly backupRoleName = 'backup-replication-role';
  static readonly rioolStorageOperatorrManagedPolicyName = 'riool-storage-operator-policy';
  static readonly aliasBackupKmsKey = 'alias/riool-storage-backup-sse-key';

  // Bucket names
  static bucketBackupSuffix = (backup: boolean) => backup ? '-backup' : '';
  static rioolBucket = (branch: string, backup: boolean) => `gemeentenijmegen-riool-${branch}${Statics.bucketBackupSuffix(backup)}`;

  // Variable statics (pun intented)
  static readonly landingzonePlatformOperatorRoleArn = (accountId: string, region: string) => `arn:aws:iam::${accountId}:role/aws-reserved/sso.amazonaws.com/${region}/AWSReservedSSO_lz-platform-operator_*`;


}