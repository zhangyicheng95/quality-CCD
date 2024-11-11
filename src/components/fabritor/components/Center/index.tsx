export default function Center(props: any) {
  const { children, height = 49, style, className, ...rest } = props;

  return (
    <div className={`flex-box ${className}`} {...rest} style={{ height, ...style }} >
      {children}
    </div>
  )
}

export const CenterH = (props: any) => {
  return (
    <Center align="normal" {...props} />
  )
}

export const CenterV = (props: any) => {
  return (
    <Center justify="normal" {...props} />
  )
}