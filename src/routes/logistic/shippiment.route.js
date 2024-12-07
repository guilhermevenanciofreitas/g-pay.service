import { Router } from 'express'
import { LogisticShippimentController } from '../../controllers/logistic/shippiment.controller.js'
import multer from 'multer'
import path from 'path'
  
export class LogisticShippimentRoute {

    router = Router()
    controller = new LogisticShippimentController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/shippiments', async (req, res) => await this.controller.shippiments(req, res))
        this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
        this.router.post('/add-cte', async (req, res) => await this.controller.addCte(req, res))
    }

}