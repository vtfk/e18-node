const axios = require('axios').default
const { logger } = require('@vtfk/logger')
const hasData = require('./has-data.js')

const create = async (payload, jobId, taskId) => {
  const { E18_URL: URL, E18_KEY: KEY } = process.env

  const headers = {
    headers: {
      'X-API-KEY': KEY
    }
  }

  const url = `${URL}/jobs${jobId ? `/${jobId}/tasks` : ''}${taskId ? `/${taskId}/operations` : ''}`
  const { data } = await axios.post(url, payload, headers)
  return data
}

module.exports.createJob = async (task, result) => {
  try {
    const payload = {
      e18: false,
      parallel: true,
      status: 'completed',
      tasks: [
        {
          ...task,
          status: 'completed'
        }
      ]
    }

    const data = await create(payload)
    return data
  } catch (error) {
    return error
  }
}

module.exports.createOperation = async (jobId, taskId, result) => {
  if (!result || !result.status) {
    logger('error', ['e18-stats', 'missing result status'])
    return { error: 'missing result status' }
  }

  const payload = {
    status: result.status,
    message: result.message || result.error?.message || result.error?.body?.message || ''
  }
  if (result.status === 'failed') {
    if (hasData(result.error)) {
      if (typeof result.error === 'object') {
        payload.error = JSON.parse(JSON.stringify(result.error))
      } else {
        payload.error = result.error
      }
    }
  } else {
    if (hasData(result.data)) {
      payload.data = result.data
    }
  }

  const data = await create(payload, jobId, taskId)
  return data
}

module.exports.createTask = async (jobId, payload) => {
  const data = await create(payload, jobId)
  return data
}
