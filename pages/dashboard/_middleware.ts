import {NextRequest, NextResponse} from 'next/server'
import {checkUser} from '../../utils/auth'

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')

  if (authHeader) {
    const match = authHeader.match(/Bearer (.*)/)
    const token = match ? match[1] : null

    if(checkUser(token)) {
      return NextResponse.next()
    }
  }

  return new Response('Auth required', {
    status: 401,
  })
}
