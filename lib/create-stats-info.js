const axios = require('axios').default
const { E18_URL: URL, E18_KEY: KEY } = process.env

const create = async (jobId, payload, taskId) => {
  const headers = {
    headers: {
      'X-API-KEY': KEY
    }
  }

  const { data } = await axios.post(`${URL}/jobs/${jobId}/tasks/${taskId}/operations`, payload, headers)
  return data
}

module.exports.createOperation = async (jobId, taskId, payload) => {
  const data = await create(jobId, payload, taskId)
  return data
}

module.exports.createTask = async (jobId, payload) => {
  const data = await create(jobId, payload)
  return data
}
