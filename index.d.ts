export function create(options: RequestObject, result: E18Result, context: object): Promise<void>

enum E18TaskStatus {
  completed = 'completed',
  failed = 'failed',
  suspended = 'suspended',
  running = 'running',
  waiting = 'waiting'
}

enum E18OperationStatus {
  completed = 'completed',
  failed = 'failed'
}

interface RequestObject {
  body?: E18Body,
  headers?: E18Headers
}

interface E18BodyOptions {
  system?: string,
  method?: string,
  jobId: string,
  taskId?: string
}

interface E18HeadersTask {
  system?: string,
  method?: string
}

interface E18Body {
  e18?: E18BodyOptions
}

interface E18Headers {
  e18JobId: string,
  e18TaskId?: string,
  e18Task?: E18HeadersTask
}

interface E18Result {
  status: E18TaskStatus | E18OperationStatus,
  message?: string,
  error?: object,
  data?: object
}
