import { Exception } from "../../utils/exception.js"
import { AppContext } from "../../database/index.js"
import { Sequelize, Op } from "sequelize"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class SettingBankAccountController {

  async bankAccounts(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = [{'$companyId$': company.id}]

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const bankAccounts = await db.BankAccount.findAndCountAll({
          attributes: ['id', 'agency', 'agencyDigit', 'account', 'accountDigit'],
          include: [
            //{model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']},
            //{model: db.CurrencyMethod, as: 'currencyMethod', attributes: ['id', 'name']},
            //{model: db.ContabilityCategorie, as: 'categorie', attributes: ['id', 'name']},
          ],
          limit: limit,
          offset: offset * limit,
          where
        })

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: bankAccounts.rows, count: bankAccounts.count
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