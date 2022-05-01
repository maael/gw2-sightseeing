import Router from 'next/router'
import React from 'react'
import Scroll from '../primitives/Scroll'

async function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(new File([blob!], 'test.png', { type: 'image/png' })), 'image/png')
  })
}

export default function useScreenGrab() {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [active, setActive] = React.useState(false)
  async function start() {
    try {
      if (videoRef.current) {
        videoRef.current.srcObject = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        })
        setActive(true)
      }
    } catch (e) {
      console.error('Error', e)
      setActive(false)
    }
  }
  async function stop() {
    if (!videoRef.current || !videoRef.current.srcObject || !(videoRef.current.srcObject instanceof MediaStream)) return
    const tracks = videoRef.current.srcObject.getTracks()

    tracks.forEach((track) => track.stop())
    videoRef.current.srcObject = null
    setActive(false)
  }
  React.useEffect(() => {
    async function handle() {
      if (active) {
        await stop()
      }
    }
    Router.events.on('routeChangeStart', handle)
    return () => {
      Router.events.off('routeChangeStart', handle)
    }
  }, [active])
  async function grab() {
    if (!active || !canvasRef.current || !videoRef.current) return
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    canvasRef.current
      .getContext('2d')!
      .drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
    const file = await canvasToFile(canvasRef.current)
    return file
  }
  return {
    elements: (
      <Scroll outerClassName="inline-block">
        {active ? (
          <button type="button" onClick={stop}>
            Stop Captures
          </button>
        ) : (
          <button type="button" onClick={start}>
            Enable Captures
          </button>
        )}
        <video className="border rounded-sm border-red-200 hidden" autoPlay ref={videoRef}></video>
        <canvas className="border rounded-sm border-red-200 hidden" ref={canvasRef} />
      </Scroll>
    ),
    grab,
  }
}
