import * as React from 'react'

function Scroll({
  children,
  className,
  style,
  ...props
}: React.HTMLProps<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      {...props}
      style={{
        borderImageSource: 'url(/images/header.png)',
        borderImageSlice: '49% 20% fill',
        width: '70vw',
        height: '10vh',
        borderWidth: '30px',
        margin: '2vh auto',
        padding: '0px 10px',
      }}
    >
      <div style={{ marginTop: -11, ...style }} className={className}>
        {children}
      </div>
    </div>
  )
}

function Parchment({
  children,
  className,
  style,
  ...props
}: React.HTMLProps<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div
      {...props}
      style={{
        borderImageSource: 'url(/images/bg.png)',
        borderImageSlice: '45% 20% fill',
        width: '100%',
        height: '20vh',
        borderWidth: '50px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          margin: '-30px -10px',
          ...style,
        }}
        className={className}
      >
        {children}
      </div>
    </div>
  )
}

export default function Test() {
  return (
    <div
      style={{
        width: '100%',
        backgroundImage: 'url(/images/main-bg.png)',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'bottom',
        backgroundColor: '#B8D5D2',
        fontFamily: 'Tapestry',
        fontWeight: 'bold',
        color: '#000000',
        fontSize: 18,
      }}
    >
      <Scroll style={{ width: 400 }}>Sightseeing Logs</Scroll>
      <div className="grid grid-cols-2 gap-5 mx-auto max-w-7xl">
        <Parchment>Content</Parchment>
        <Parchment>Content</Parchment>
        <Parchment>Content</Parchment>
        <Parchment>Content</Parchment>
        <Parchment>Content</Parchment>
        <Parchment>Content</Parchment>
      </div>
    </div>
  )
}
