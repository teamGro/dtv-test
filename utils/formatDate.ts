/**
 * Форматирует дату ISO в читаемый русский формат, как в макетах (например, "21 сентября" или "21 сентября 2024")
 */
export function formatDate(isoString?: string | null): string {
  if (!isoString) return ''

  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return isoString

    const currentYear = new Date().getFullYear()
    const targetYear = date.getFullYear()

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long'
    }

    // Если год отличается от текущего, добавляем и год
    if (targetYear !== currentYear) {
      options.year = 'numeric'
    }

    return new Intl.DateTimeFormat('ru-RU', options).format(date)
  } catch {
    return isoString
  }
}

/**
 * Преобразует ISO дату в формат для инпутата datetime-local (YYYY-MM-DDTHH:mm)
 */
export function toDatetimeLocal(isoString?: string | null): string {
  if (!isoString) {
    const now = new Date()
    const offset = now.getTimezoneOffset() * 60000
    return new Date(now.getTime() - offset).toISOString().slice(0, 16)
  }

  try {
    const date = new Date(isoString)
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
  } catch {
    return ''
  }
}

/**
 * Преобразует значение из инпутата datetime-local обратно в ISO формат UTC
 */
export function fromDatetimeLocal(localString: string): string {
  if (!localString) return new Date().toISOString()
  try {
    return new Date(localString).toISOString()
  } catch {
    return new Date().toISOString()
  }
}
