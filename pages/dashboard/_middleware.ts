import {NextRequest, NextResponse} from 'next/server'
import {checkUser} from '../../utils/auth'

export async function middleware(req: NextRequest) {
  const header = req.headers.get("Authorization")

  if (checkUser(header)) {
    return NextResponse.next()
  }

  return new Response('Auth required', {
    status: 401,
  })
}
