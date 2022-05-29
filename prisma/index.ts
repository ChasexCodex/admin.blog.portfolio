import {PrismaClient} from '@prisma/client'

const prisma = process.env.NODE_ENV === 'production' || !('prisma' in global) ?
	new PrismaClient() :
	(global as any).prisma as PrismaClient

export {prisma}
