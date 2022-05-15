import {PrismaClient} from '@prisma/client'

// @ts-ignore
const prisma = process.env.NODE_ENV === 'production' || !global.prisma ? new PrismaClient() : global.prisma as PrismaClient

export default prisma
