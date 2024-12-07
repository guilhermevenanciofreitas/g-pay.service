import EventEmitter from 'events'

class TaskEmitter extends EventEmitter {}

export const taskEmitter = new TaskEmitter()