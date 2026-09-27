const required = (name: string) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`)
  }

  return value
}

export const getDatabaseUrl = () => required('DATABASE_URL')

export const getStorageConfig = () => ({
  endpoint: required('S3_ENDPOINT'),
  region: required('S3_REGION'),
  bucket: required('S3_BUCKET'),
  accessKeyId: required('S3_ACCESS_KEY_ID'),
  secretAccessKey: required('S3_SECRET_ACCESS_KEY'),
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
})
