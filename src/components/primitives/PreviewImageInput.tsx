/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdImage } from 'react-icons/md'
import cls from 'classnames'

const thumbStyle = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
} as const

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
} as const

export default function Previews({ existing, onChange }: { existing?: string | File; onChange: (file: File) => void }) {
  const [file, setFile] = useState<File>()
  const [preview, setPreview] = useState<string>()
  useEffect(() => {
    if (file) setPreview(URL.createObjectURL(file))
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])
  useEffect(() => {
    if (typeof existing === 'string') {
      setPreview(`https://${process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_DOMAIN}/${existing}`)
    } else if (existing instanceof File) {
      setFile(existing)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      const acceptedFile = acceptedFiles[0]
      setFile(acceptedFile)
      onChange(acceptedFiles[0])
    },
  })

  const thumb = preview ? (
    <div style={thumbStyle}>
      <div style={thumbInner}>
        <img
          src={preview}
          className="inset-0 absolute"
          // Revoke data uri after image is loaded
          onLoad={() => {
            if (preview) URL.revokeObjectURL(preview)
          }}
        />
      </div>
    </div>
  ) : (
    <MdImage className="text-5xl" />
  )

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      className={cls('container aspect-video bg-slate-50 bg-opacity-10 relative overflow-hidden rounded-md', {
        'border-dashed border-white border-opacity-50 border-2': !thumb,
      })}
    >
      <div
        {...getRootProps({
          className: 'dropzone w-full h-full flex justify-center items-center text-center',
        })}
      >
        <input {...getInputProps()} />
        {thumb}
      </div>
    </section>
  )
}
