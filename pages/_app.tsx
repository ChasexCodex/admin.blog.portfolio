import type {ReactElement, ReactNode} from 'react'
import type {NextPage} from 'next'
import type {AppProps} from 'next/app'
import '@/styles/globals.css'
import {MainLayout} from '@/layouts'

type NextPageWithLayout = NextPage & {
  Layout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({Component, pageProps}: AppPropsWithLayout) {
  const Layout = Component.Layout ?? MainLayout

  return Layout(<Component {...pageProps} />)
}
