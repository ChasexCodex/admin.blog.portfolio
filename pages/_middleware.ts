import {NextResponse, NextMiddleware} from 'next/server'
import {checkUser} from '@/utils/auth'

export const middleware: NextMiddleware = (req) => {

	const header = req.cookies['Authorization']
	const dev = process.env.NODE_ENV === 'development' && false
	const auth = checkUser(header)

	const pathname = req.nextUrl.pathname

	if (auth || dev) {
		if (pathname === '/' || (pathname === '/login' && dev)) {
			return NextResponse.redirect(new URL('/dashboard', req.url))
		}

		return NextResponse.next()
	}

	if (pathname === '/login') {
		return NextResponse.next()
	}

	return new Response('Auth required', {
		status: 401,
	})
}
