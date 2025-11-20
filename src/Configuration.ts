import { aws_s3 as s3 } from 'aws-cdk-lib';
import { Statics } from './Statics';

/**
 * Custom Environment with obligatory accountId and region
 */
export interface Environment {
  account: string;
  region: string;
}

export interface Configurable {
  configuration: Configuration;
}
export interface Configuration {
  /**
   * The git branch name to which this configuration applies.
   */
  branchName: string;


  /**
   * Code star connection arn in the deployment environment
   */
  codeStarConnectionArn: string;

  /**
   * Deployment environment
   */
  deploymentEnvironment: Environment;

  /**
   * Target environment
   */
  targetEnvironment: Environment;

  /**
   * The environment to replicate objects to
   */
  backupEnvironment: Environment;

  /**
   * Setup the buckets used for riool storage
   */
  buckets: RioolBucketConfig[];

  /**
   * A list of KMS Key ARNs that the backup role
   * is allowed to user (in different AWS accounts).
   * @default no allow statment for kms keys is added
   */
  allowedToUseKmsKeyArns?: string[];

  /**
   * IAM User ids that are available for accessing buckets
   * (includes IAM access key and secret key)
   */
  users?: string[];
}


export interface CloudFrontBucketConfig {
  exposeTroughCloudfront: boolean; //default false
  cloudfrontBasePath: string; //base path for the url of the bucket-contents
}
export interface RioolBucketConfig {
  cdkId: string;
  name: string;
  /**
   * If undefined no backup is configured for this bucket
   */
  backupName?: string;
  description: string;
  bucketConfiguration: s3.BucketProps;
  cloudfrontBucketConfig?: CloudFrontBucketConfig;

  /**
   * Define which users have access to the bucket
   * r = read only
   * w = write only
   * rw = read and write (no delete)
   * rwd = read, write and delete
   */
  iamUserAccess?: Record<string, 'r' | 'w' | 'rw' | 'rwd'>;
}


export const configurations: { [key: string]: Configuration } = {
  acceptance: {
    branchName: 'acceptance',
    codeStarConnectionArn: Statics.gnBuildCodeStarConnectionArn,
    deploymentEnvironment: Statics.deploymentEnvironment,
    targetEnvironment: Statics.acceptanceEnvironment,
    backupEnvironment: Statics.backupEnvironmentAcceptance,
    buckets: getBucketConfig('acceptance'),
    users: ['brutis', 'supplier'],
  },
  main: {
    branchName: 'main',
    codeStarConnectionArn: Statics.gnBuildCodeStarConnectionArn,
    deploymentEnvironment: Statics.deploymentEnvironment,
    targetEnvironment: Statics.productionEnvironment,
    backupEnvironment: Statics.backupEnvironment,
    buckets: getBucketConfig('main'),
    allowedToUseKmsKeyArns: [
      'arn:aws:kms:eu-west-1:751076321715:key/0e9efe8a-71b6-4218-b94d-8f9df0262674',
    ],
    users: ['brutis', 'supplier'],
  },
};

export function getConfiguration(buildBranch: string) {
  const config = configurations[buildBranch];
  if (!config) {
    throw Error(`No configuration for branch ${buildBranch} found. Add a configuration in Configuration.ts`);
  }
  return config;
}


/**
 * Configuration for buckets
 * Note encryption is managed in stacks
 * @param branchName
 * @returns
 */
export function getBucketConfig(branchName: string): RioolBucketConfig[] {
  return [
    {
      cdkId: 'riool-bucket',
      name: Statics.rioolBucket(branchName, false),
      backupName: Statics.rioolBucket(branchName, true),
      description: 'Riool inspectie video data',
      bucketConfiguration: {
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        enforceSSL: true,
        versioned: true,
      },
      iamUserAccess: {
        brutis: 'rwd',    // Full access: read, write, delete
        supplier: 'rw',   // Limited access: read, write (no delete)
      },
    },
  ];
}