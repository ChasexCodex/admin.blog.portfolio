export const FormatNew = <T>({id, name}: {id: number | string, name: string}) => {
  return id === name ? {name} : {id}
}

export * from './auth'
export * from './http'
export {default as prisma} from './prisma'
export * from './string'
