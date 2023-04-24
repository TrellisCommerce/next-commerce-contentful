export function formatDate(date: Date): string {
  const newDate = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const formattedDate = newDate.toLocaleDateString('en-US', options)
  return formattedDate
}
