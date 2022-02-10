(async () => {
  process.env.E18_URL = 'https://api.vtfk.dev/e18/api/v1'
  process.env.E18_KEY = 'token'
  process.env.E18_SYSTEM = 'p360'
  const { context } = require('./tests/mock/result')
  const { create } = require('./index')

  const req = {
    headers: {
      Authentication: 'Bearer apeloff'
    },
    body: {
      parameter: {
        what: 'ever'
      }
    }
  }

  const dataResult = {
    status: 'completed',
    data: [],
    message: 'bsdlfsbd'
  }

  const result = await create(req, dataResult, context)
  const operation = result.tasks[0].operations[0]
  // console.log(JSON.stringify(result, null, 2))
  console.log(operation)
})()
