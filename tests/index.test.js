const { create } = require('../index')

describe('Should return error when', () => {
  test('"options" not passed', async () => {
    const result = await create()
    expect(result.error).toBe('missing data for E18')
  })

  test('"options.jobId" not passed', async () => {
    const result = await create({})
    expect(result.error).toBe('missing data for E18')
  })

  test('"task metadata" not passed', async () => {
    const result = await create({
      jobId: 'something'
    })
    expect(result.error).toBe('missing task metadata')
  })

  test('"result" not passed', async () => {
    const result = await create({
      jobId: 'something',
      taskId: 'something'
    })
    expect(result.error).toBe('missing result status')
  })

  test('"result.status" not passed', async () => {
    const result = await create({
      jobId: 'something',
      taskId: 'something'
    }, {})
    expect(result.error).toBe('missing result status')
  })

  test('"E18_SYSTEM" not set in environment and "system" not passed', async () => {
    const result = await create({
      jobId: 'something',
      regarding: 'whatever'
    }, {
      status: 'completed',
      data: { some: 'thing' }
    })
    expect(result.message).toBe('missing "system" property')
  })

  test('"context" not passed and "method" not passed', async () => {
    const result = await create({
      jobId: 'something',
      regarding: 'whatever',
      system: 'test'
    }, {
      status: 'completed',
      data: { some: 'thing' }
    })
    expect(result.message).toBe('missing "method" property')
  })
})
