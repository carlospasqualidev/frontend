export function parseLocalDate(date: string) {
  const [year, month, day] = date.substring(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function inputHasTimeStamp(date: string) {
  return date.includes('T');
}
