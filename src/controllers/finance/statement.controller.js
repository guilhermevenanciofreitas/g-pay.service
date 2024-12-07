import { Exception } from "../../utils/exception.js"
import { AppContext } from "../../database/index.js"
import { Sequelize, Op } from "sequelize"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class FinanceStatementController {

  async statements(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = [{'$bankAccount.companyId$': company.id}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const statements = await db.Statement.findAndCountAll({
          attributes: ['id', 'createdAt'],
          include: [
            {model: db.BankAccount, as: 'bankAccount', attributes: ['id', 'agency', 'agencyDigit', 'account', 'accountDigit'],
              include: [
                {model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
              ]
            }
          ],
          limit: limit,
          offset: offset * limit,
          order: [['createdAt', 'desc']],
          where
        });

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: statements.rows, count: statements.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  bankAccounts = async (req, res) => {
    await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = []

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const bankAccounts = await db.BankAccount.findAndCountAll({
          attributes: ['id', 'agency', 'agencyDigit', 'account', 'accountDigit'],
          include: [
            {model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
          ],
          limit: limit,
          offset: offset * limit,
          where
        });

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            bankAccounts: {
              rows: bankAccounts.rows, count: bankAccounts.count
            }
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