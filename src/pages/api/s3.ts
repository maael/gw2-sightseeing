import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextApiHandler } from 'next'

const s3 = new S3Client({ region: 'eu-west-2' })

const handler: NextApiHandler = async (req, res) => {
  const keys = ['test.png']
  const objectId = 'example'
  console.info('test', req.body, process.env.AWS_S3_BUCKET)
  const signedUrls = await Promise.all(
    keys.map((key) =>
      getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${objectId}/${key}`,
        })
      ).then((signedUrl) => ({ signedUrl, key }))
    )
  )
  res.json(signedUrls)
}

export default handler
