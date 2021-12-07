# E18

## Usage

Add `E18_URL` and `E18_KEY` to your environment variables

### New task

```javascript
const { create } = require('@vtfk/e18')
const options = {
  "system": "p360",
  "method": "SyncElevmappe",
  "jobId": "MongoDB_ObjectId"
}
const result = {
  status: 'waiting|running|suspended|completed|failed',
  message: 'Finished or whateter|Failed or whatever',
  error: {} // should be set when status is not complete
  data: {} // should be set when status is completed
}
await create(options, result)
```

### New operation on existing task

```javascript
const { create } = require('@vtfk/e18')
const options = {
  "jobId": "MongoDB_ObjectId",
  "taskId": "MongoDB_ObjectId"
}
const result = {
  status: 'completed|failed',
  message: 'Finished or whateter|Failed or whatever',
  error: {} // should be set when status is failed
  data: {} // should be set when status is completed
}
await create(options, result)
```
