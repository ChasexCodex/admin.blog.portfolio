import {NextRequest, NextResponse} from 'next/server'
import {checkUser} from '@/utils/auth'

export async function middleware(req: NextRequest) {

	const next = () => {
		if (req.nextUrl.pathname === '/') {
			return NextResponse.redirect(new URL('/dashboard', req.url))
		}
		return NextResponse.next()
	}

	if (process.env.NODE_ENV === 'development') {
		return next()
	}

	const header = req.cookies['Authorization']

	if (checkUser(header)) {
		return next()
	}

	return new Response('Auth required', {
		status: 401,
	})
}
