const axios = require('axios').default
const { logger } = require('@vtfk/logger')

const create = async (options, result) => {
  if (!options || (!options.jobId && !options.taskId)) {
    logger('info', ['e18-stats', 'missing data for E18'])
    return { error: 'missing data for E18' }
  }

  const URL = process.env.E18_URL
  const KEY = process.env.E18_KEY
  let { jobId, taskId, ...task } = options
  const headers = {
    headers: {
      'X-API-KEY': KEY
    }
  }

  if (jobId && !taskId) {
    if (!task || Object.getOwnPropertyNames(task).length === 0) {
      logger('error', ['e18-stats', jobId, 'missing task metadata'])
      return {
        jobId,
        error: 'missing task metadata'
      }
    }
    try {
      const { data } = await axios.post(`${URL}/jobs/${jobId}/tasks`, task, headers)
      taskId = data._id
      logger('info', ['e18-stats', jobId, 'create task', 'successfull', taskId])
    } catch (error) {
      const { statusCode, message } = error.response.data
      logger('error', ['e18-stats', jobId, 'create task', 'failed', statusCode || 400, message])
      return {
        jobId,
        error: 'create task failed',
        statusCode,
        message
      }
    }
  }

  try {
    if (!result || !result.status) {
      logger('error', ['e18-stats', jobId, taskId, 'missing result status'])
      return {
        jobId,
        taskId,
        error: 'missing result status'
      }
    }
    const payload = {
      status: result.status,
      message: result.message || ''
    }
    if (result.status === 'failed') {
      payload.error = result.error
    } else {
      payload.data = result.data
    }

    const { data } = await axios.post(`${URL}/jobs/${jobId}/tasks/${taskId}/operations`, payload, headers)
    logger('info', ['e18-stats', jobId, taskId, 'create operation', 'successfull', data._id])
  } catch (error) {
    const { statusCode, message } = error.response.data
    logger('error', ['e18-stats', jobId, taskId, 'create operation', 'failed', statusCode || 400, message])
    return {
      jobId,
      taskId,
      error: 'create operation failed',
      statusCode,
      message
    }
  }
}

module.exports = {
  create
}
