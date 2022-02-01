# E18

## Usage

**Requires Node.js of minimum v14**

Add `E18_URL`, `E18_KEY` and `E18_SYSTEM` to your environment variables

### New task

`Passing E18 in body`

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  body: {
    jobId: 'MongoDB_ObjectId',
    system: '<system-to-call>', // will be overridden if system has set E18_SYSTEM
    method: 'lookup' // endpoint to call on system
  }
}
const result = {
  status: 'waiting|running|suspended|completed|failed',
  message: 'Finished or whateter|Failed or whatever',
  error: {} // should be set when status is failed
  data: {} // should be set when status is completed
}
await create(options, result, context)
```

`Passing E18 in headers`

```javascript
const { create } = require('@vtfk/e18')
const headers = { // request property from route
  headers: {
    jobId: 'MongoDB_ObjectId',
    e18Task: {
      system: '<system-to-call>', // will be overridden if system has set E18_SYSTEM
      method: 'lookup' // endpoint to call on system
    }
  }
}
const result = {
  status: 'waiting|running|suspended|completed|failed',
  message: 'Finished or whateter|Failed or whatever',
  error: {} // should be set when status is failed
  data: {} // should be set when status is completed
}
await create(headers, result, context)
```

### New operation on existing task

`Passing E18 in body`

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  body: {
    jobId: 'MongoDB_ObjectId',
    taskId: 'MongoDB_ObjectId'
  }
}
const result = {
  status: 'completed|failed',
  message: 'Finished or whateter|Failed or whatever',
  error: {} // should be set when status is failed
  data: {} // should be set when status is completed
}
await create(options, result, context)
```

`Passing E18 in headers`

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  headers: {
    jobId: 'MongoDB_ObjectId',
    taskId: 'MongoDB_ObjectId'
  }
}
const result = {
  status: 'completed|failed',
  message: 'Finished or whateter|Failed or whatever',
  error: {} // should be set when status is failed
  data: {} // should be set when status is completed
}
await create(options, result, context)
```
