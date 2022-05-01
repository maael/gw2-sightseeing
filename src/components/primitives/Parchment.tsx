import * as React from 'react'

export default function Parchment({
  children,
  style,
  outerStyle,
  outerClassName,
  className,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  children: React.ReactNode
  outerStyle?: React.CSSProperties
  outerClassName?: string
}) {
  return (
    <div
      {...props}
      style={{
        borderImageSource: 'url(/images/bg.png)',
        borderImageSlice: '45% 20% fill',
        borderWidth: '50px',
        margin: '0 auto',
        ...outerStyle,
      }}
      className={outerClassName}
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
