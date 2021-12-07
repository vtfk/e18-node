(async () => {
  const { create } = require('./index')

  /* process.env.E18_URL = 'https://test-app-e18-api.azurewebsites.net/api/v1'
  process.env.E18_KEY = "TOKEN" */

  const task = await create({
    jobId: '61af5b42c0d788001c08f766',
    taskId: '61af5c79c0d788001c08f77f',
    system: 'p360',
    method: 'SyncElevmappe'
  }, {
    status: 'completed',
    data: { message: 'auda' }
  })
  console.log(task)
})()
