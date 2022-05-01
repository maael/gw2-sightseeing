import React from 'react'

export default function useScreenGrab() {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  async function start() {
    try {
      if (videoRef.current)
        videoRef.current.srcObject = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: false,
            displaySurface: 'window',
          } as any,
          audio: false,
        })
    } catch (e) {
      console.error('Error', e)
    }
  }
  async function stop() {
    if (!videoRef.current || !videoRef.current.srcObject || !(videoRef.current.srcObject instanceof MediaStream)) return
    const tracks = videoRef.current.srcObject.getTracks()

    tracks.forEach((track) => track.stop())
    videoRef.current.srcObject = null
  }
  function grab() {
    if (!canvasRef.current || !videoRef.current) return
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    canvasRef.current
      .getContext('2d')!
      .drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
  }
  return {
    elements: (
      <div>
        <button onClick={start}>Start Capture</button>
        <button onClick={stop}>Stop Capture</button>
        <button onClick={grab}>Grab Capture</button>
        <video className="border rounded-sm border-red-200" ref={videoRef}></video>
        <canvas className="border rounded-sm border-red-200" ref={canvasRef} />
      </div>
    ),
  }
}
