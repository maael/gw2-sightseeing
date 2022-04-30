import { getSession } from 'next-auth/react'
import { S3 } from 'aws-sdk'
import { NextApiHandler } from 'next'

const s3 = new S3({
  region: 'eu-west-2',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

const handler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req })
  if (!session) {
    res.status(401).json({ message: 'Requires authorization' })
    return
  }
  const { objectId, keys } = req.body
  const signedUrls = await Promise.all(
    keys.map((key) =>
      s3
        .getSignedUrlPromise('putObject', {
          Bucket: process.env.AWS_S3_BUCKET,
          Key: `${objectId}/${key}`,
          ContentType: 'image/png',
        })
        .then((signedUrl) => ({ signedUrl, key }))
    )
  )
  res.json(signedUrls)
}

export default handler
