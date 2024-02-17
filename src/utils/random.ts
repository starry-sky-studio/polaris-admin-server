export function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

//封装随机函数
// export function generateRandomNumber(length: number): number {
//   const characters = '0123456789'
//   const result = ''
//   const charactersLength = characters.length
//   for (let i = 0; i < length; i++) {}
// }
