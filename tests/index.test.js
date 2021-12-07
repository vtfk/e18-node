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
})
