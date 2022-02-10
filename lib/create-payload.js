const hasData = require('./has-data')

module.exports = result => {
  const status = result.status
  const message = hasData(result.message) ? result.message || result.error?.message || result.error?.body?.message : undefined
  const error = hasData(result.error) ? result.error?.response?.data || result.error?.stack || result.error : undefined // add new variations before "result.error"
  const data = result.data || undefined

  return {
    status,
    message,
    data,
    error
  }
}
