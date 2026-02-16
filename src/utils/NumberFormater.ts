// This file is responsible for formatting numbers into a currency format
// @example: NumberFormater.format(1000) => $1,000.00
//  * @param amount - The amount to format.
//  * @returns The formatted currency string.

export const NumberFormater = new Intl.NumberFormat('default', {
  style: 'currency',
  currency: 'USD'
});
