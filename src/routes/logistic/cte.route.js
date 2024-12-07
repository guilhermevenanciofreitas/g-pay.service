import { Router } from 'express'
import { LogisticCteController } from '../../controllers/logistic/cte.controller.js'
import multer from 'multer'
import path from 'path'
  
export class CteRoute {

    router = Router()
    controller = new LogisticCteController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/ctes', async (req, res) => await this.controller.ctes(req, res))
        this.router.post('/detail', async (req, res) => await this.controller.detail(req, res))
        this.router.post('/submit', async (req, res) => await this.controller.submit(req, res))
        this.router.post('/upload', async (req, res) => await this.controller.upload(req, res))
        this.router.post('/add-nfe', async (req, res) => await this.controller.addNfe(req, res))
        this.router.post('/delete-nfe', async (req, res) => await this.controller.deleteNfe(req, res))
    }

}