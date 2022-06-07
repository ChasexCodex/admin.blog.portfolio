import {NextMiddleware, NextResponse} from 'next/server'
import {checkUser} from '@/utils/auth'

export const middleware: NextMiddleware = (req) => {
	const token = req.cookies['Authorization']

	if (checkUser(token)) {
		return NextResponse.next()
	}

	return new Response('Auth required', {
		status: 401,
	})
}