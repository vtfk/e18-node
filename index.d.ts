export function addStats(options: StatsOptions): void

interface StatsOperation {
  status: string
  message?: string
  data?: object
  error?: object
  createdTimestamp?: string | Date
  modifiedTimestamp?: string | Date
}

interface StatsTask {
  jobId?: string
  system: string
  method: string
  status?: string
  retries?: number
  data?: object
  dependencyTag?: string
  dependencies?: object[]
  operations: StatsOperation[]
  createdTimestamp: string | Date
  modifiedTimestamp: string | Date
}

interface StatsOptions {
  system: string
  type: string
  projectId: number
  status: string
  tasks: StatsTask[]
  createdTimestamp: string | Date
  modifiedTimestamp: string | Date
}
