export function create(options: E18Options, result: E18Result, context: object): void

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

interface E18Options {
  system?: string,
  method?: string,
  jobId: string,
  taskId?: string
}

interface E18Result {
  status: E18TaskStatus | E18OperationStatus,
  message?: string,
  error?: object,
  data?: object
}
