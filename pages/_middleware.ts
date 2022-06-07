import {NextRequest, NextResponse} from 'next/server'
import {checkUser} from '@/utils/auth'

export async function middleware(req: NextRequest) {

	const next = (redirect = false) => {
		if (req.nextUrl.pathname === '/' || redirect) {
			return NextResponse.redirect(new URL('/dashboard', req.url))
		}

		if (req.nextUrl.pathname === '/login') {
			return NextResponse.next()
		}

		return NextResponse.next()
	}

	if (process.env.NODE_ENV === 'development') {
		return next()
	}

	const header = req.cookies['Authorization']

	if (checkUser(header)) {
		return next(true)
	}

	return new Response('Auth required', {
		status: 401,
	})
}
