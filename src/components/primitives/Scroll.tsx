import * as React from 'react'

export default function Scroll({
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
        borderImageSource: 'url(/images/header.png)',
        borderImageSlice: '49% 20% fill',
        borderWidth: '30px',
        ...outerStyle,
      }}
      className={outerClassName}
    >
      <div style={{ marginTop: -6, ...style }} className={className}>
        {children}
      </div>
    </div>
  )
}
