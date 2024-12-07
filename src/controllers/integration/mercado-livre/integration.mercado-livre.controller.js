import { AppContext } from "../../../database/index.js"
import { Authorization } from "../../authorization.js"
import { IntegrationMercadoLivre } from "./authorization.js"
import axios from "axios"
import _ from 'lodash'

export class IntegrationMercadoLivreController {

  statement = async (req, res) => {
    await Authorization.verify(req, res).then(async () => {
      await IntegrationMercadoLivre.verify(req, res).then(async ({id, access_token}) => {
          try {

            let config = {
              method: 'get',
              url: 'https://api.mercadopago.com/v1/account/release_report/list',
              headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${access_token}`
              }
            }

            const response = await axios.request(config);
  
            res.status(200).json({
              response: response.data
            })

          } catch (error) {
              res.status(500).json({message: error.message})
          }
        }).catch((error) => {
          //MercadoLivreException.unauthorized(res, error);
        })
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

}