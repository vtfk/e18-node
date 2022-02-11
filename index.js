const { logger } = require('@vtfk/logger')
const { createJob, createTask, createOperation } = require('./lib/create-stats-info')
const hasData = require('./lib/has-data.js')

const getInfo = options => {
  if (!hasData(options)) return {}

  if (options?.body?.e18) {
    if (['number', 'string'].includes(typeof options.body.e18.jobProjectId)) {
      options.body.e18.jobProjectId = Number.parseInt(options.body.e18.jobProjectId)
    }
    return options.body.e18
  } else if (options?.headers?.e18jobid || options?.headers?.e18jobsystem || options?.headers?.e18jobtype || options?.headers?.e18jobprojectid) {
    const { e18jobsystem: jobSystem, e18jobtype: jobType, e18jobprojectid, e18jobid: jobId, e18taskid: taskId, e18task } = options.headers
    const jobProjectId = Number.parseInt(e18jobprojectid)
    const task = typeof e18task === 'string' ? JSON.parse(e18task) : e18task
    return {
      jobSystem,
      jobType,
      jobProjectId,
      jobId,
      taskId,
      ...task
    }
  }

  return {}
}

const create = async (options, result, context) => {
  const { E18_URL: URL, E18_KEY: KEY, E18_SYSTEM: SYSTEM, E18_EMPTY_JOB: EMPTY_JOB = 'true' } = process.env
  // URL and KEY are required!
  if (!URL) {
    logger('info', ['e18-stats', 'missing url to E18'])
    return { error: 'missing url to E18' }
  } else if (!KEY) {
    logger('info', ['e18-stats', 'missing key to E18'])
    return { error: 'missing key to E18' }
  }

  // task will be rest of task properties or an empty object
  let { jobSystem, jobType, jobProjectId, jobId, taskId, ...task } = getInfo(options)

  task.system = SYSTEM || task.system
  if (!task.system) {
    logger('info', ['e18-stats', 'missing "system" property'])
    return { error: 'missing "system" property' }
  }

  task.method = context?.executionContext?.functionName?.toLowerCase() || task.method
  if (!task.method) {
    logger('info', ['e18-stats', 'missing "method" property'])
    return { error: 'missing "method" property' }
  }

  if (!jobId) {
    if (!EMPTY_JOB || (typeof EMPTY_JOB === 'string' && EMPTY_JOB.toLowerCase().trim() !== 'true')) {
      logger('info', ['e18-stats', 'missing data for E18'])
      return { error: 'missing data for E18' }
    }

    logger('info', ['e18-stats', 'missing data for E18, creating job for statistics purposes'])
    try {
      const data = await createJob(jobSystem, jobType, jobProjectId, task, result)
      if (data.error) return data

      jobId = data._id
      logger('info', ['e18-stats', 'create job', 'successfull', jobId])
      return data
    } catch (error) {
      const statusCode = error.response?.data?.statusCode || error.response?.status || 400
      const message = error.response?.data?.message || error.response?.message || error.message
      logger('error', ['e18-stats', 'create job', 'failed', statusCode, message])
      return {
        error: message,
        statusCode,
        message
      }
    }
  }

  if (jobId && !taskId) {
    try {
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
    const data = await createOperation(jobId, taskId, result)
    if (data.error) return data
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
