const axios = require('axios').default
const { API_URL, API_HEADER_TOKEN, API_TOKEN } = require('./config')
const generateStat = require('./lib/generate-stats-object')

const addStats = async options => {
  if (!options) throw new Error('Missing required "options" object')
  if (!options.tasks) throw new Error('Missing required "options.tasks" array')
  if (!Array.isArray(options.tasks)) throw new Error('Required "options.tasks" must be an array')

  const headers = { headers: {} }
  if (API_HEADER_TOKEN) headers.headers[API_HEADER_TOKEN] = API_TOKEN

  const stats = generateStat(options)
  const { data } = await axios.post(API_URL, stats, headers)
  return data ? true : false
}

module.exports = {
  addStats
}
