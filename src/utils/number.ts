export function extractAndConvertToNumber(str: string): number | null {
  const numericString = str.replace(/[^0-9.-]/g, '')
  const num = parseFloat(numericString)
  return isNaN(num) ? null : num
}
