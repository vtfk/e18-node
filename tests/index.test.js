const axios = require('axios')
const { dataResult, context } = require('./mock/result')
const { complete } = require('./mock/envs')
const { create } = require('../index')

jest.mock('axios')

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

  test('"user-agent" is insomnia', async () => {
    const result = await create({
      headers: {
        'user-agent': 'insomnia/something'
      }
    }, {}, context)
    expect(result.error).toBe('UserAgent excluded')
  })

  test('"user-agent" is Postman', async () => {
    const result = await create({
      headers: {
        'user-agent': 'PostmanRuntime/something'
      }
    }, {}, context)
    expect(result.error).toBe('UserAgent excluded')
  })
})

describe('Gets correct E18 info for task and operation', () => {
  beforeEach(() => {
    process.env = {
      ...process.env,
      ...complete
    }

    axios.post = jest.fn().mockResolvedValue({
      statusCode: 200,
      data: {
        something: 'okey',
        _id: 'task and operation created'
      }
    })
  })

  afterEach(() => jest.clearAllMocks())

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

  test('When "system" is passed as a JSON string in headers, "system" should be from "process.env.E18_SYSTEM"', async () => {
    const options = {
      headers: {
        e18jobid: 'jobHeaders',
        e18task: '{"system":"testHeaders"}'
      }
    }

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable has precedence
    expect(jobResult.task.method).toBe(context.executionContext.functionName) // context has precedence
  })

  test('When "method" is passed as a JSON string in headers, "method" should be from "context"', async () => {
    const options = {
      headers: {
        e18jobid: 'jobHeaders',
        e18task: '{"method":"runHeaders"}'
      }
    }

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable is used
    expect(jobResult.task.method).toBe(context.executionContext.functionName) // context has precedence
  })
})

describe('Gets correct E18 info for job', () => {
  beforeEach(() => {
    process.env = {
      ...process.env,
      ...complete
    }

    axios.post.mockImplementation((url, payload, headers) => Promise.resolve({ data: { ...payload, _id: 'job, task and operation created' } }))
  })

  afterEach(() => jest.clearAllMocks())

  test('When no E18 info is found, and "process.env.E18_EMPTY_JOB" doesn\'t exist, create job, task and operation', async () => {
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
    expect(jobResult.system).toBe(undefined)
    expect(jobResult.type).toBe(undefined)
    expect(jobResult.projectId).toBe(undefined)
    expect(jobResult._id).toBe('job, task and operation created')
  })

  test('When "jobSystem", "jobType" and "jobProjectId" is found in body, and "process.env.E18_EMPTY_JOB" doesn\'t exist, create job, task and operation', async () => {
    const jobSystem = 'testJobSystem'
    const jobType = 'testJobType'
    const jobProjectId = 0
    const options = {
      body: {
        e18: {
          jobSystem,
          jobType,
          jobProjectId
        }
      }
    }

    // remove env variable to allow empty jobs
    delete process.env.E18_EMPTY_JOB

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.system).toBe(jobSystem)
    expect(jobResult.type).toBe(jobType)
    expect(jobResult.projectId).toBe(jobProjectId)
    expect(jobResult._id).toBe('job, task and operation created')
  })

  test('When "jobProjectId" as a string is found in body, and "process.env.E18_EMPTY_JOB" doesn\'t exist, create job, task and operation', async () => {
    const jobProjectId = '5'
    const options = {
      body: {
        e18: {
          jobProjectId
        }
      }
    }

    // remove env variable to allow empty jobs
    delete process.env.E18_EMPTY_JOB

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.system).toBe(undefined)
    expect(jobResult.type).toBe(undefined)
    expect(jobResult.projectId).toBe(Number.parseInt(jobProjectId))
    expect(jobResult._id).toBe('job, task and operation created')
  })

  test('When "e18jobsystem", "e18jobtype" and "e18jobprojectid" is found in headers, and "process.env.E18_EMPTY_JOB" doesn\'t exist, create job, task and operation', async () => {
    const e18jobsystem = 'testJobSystem'
    const e18jobtype = 'testJobType'
    const e18jobprojectid = 0
    const options = {
      headers: {
        e18jobsystem,
        e18jobtype,
        e18jobprojectid
      }
    }

    // remove env variable to allow empty jobs
    delete process.env.E18_EMPTY_JOB

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.system).toBe(e18jobsystem)
    expect(jobResult.type).toBe(e18jobtype)
    expect(jobResult.projectId).toBe(e18jobprojectid)
    expect(jobResult._id).toBe('job, task and operation created')
  })

  test('When "e18jobprojectid" as a string is found in headers, and "process.env.E18_EMPTY_JOB" doesn\'t exist, create job, task and operation', async () => {
    const e18jobprojectid = '5'
    const options = {
      headers: {
        e18jobprojectid
      }
    }

    // remove env variable to allow empty jobs
    delete process.env.E18_EMPTY_JOB

    const jobResult = await create(options, dataResult, context)
    expect(jobResult.system).toBe(undefined)
    expect(jobResult.type).toBe(undefined)
    expect(jobResult.projectId).toBe(Number.parseInt(e18jobprojectid))
    expect(jobResult._id).toBe('job, task and operation created')
  })

  test('When "user-agent" is not excluded', async () => {
    const result = await create({
      headers: {
        'user-agent': 'axios/something'
      }
    }, dataResult, context)
    expect(result.error).toBe(undefined)
  })
})
