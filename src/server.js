import express, { Router } from 'express'
import cors from 'cors'
import serverless from 'serverless-http'

import { LoginRoute } from './routes/login/login.route.js'

import { TaskRoute } from './routes/task/task.route.js'
import { IntegrationRoute } from './routes/integration/integration.route.js'
import { CteRoute } from './routes/logistic/cte.route.js'
import { LogisticShippimentRoute } from './routes/logistic/shippiment.route.js'
import { SearchRoute } from './routes/search.js'

class App {

  express = express()

  constructor() {
    this.initializeMiddlewares()
    this.initializeRoutes()
  }

  initializeMiddlewares = () => {

    const corsOptions = {
      origin: '*',
      exposedHeaders: ['Last-Acess', 'Expire-In'],
    }

    this.express.use(cors(corsOptions))
    this.express.use(express.json())

  }

  initializeRoutes = () => {

    this.express.use('/api/login', new LoginRoute().router)

    //Logistic
    this.express.use('/api/logistic/cte', new CteRoute().router)
    this.express.use('/api/logistic/shippiment', new LogisticShippimentRoute().router)


    this.express.use('/api/task', new TaskRoute().router)
    this.express.use('/api/integration', new IntegrationRoute().router)

    
    this.express.use('/api/search', new SearchRoute().router)

    //this.express.get('/*', (req, res) => res.sendFile('../public/index.html'))

  }

  listen = (port) => {
    this.express.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

}

//tasks()

//taskEmitter.on('taskUpdated', tasks)

export const app = new App()

export const handler = serverless(app.express)