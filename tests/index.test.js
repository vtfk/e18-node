jest.mock('axios')

const axios = require('axios').default
const { create } = require('../index')

const dataResult = {
  status: 'completed',
  message: 'Finished',
  data: {
    something: 'okey'
  }
}

describe('Should return error when', () => {
  test('"options" not passed', async () => {
    const result = await create()
    expect(result.error).toBe('missing data for E18')
  })

  test('"options.body" and "options.headers" not passed', async () => {
    const result = await create({})
    expect(result.error).toBe('missing data for E18')
  })

  test('Empty "options.body" passed', async () => {
    const result = await create({
      body: {}
    })
    expect(result.error).toBe('missing data for E18')
  })

  test('"options.body.e18" not passed', async () => {
    const result = await create({
      body: {
        something: 'okey'
      }
    })
    expect(result.error).toBe('missing data for E18')
  })

  test('Empty "options.headers" passed', async () => {
    const result = await create({
      headers: {}
    })
    expect(result.error).toBe('missing data for E18')
  })

  test('"task metadata" not passed in body', async () => {
    const result = await create({
      body: {
        e18: {
          jobId: 'something'
        }
      }
    })
    expect(result.error).toBe('missing task metadata')
  })

  test('"result" not passed in body', async () => {
    const result = await create({
      body: {
        e18: {
          jobId: 'something',
          taskId: 'something'
        }
      }
    })
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
    }, {})
    expect(result.error).toBe('missing result status')
  })

  test('"E18_SYSTEM" not set in environment and "system" not passed in body', async () => {
    const result = await create({
      body: {
        e18: {
          jobId: 'something',
          regarding: 'whatever'
        }
      }
    }, {
      status: 'completed',
      data: { some: 'thing' }
    })
    expect(result.message).toBe('missing "system" property')
  })

  test('"context" not passed and "method" not passed in body', async () => {
    const result = await create({
      body: {
        e18: {
          jobId: 'something',
          regarding: 'whatever',
          system: 'test'
        }
      }
    }, {
      status: 'completed',
      data: { some: 'thing' }
    })
    expect(result.message).toBe('missing "method" property')
  })

  test('"task metadata" not passed in headers', async () => {
    const result = await create({
      headers: {
        e18jobid: 'something'
      }
    })
    expect(result.error).toBe('missing "system" property')
  })

  test('"result" not passed in headers', async () => {
    const result = await create({
      headers: {
        e18jobid: 'something',
        e18taskid: 'something'
      }
    })
    expect(result.error).toBe('missing result status')
  })

  test('"result.status" not passed in headers', async () => {
    const result = await create({
      headers: {
        e18jobid: 'something',
        e18taskid: 'something'
      }
    }, {})
    expect(result.error).toBe('missing result status')
  })

  test('"E18_SYSTEM" not set in environment and "system" not passed in headers', async () => {
    const result = await create({
      headers: {
        e18jobid: 'something',
        e18task: {
          regarding: 'whatever'
        }
      }
    }, {
      status: 'completed',
      data: { some: 'thing' }
    })
    expect(result.message).toBe('missing "system" property')
  })

  test('"context" not passed and "method" not passed in headers', async () => {
    const result = await create({
      headers: {
        e18jobid: 'something',
        e18task: {
          regarding: 'whatever',
          system: 'test'
        }
      }
    }, {
      status: 'completed',
      data: { some: 'thing' }
    })
    expect(result.message).toBe('missing "method" property')
  })
})

describe('Gets correct E18 info', () => {
  beforeEach(() => {
    process.env.E18_URL = 'https://test.dev/api/v1'
    process.env.E18_KEY = 'adrn'
    process.env.E18_SYSTEM = 'test'

    axios.post = jest.fn().mockResolvedValue({
      statusCode: 200,
      data: {
        something: 'okey',
        _id: 'mockedTaskOperationId'
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
    const jobResult = await create(options, dataResult)
    expect(jobResult.jobId).toBe(options.body.e18.jobId)
  })

  test('When "system" and "method" also passed in body, "system" should be "process.env.E18_SYSTEM"', async () => {
    const options = {
      body: {
        e18: {
          jobId: 'jobBody',
          system: 'testBody',
          method: 'runBody'
        }
      }
    }
    const jobResult = await create(options, dataResult)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable has precedence
    expect(jobResult.task.method).toBe(options.body.e18.method)
  })

  test('When "system" and "method" also passed in body, "system" should be "system" when "process.env.E18_SYSTEM" doesnt exist', async () => {
    const options = {
      body: {
        e18: {
          jobId: 'jobBody',
          system: 'testBody',
          method: 'runBody'
        }
      }
    }

    // remove env variable to use system passed in
    delete process.env.E18_SYSTEM

    const jobResult = await create(options, dataResult)
    expect(jobResult.task.system).toBe(options.body.e18.system)
    expect(jobResult.task.method).toBe(options.body.e18.method)
  })

  test('When passed in header', async () => {
    const options = {
      headers: {
        e18JobId: 'jobHeaders',
        e18TaskId: 'taskHeaders'
      }
    }
    const jobResult = await create(options, dataResult)
    expect(jobResult.jobId).toBe(options.headers.e18JobId)
  })

  test('When "system" and "method" also passed in headers, "system" should be "process.env.E18_SYSTEM"', async () => {
    const options = {
      headers: {
        e18JobId: 'jobHeaders',
        e18Task: {
          system: 'testHeaders',
          method: 'runHeaders'
        }
      }
    }
    const jobResult = await create(options, dataResult)
    expect(jobResult.task.system).toBe(process.env.E18_SYSTEM) // environment variable has precedence
    expect(jobResult.task.method).toBe(options.headers.e18Task.method)
  })

  test('When "system" and "method" also passed in headers, "system" should be "system" when "process.env.E18_SYSTEM" doesnt exist', async () => {
    const options = {
      headers: {
        e18JobId: 'jobHeaders',
        e18Task: {
          system: 'testHeaders',
          method: 'runHeaders'
        }
      }
    }

    // remove env variable to use system passed in
    delete process.env.E18_SYSTEM

    const jobResult = await create(options, dataResult)
    expect(jobResult.task.system).toBe(options.headers.e18Task.system)
    expect(jobResult.task.method).toBe(options.headers.e18Task.method)
  })
})
