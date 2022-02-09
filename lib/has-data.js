module.exports = obj => {
  if (obj === null || obj === undefined) return false
  if (typeof obj === 'boolean') return true
  if (Array.isArray(obj) && obj.length === 0) return false
  if (typeof obj === 'object' && Object.getOwnPropertyNames(obj).filter(prop => prop !== 'length').length === 0) return false
  if (typeof obj !== 'number' && typeof obj !== 'string' && !Array.isArray(obj) && typeof obj !== 'object') return false
  if (typeof obj === 'string' && obj.length === 0) return false

  return true
}
