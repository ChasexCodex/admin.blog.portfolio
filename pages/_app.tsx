import {ReactElement, ReactNode} from 'react'
import {NextPage} from 'next'
import {AppProps} from 'next/app'
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

	if (Component.displayName === 'ErrorPage') {
		return <Component {...pageProps}/>
	}

	return Layout(<Component {...pageProps} />)
}
