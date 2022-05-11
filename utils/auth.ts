export const checkUser = (token: string | null) => {
  return token === process.env.ADMIN_TOKEN
}
