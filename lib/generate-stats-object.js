const addTask = require('./add-task')

module.exports = options => {
  let stat = {
    system: options.system, // required ; string
    type: options.type, // required ; string
    projectId: options.projectId, // required ; number
    status: options.status, // required ; string
    tasks: options.tasks.map(addTask), // required ; array of task
    createdTimestamp: new Date().toISOString(),
    modifiedTimestamp: new Date().toISOString()
  }

  if (options.jobId) { // optional ; string
    stat = {
      jobId: options.jobId,
      ...stat
    }
  }

  return stat
}
