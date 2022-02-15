const excluded = [
  'insomnia',
  'postman'
]

module.exports = headers => {
  const userAgent = headers && headers['user-agent'] ? headers['user-agent'].toLowerCase() : undefined
  if (!userAgent) return false

  return excluded.some(exclude => userAgent.includes(exclude))
}
