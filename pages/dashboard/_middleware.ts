import {NextRequest, NextResponse} from 'next/server'
import {checkUser} from '@/utils/auth'

export async function middleware(req: NextRequest) {

  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  const header = req.cookies['Authorization']

  if (checkUser(header)) {
    return NextResponse.next()
  }

  return new Response('Auth required', {
    status: 401,
  })
}
