import NextLink from 'next/link'
import {ComponentProps} from 'react'

type Props = ComponentProps<typeof NextLink>

const Link = ({children, className, prefetch, ...props}: Props) => {
  return <NextLink prefetch={prefetch ?? false} {...props}><a className={className}>{children}</a></NextLink>
}

export default Link
