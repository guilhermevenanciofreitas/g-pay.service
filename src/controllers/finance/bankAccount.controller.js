import { Exception } from "../../utils/exception.js"
import { AppContext } from "../../database/index.js"
import { Sequelize, Op } from "sequelize"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class FinanceBankAccountController {

  async bankAccounts(req, res) {
    await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const bankAccount = req.body.bankAccount

        const whereCompany = {'$bankAccount.companyId$': company.id}

        const where = []

        where.push(whereCompany)

        if (bankAccount) {
          where.push({bankAccountId: bankAccount.id})
        }

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const bankAccountStatements = await db.BankAccountStatement.findAndCountAll({
          attributes: ['id', 'entryAt', 'amount'],
          include: [
            {model: db.Partner, as: 'partner', attributes: ['id', 'surname']},
            {model: db.BankAccount, as: 'bankAccount', attributes: ['id', 'name', 'agency', 'agencyDigit', 'account', 'accountDigit'],
              include: [
                {model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
              ]
            },
            {model: db.CurrencyMethod, as: 'currencyMethod', attributes: ['id', 'name']},
            {model: db.ContabilityCategorie, as: 'categorie', attributes: ['id', 'name']}
          ],
          limit: limit,
          offset: offset * limit,
          order: [['entryAt', 'desc']],
          where,
        })

        const bankAccounts = await db.BankAccount.findAll({
          attributes: ['id', 'name', 'agency', 'agencyDigit', 'account', 'accountDigit', [Sequelize.literal(`(SELECT COALESCE(SUM("amount"), 0) FROM "bankAccountStatement" WHERE "bankAccountStatement"."bankAccountId" = "bankAccount"."id")`), 'balance']],
          include: [
            {model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
          ],
          where: [whereCompany]
        })

        res.status(200).json({
          request: {
            bankAccount, filter, limit, offset
          },
          response: {
            bankAccounts,
            rows: bankAccountStatements.rows, count: bankAccountStatements.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  async statementDetail(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        const { id } = req.body

        const db = new AppContext();

        const statement = await db.BankAccountStatement.findOne({
          attributes: ['id', 'entryAt', 'amount'],
          include: [
            {model: db.ContabilityCategorie, as: 'categorie', attributes: ['id', 'name']},
            {model: db.CurrencyMethod, as: 'currencyMethod', attributes: ['id', 'name']},
            {model: db.BankAccount, as: 'bankAccount', attributes: ['id', 'name', 'agency', 'agencyDigit', 'account', 'accountDigit'], include: [
              {model: db.Bank, as: 'bank', attributes: ['id', 'name']}
            ]},
            {model: db.Partner, as: 'partner', attributes: ['id', 'surname']},
          ],
          where: [{id}]
        });

        res.status(200).json(statement);

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    });
  }

  async submit(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        let role = req.body

        const roleRules = [...role.roleRules]

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          if (_.isEmpty(role.id)) {
            role = await db.Role.create(role, {transaction})
          } else {
            await db.Role.update(role, {where: [{id: role.id}], transaction})
            await db.RoleRule.destroy({where: [{roleId: role.id}], transaction})
          }

          for (const roleRule of roleRules) {
            await db.RoleRule.create({roleId: role.id, ruleId: roleRule.ruleId}, {transaction})
          }

        })

        res.status(200).json(role)

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    });
  }

}