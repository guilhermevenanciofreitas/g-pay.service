import { Router } from 'express'
import { SearchController } from '../controllers/search.js'
  
export class SearchRoute {

    router = Router()
    controller = new SearchController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/city', async (req, res) => await this.controller.city(req, res))
        this.router.post('/sender', async (req, res) => await this.controller.sender(req, res))
        this.router.post('/recipient', async (req, res) => await this.controller.recipient(req, res))
    }

}