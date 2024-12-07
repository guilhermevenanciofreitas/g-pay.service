import { Exception } from "../../utils/exception.js"
import { AppContext } from "../../database/index.js"
import { Sequelize, Op } from "sequelize"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class FinanceReceivementController {

  async receivements(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = [{"companyId": company.id}]

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        await db.transaction(async (transaction) => {

          const receivements = await db.Receivement.findAndCountAll({
            attributes: ['id', 'documentNumber', 'dueDate', 'amount'],
            include: [
              {model: db.Partner, as: 'payer', attributes: ['id', 'name', 'surname']},
              {model: db.ContabilityCategorie, as: 'categorie', attributes: ['id', 'name']},
              {model: db.CurrencyMethod, as: 'currencyMethod', attributes: ['id', 'name']},
              {model: db.BankAccount, as: 'bankAccount', attributes: ['id'], include: [
                {model: db.Bank, as: 'bank', attributes: ['id', 'name']}
              ]}
            ],
            limit: limit,
            offset: offset * limit,
            //order: [['createdAt', 'desc']],
            where,
            transaction
          });
  
          res.status(200).json({
            request: {
              filter, limit, offset
            },
            response: {
              rows: receivements.rows, count: receivements.count
            }
          })

        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  async detail(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {
            
          const receivement = await db.Receivement.findOne({
            attributes: ['id', 'documentNumber', 'issueDate', 'dueDate', 'amount'],
            include: [
              {model: db.CurrencyMethod, as: 'currencyMethod', attributes: ['id', 'name']},
              {model: db.Company, as: 'company', attributes: ['id', 'surname']},
              {model: db.Partner, as: 'payer', attributes: ['id', 'surname']},
              {model: db.BankAccount, as: 'bankAccount', attributes: ['id', 'agency', 'agencyDigit', 'account', 'accountDigit'], include:
                {model: db.Bank, as: 'bank', attributes: ['id', 'name']}
              },
              {model: db.ContabilityCategorie, as: 'categorie', attributes: ['id', 'name']}
            ],
            where: [{id}]
          })

          res.status(200).json(receivement)
          
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  async submit(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        let receivement = {
          id: req.body.id,
          documentNumber: req.body.documentNumber,
          currencyMethodId: req.body.currencyMethod?.id,
          issueDate: req.body.issueDate,
          dueDate: req.body.dueDate,
          companyId: req.body.company?.id,
          payerId: req.body.payer?.id,
          bankAccountId: req.body.bankAccount?.id,
          categorieId: req.body.categorie?.id,
          amount: req.body.amount,
        }

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          if (_.isEmpty(receivement.id)) {
            receivement = await db.Receivement.create(receivement, {transaction})
          } else {
            await db.Receivement.update(receivement, {where: [{id: receivement.id}], transaction})
          }

        })

        res.status(200).json(receivement)

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

}