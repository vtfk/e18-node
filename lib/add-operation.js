module.exports = options => {
  if (options.data && options.error) throw new Error('Operation can not have both "data" and "error"')

  let operation = {
    status: options.status, // required ; string
    createdTimestamp: options.createdTimestamp || new Date().toISOString(),
    modifiedTimestamp: options.modifiedTimestamp || new Date().toISOString()
  }

  if (options.message) { // optional ; string
    const { status, ...rest } = operation
    operation = {
      status,
      message: options.message,
      ...rest
    }
  }
  if (options.data) { // optional ; object
    const { status, message, ...rest } = operation
    operation = {
      status,
      message,
      data: options.data,
      ...rest
    }
  }
  if (options.error) { // optional ; object
    const { status, message, ...rest } = operation
    operation = {
      status,
      message,
      error: options.error,
      ...rest
    }
  }

  return operation
}
