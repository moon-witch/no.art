import { S3Client } from '@aws-sdk/client-s3'
import { getStorageConfig } from './environment'

let s3Client: S3Client | undefined

export const useS3 = () => {
  if (s3Client) {
    return s3Client
  }

  const config = getStorageConfig()
  s3Client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    forcePathStyle: config.forcePathStyle,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  return s3Client
}

export const getAssetsBucket = () => getStorageConfig().bucket
