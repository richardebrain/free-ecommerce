export const formatCurrency = (value: number | string, currency: string) => {
  let amount: number

  if (typeof value === 'string') {
    const parsed = parseFloat(value.replaceAll(',', ''))
    amount = isNaN(parsed) ? 0 : parsed // Handle invalid number strings
  } else if (typeof value === 'number') {
    amount = value
  } else {
    if (value === undefined) {
      amount = 0
    } else {
      console.log('error', value)
      throw new Error('Invalid value type. Must be a number or a string withour special characters.')
    }
  }

  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency,
  })
}
