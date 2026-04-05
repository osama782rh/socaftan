const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase()

const parseAdminEmails = () => {
  const blocked = new Set(['osama.rahim@outlook.fr'])
  const defaults = ['contact@socaftan.fr', 'sara.ltr@outlook.fr']
  const raw = import.meta.env.VITE_ADMIN_EMAILS || ''
  const configured = raw
    .split(',')
    .map(normalizeEmail)
    .filter((email) => email && !blocked.has(email))

  return [...new Set([...defaults, ...configured])]
}

const ADMIN_EMAILS = parseAdminEmails()

export const isAdminEmail = (email) => {
  const normalized = normalizeEmail(email)
  return normalized ? ADMIN_EMAILS.includes(normalized) : false
}
