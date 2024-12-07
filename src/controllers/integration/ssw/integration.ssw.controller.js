import { AppContext } from "../../../database/index.js"
import { Authorization } from "../../authorization.js"
import { IntegrationMercadoLivre } from "./authorization.js"
import axios from "axios"
import _ from 'lodash'

export class IntegrationSSWController {

    generate = async (req, res) => {

        

    }

    import = async (req, res) => {
        await Authorization.verify(req, res).then(async () => {
            try {

            } catch (error) {
                res.status(500).json({message: error.message})
            }
        }).catch((error) => {
            res.status(400).json({message: error.message})
        })
    }

}