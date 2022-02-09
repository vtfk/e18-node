jest.mock('axios')

const axios = require('axios').default
const { dataResult, context } = require('./mock/result')
const { complete } = require('./mock/envs')
const { create } = require('../index')

describe('Should return error when', () => {
  beforeEach(() => {
    process.env = {
      ...process.env,
      ...complete
    }
  })

  test('"E18_URL" and "E18_KEY" are missing', async () => {
    delete process.env.E18_URL
    delete process.env.E18_KEY

    const result = await create()
    expect(result.error).toBe('missing url to E18')
  })

  test('"E18_KEY" are missing', async () => {
    delete process.env.E18_KEY

    const result = await create()
    expect(result.error).toBe('missing key to E18')
  })

  test('"E18_SYSTEM" not set in environment and "options" not passed', async () => {
    delete process.env.E18_SYSTEM

    const result = await create({})
    expect(result.error).toBe('missing "system" property')
  })

  test('"options" not passed and "context" not passed', async () => {
    const result = await create({})
    expect(result.error).toBe('missing "method" property')
  })

  test('"E18_EMPTY_JOB" set to "false" in environment', async () => {
    process.env.E18_EMPTY_JOB = 'false'

    const result = await create({}, {}, context)
    expect(result.error).toBe('missing data for E18')
  })

  test('"result" not passed in body', async () => {
    const result = await create({
      body: {
        e18: {
          jobId: 'something',
          taskId: 'something'
        }
      }
    }, null, context)
    expect(result.error).toBe('missing result status')
  })

  test('"result.status" not passed in body', async () => {
    const result = await create({
      body: {
        e18: {
          jobId: 'something',
          taskId: 'something'
        }
      }
    }, {}, context)
    expect(result.error).toBe('missing result status')
  })

  test('"result" not passed in headers', async () => {
    const result = await create({
      headers: {
        e18jobid: 'something',
        e18taskid: 'something'
      }
    }, null, context)
    expect(result.error).toBe('missing result status')
  })

  test('"result.status" not passed in headers', async () => {
    const result = await create({
      headers: {
        e18jobid: 'something',
        e18taskid: 'something'
      }
    }, {}, context)
    expect(result.error).toBe('missing result status')
  })
})

describe('Gets correct E18 info', () => {
  beforeEach(() => {
    process.env = {
      ...process.env,
      ...complete
    }

    axios.post = jest.fn().mockResolvedValue({
      statusCode: 200,
      data: {
        something: 'okey',
        _id: 'job and task created'
      }
    })
  })

  test('When passed in body', async () => {
    const options = {
      body: {
        e18: {
          jobId: 'jobBody',
          taskId: 'taskBody'
        }
      }
    }
    const jobResult = await create(options, dataResult, context)
    expect(jobResult.jobId).toBe(options.body.e18.jobId)
  })

  test('When "system" and "method" also passed in body, "system" and "method" from body shouldn\'t be used', async () => {
    const options = {
      body: {
        e18: {
          jobId: 'jobBody',
          system: 'testBody',
          method: 'runBody'
        }
      }
    }
    const jobResult = await create(options, dataResult, context)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable has precedence
    expect(jobResult.task.method).toBe(context.executionContext.functionName) // context has precedence
  })

  test('When "system" also passed in body, "system" should be from body when "process.env.E18_SYSTEM" doesnt exist', async () => {
    const options = {
      body: {
        e18: {
          jobId: 'jobBody',
          system: 'testBody'
        }
      }
    }

    // remove env variable to use system passed in
    delete process.env.E18_SYSTEM

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.task.system).toBe(options.body.e18.system)
    expect(jobResult.task.method).toBe(context.executionContext.functionName) // context has precedence
  })

  test('When "method" also passed in body, "method" should be from body when "context" doesnt exist', async () => {
    const options = {
      body: {
        e18: {
          jobId: 'jobBody',
          method: 'runBody'
        }
      }
    }

    const jobResult = await create(options, dataResult)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable has precedence
    expect(jobResult.task.method).toBe(options.body.e18.method)
  })

  test('When passed in header', async () => {
    const options = {
      headers: {
        e18jobid: 'jobHeaders',
        e18taskid: 'taskHeaders'
      }
    }
    const jobResult = await create(options, dataResult, context)
    expect(jobResult.jobId).toBe(options.headers.e18jobid)
  })

  test('When "system" and "method" also passed in headers, "system" and "method" from headers shouldn\'t be used', async () => {
    const options = {
      headers: {
        e18jobid: 'jobHeaders',
        e18task: {
          system: 'testHeaders',
          method: 'runHeaders'
        }
      }
    }
    const jobResult = await create(options, dataResult, context)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable has precedence
    expect(jobResult.task.method).toBe(context.executionContext.functionName) // context has precedence
  })

  test('When "system" also passed in headers, "system" should be from headers when "process.env.E18_SYSTEM" doesnt exist', async () => {
    const options = {
      headers: {
        e18jobid: 'jobHeaders',
        e18task: {
          system: 'testHeaders'
        }
      }
    }

    // remove env variable to use system passed in
    delete process.env.E18_SYSTEM

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.task.system).toBe(options.headers.e18task.system)
    expect(jobResult.task.method).toBe(context.executionContext.functionName) // context has precedence
  })

  test('When "method" also passed in headers, "method" should be from headers when "context" doesnt exist', async () => {
    const options = {
      headers: {
        e18jobid: 'jobHeaders',
        e18task: {
          method: 'runHeaders'
        }
      }
    }

    const jobResult = await create(options, dataResult)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable has precedence
    expect(jobResult.task.method).toBe(options.headers.e18task.method)
  })

  test('When no E18 info is found, and "process.env.E18_EMPTY_JOB" doesnt exist, create job and task', async () => {
    const options = {
      body: {
        something: 'whatever'
      },
      headers: {
        something: 'whatever'
      }
    }

    // remove env variable to allow empty jobs
    delete process.env.E18_EMPTY_JOB

    const jobResult = await create(options, dataResult, context)
    expect(jobResult._id).toBe('job and task created')
  })
})
