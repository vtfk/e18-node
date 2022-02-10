const axios = require('axios').default
const { logger } = require('@vtfk/logger')
const createPayload = require('./create-payload')

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
  if (!result || !result.status) {
    logger('error', ['e18-stats', 'missing result status'])
    return { error: 'missing result status' }
  }

  const operationPayload = createPayload(result)
  const status = operationPayload.status

  try {
    const payload = {
      e18: false,
      parallel: true,
      status,
      tasks: [
        {
          ...task,
          status,
          operations: [
            {
              ...operationPayload
            }
          ]
        }
      ]
    }

    const result = await create(payload)
    return result
  } catch (error) {
    return error
  }
}

module.exports.createOperation = async (jobId, taskId, result) => {
  if (!result || !result.status) {
    logger('error', ['e18-stats', 'missing result status'])
    return { error: 'missing result status' }
  }

  const payload = createPayload(result)
  const data = await create(payload, jobId, taskId)
  return data
}

module.exports.createTask = async (jobId, payload) => {
  const data = await create(payload, jobId)
  return data
}
