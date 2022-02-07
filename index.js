const { logger } = require('@vtfk/logger')
const { createTask, createOperation } = require('./lib/create-stats-info')

const hasData = obj => {
  if (obj === null || obj === undefined) return false
  if (typeof obj === 'boolean') return true
  if (Array.isArray(obj) && obj.length === 0) return false
  if (typeof obj === 'object' && Object.getOwnPropertyNames(obj).filter(prop => prop !== 'length').length === 0) return false
  if (typeof obj !== 'number' && typeof obj !== 'string' && !Array.isArray(obj) && typeof obj !== 'object') return false
  if (typeof obj === 'string' && obj.length === 0) return false

  return true
}

const getInfo = options => {
  if (!hasData(options)) return {}

  if (options?.body?.e18) return options.body.e18
  else if (options?.headers?.e18jobid) {
    const { e18jobid: jobId, e18taskid: taskId, e18task } = options?.headers
    const task = typeof e18task === 'string' ? JSON.parse(e18task) : e18task
    return {
      jobId,
      taskId,
      ...task
    }
  }

  return {}
}

const create = async (options, result, context) => {
  const { E18_URL: URL, E18_KEY: KEY, E18_SYSTEM: SYSTEM } = process.env
  // URL and KEY are required!
  if (!URL) {
    logger('info', ['e18-stats', 'missing url to E18'])
    return { error: 'missing url to E18' }
  } else if (!KEY) {
    logger('info', ['e18-stats', 'missing key to E18'])
    return { error: 'missing key to E18' }
  }

  // task will be rest of task properties or an empty object
  let { jobId, taskId, ...task } = getInfo(options)

  if (!jobId) {
    logger('info', ['e18-stats', 'missing data for E18'])
    return { error: 'missing data for E18' }
  }

  if (jobId && !taskId) {
    try {
      task.system = SYSTEM || task.system
      if (!task.system) throw new Error('missing "system" property')

      task.method = context?.executionContext?.functionName?.toLowerCase() || task.method
      if (!task.method) throw new Error('missing "method" property')

      const data = await createTask(jobId, task)
      taskId = data._id
      logger('info', ['e18-stats', jobId, 'create task', 'successfull', taskId])
    } catch (error) {
      const statusCode = error.response?.data?.statusCode || error.response?.status || 400
      const message = error.response?.data?.message || error.response?.message || error.message
      logger('error', ['e18-stats', jobId, 'create task', 'failed', statusCode, message])
      return {
        jobId,
        error: message,
        task,
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

    const data = await createOperation(jobId, taskId, payload)
    logger('info', ['e18-stats', jobId, taskId, 'create operation', 'successfull', data._id])
    return {
      jobId,
      taskId,
      task,
      data
    }
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
