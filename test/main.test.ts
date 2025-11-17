import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { getBucketConfig } from '../src/Configuration';
import { Statics } from '../src/Statics';
import { StorageStack } from '../src/StorageStack';

const testEnv = {
  account: '123456789012',
  region: 'eu-central-1',
};

test('StackHasBuckets', () => {
  const app = new App();
  const stack = new StorageStack(app, 'stack', {
    configuration: {
      branchName: 'test',
      codeStarConnectionArn: Statics.gnBuildCodeStarConnectionArn,
      deploymentEnvironment: testEnv,
      targetEnvironment: testEnv,
      backupEnvironment: testEnv,
      buckets: getBucketConfig('test'),
      users: ['brutis'],
    },
  });

  const template = Template.fromStack(stack);
  template.resourceCountIs('AWS::S3::Bucket', 2);
});


test('Bucket names (without backup)', () => {
  expect(Statics.rioolBucket('test', false)).toBe('gemeentenijmegen-riool-test');
});

test('Bucket names (with backup)', () => {
  expect(Statics.rioolBucket('test', true)).toBe('gemeentenijmegen-riool-test-backup');
});