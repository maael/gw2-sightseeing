/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { MdImage } from 'react-icons/md'
import cls from 'classnames'

const thumb = {
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

export default function Previews({ onChange }: { onChange: (file: File) => void }) {
  const [files, setFiles] = useState<(File & { preview?: string })[]>([])
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
      onChange(acceptedFiles[0])
    },
  })

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          className="inset-0 absolute"
          // Revoke data uri after image is loaded
          onLoad={() => {
            if (file.preview) URL.revokeObjectURL(file.preview)
          }}
        />
      </div>
    </div>
  ))

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      className={cls('container aspect-video bg-slate-50 bg-opacity-10 relative overflow-hidden rounded-md', {
        'border-dashed border-white border-opacity-50 border-2': !thumbs.length,
      })}
    >
      <div
        {...getRootProps({
          className: 'dropzone w-full h-full flex justify-center items-center text-center',
        })}
      >
        <input {...getInputProps()} />
        {thumbs.length ? thumbs : <MdImage className="text-5xl" />}
      </div>
    </section>
  )
}
