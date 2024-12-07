import { AppContext } from "../../database/index.js"
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class IntegrationController {

  async integrations(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = [{companyId: company.id}]

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const companyIntegrations = await db.CompanyIntegration.findAndCountAll({
          attributes: ['id'],
          include: [
            {model: db.Integration, as: 'integration', attributes: ['id', 'name', 'image']}
          ],
          limit: limit,
          offset: offset * limit,
          //order: [['name', 'asc']],
          where
        });

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: companyIntegrations.rows, count: companyIntegrations.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

}