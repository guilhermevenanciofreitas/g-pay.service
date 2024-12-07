import { Router } from 'express'
import { TaskController } from '../../controllers/task/task.controller.js'
  
export class TaskRoute {

    router = Router()
    controller = new TaskController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/tasks', async (req, res) => await this.controller.tasks(req, res))
        this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
        this.router.post('/histories', async (req, res) => await this.controller.histories(req, res))
    }

}