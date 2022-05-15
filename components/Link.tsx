import NextLink from 'next/link'
import {ComponentProps} from 'react'

type Props = ComponentProps<typeof NextLink>

const Link = ({children, className, ...props}: Props) => {
  return <NextLink {...props}><a className={className}>{children}</a></NextLink>
}

export default Link
