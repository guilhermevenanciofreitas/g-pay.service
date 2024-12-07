import { Exception } from "../../utils/exception.js"
import { AppContext } from "../../database/index.js"
import { Sequelize, Op } from "sequelize"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class SettingPaymentMethodController {

  async paymentMethods(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = [{'$companyId$': company.id}]

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const paymentMethods = await db.PaymentMethod.findAndCountAll({
          attributes: ['id', 'name'],
          limit: limit,
          offset: offset * limit,
          where
        })

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: paymentMethods.rows, count: paymentMethods.count
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