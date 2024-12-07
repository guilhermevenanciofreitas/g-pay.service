import { Router } from 'express'
import { IntegrationController } from '../../controllers/integration/integration.controller.js'

//Mercado Livre
//import { IntegrationMercadoLivreController } from '../../controllers/integration/mercado-livre/integration.mercado-livre.controller.js'
  
export class IntegrationRoute {

    router = Router()
    controller = new IntegrationController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        
        this.router.post('/integrations', async (req, res) => await this.controller.integrations(req, res))
        
        //const mercadoLivre = new IntegrationMercadoLivreController()
        //this.router.post('/mercado-livre/statement', async (req, res) => await mercadoLivre.statement(req, res))

    }

}