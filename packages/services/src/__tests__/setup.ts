// Mock Redis and BullMQ for tests
jest.mock('ioredis', () => {
  return {
    Redis: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      ping: jest.fn().mockResolvedValue('PONG'),
      disconnect: jest.fn().mockResolvedValue(undefined),
    }))
  }
})

jest.mock('bullmq', () => {
  const mockJob = {
    id: 'test-job-id',
    name: 'test-job',
    data: {},
    remove: jest.fn().mockResolvedValue(undefined),
  }

  const createMockQueue = (name: string) => ({
    name,
    add: jest.fn().mockResolvedValue(mockJob),
    getJob: jest.fn().mockResolvedValue(mockJob),
    pause: jest.fn().mockResolvedValue(undefined),
    resume: jest.fn().mockResolvedValue(undefined),
    getWaiting: jest.fn().mockResolvedValue([]),
    getActive: jest.fn().mockResolvedValue([]),
    getCompleted: jest.fn().mockResolvedValue([]),
    getFailed: jest.fn().mockResolvedValue([]),
    getDelayed: jest.fn().mockResolvedValue([]),
    clean: jest.fn().mockResolvedValue([]),
    close: jest.fn().mockResolvedValue(undefined),
  })

  return {
    Queue: jest.fn().mockImplementation((name: string) => createMockQueue(name)),
    Worker: jest.fn().mockImplementation(() => ({})),
    Job: mockJob,
  }
})

// Suppress console logs during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}
