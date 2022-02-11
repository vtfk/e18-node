# E18

## Usage

**Requires Node.js of minimum v14**

Add `E18_URL`, `E18_KEY` and `E18_SYSTEM` to your environment variables

If you <u>***don't***</u> want your API to add statistics when `E18` info is missing, set `E18_EMPTY_JOB` as **false** in your environment variables

### New job

`No E18 info in body`

**Job will have `system` and `type` set to *unknown* and `projectId` set to *0***
**Task will have `system`set to *E18_SYSTEM* and `method` set to *functionName**

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  body: {
    something: 'helloworld'
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

`Passing "system", "type" and "projectId" info in body`

**Job will have `system` set to *jobSystem* and `type` set to *jobType* and `projectId` set to *jobProjectId***
**Task will have `system`set to *E18_SYSTEM* and `method` set to *functionName**

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  body: {
    e18: {
      jobSystem: '<system-who-called-this-system>', // can be passed when no other e18 info is passed to set "system" on job
      jobType: '<type-of-calling-system>', // can be passed when no other e18 info is passed to set "type" on job
      jobProjectId: 42 // can be passed when no other e18 info is passed to set "projectId" on job
    }
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

`No E18 info in headers`

**Job will have `system` and `type` set to *unknown* and `projectId` set to *0***
**Task will have `system`set to *E18_SYSTEM* and `method` set to *functionName**

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  headers: {
    something: 'helloworld'
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

`Passing "system", "type" and "projectId" info in headers`

**Job will have `system` set to *e18jobsystem* and `type` set to *e18jobtype* and `projectId` set to *e18jobprojectid***
**Task will have `system`set to *E18_SYSTEM* and `method` set to *functionName**

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  headers: {
    e18jobsystem: '<system-who-called-this-system>', // can be passed when no other e18 info is passed to set "system" on job
    e18jobtype: '<type-of-calling-system>', // can be passed when no other e18 info is passed to set "type" on job
    e18jobprojectid: 42 // can be passed when no other e18 info is passed to set "projectId" on job
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

### New task

`Passing E18 info in body`

**Task will have `system`set to *E18_SYSTEM* (if present) otherwise set to *system* passed in body.**
**Task wlll have `method` set to *functionName* (if present) otherwise set to *method* passed in body**

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  body: {
    e18: {
      jobId: 'MongoDB_ObjectId',
      system: '<system-to-call>', // will be overridden if system has set E18_SYSTEM
      method: '<route>' // endpoint called on "system". only used if functionName not found
    }
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

`Passing E18 info in headers as JSON`

**Task will have `system`set to *E18_SYSTEM* (if present) otherwise set to *system* passed in body.**
**Task wlll have `method` set to *functionName* (if present) otherwise set to *method* passed in body**

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  headers: {
    e18jobid: 'MongoDB_ObjectId',
    e18task: {
      system: '<system-to-call>', // will be overridden if system has set E18_SYSTEM
      method: '<route>' // endpoint called on "system". only used if functionName not found
    }
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

`Passing E18 info in headers as JSON and "task" as stringified JSON`

**Task will have `system`set to *E18_SYSTEM* (if present) otherwise set to *system* passed in body.**
**Task wlll have `method` set to *functionName* (if present) otherwise set to *method* passed in body**

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  headers: {
    e18jobid: 'MongoDB_ObjectId',
    e18task: '{"system":"<system-to-call>","method":"<route>"}'
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

### New operation on existing task

`Passing E18 in body`

```javascript
const { create } = require('@vtfk/e18')
const options = { // request property from route
  body: {
    e18: {
      jobId: 'MongoDB_ObjectId',
      taskId: 'MongoDB_ObjectId'
    }
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
    e18jobid: 'MongoDB_ObjectId',
    e18taskid: 'MongoDB_ObjectId'
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
