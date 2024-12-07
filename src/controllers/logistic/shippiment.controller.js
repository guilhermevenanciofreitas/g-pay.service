import { AppContext } from "../../database/index.js"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'
import { Sequelize } from "sequelize"

export class LogisticShippimentController {

  async shippiments(req, res) {
    //await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const search = req.body.search

        const where = []

        if (search?.input) {

          if (search?.picker == 'code') {
            where.push({codigo_carga: search.input.match(/\d+/g)})
          }

          if (search?.picker == 'documentTransport') {
            where.push({documento_transporte: {[Sequelize.Op.like]: `%${search.input.replace(' ', "%")}%`}})
          }

        }

        const shippiments = await db.Shippiment.findAndCountAll({
          attributes: ['id', 'documento_transporte', 'peso', 'valor_frete'],
          include: [
            {model: db.Partner, as: 'sender', attributes: ['id', 'surname']},
            {model: db.Cte, as: 'ctes', attributes: ['id', 'chaveCt']},
          ],
          limit: limit,
          offset: offset * limit,
          order: [['id', 'desc']],
          where,
          subQuery: false
        })

        /*
        const bankAccounts = await db.BankAccount.findAll({
          attributes: ['id', 'name', 'agency', 'agencyDigit', 'account', 'accountDigit', [Sequelize.literal(`(SELECT COALESCE(SUM("amount"), 0) FROM "bankAccountStatement" WHERE "bankAccountStatement"."bankAccountId" = "bankAccount"."id")`), 'balance']],
          include: [
            {model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
          ],
          where: [whereCompany]
        })
        */

        res.status(200).json({
          request: {
            limit, offset
          },
          response: {
            rows: shippiments.rows, count: shippiments.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  
  async detail(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {
            
          const shippiment = await db.Shippiment.findOne({
            attributes: ['id', 'documento_transporte', 'proPred'],
            include: [
              {model: db.Partner, as: 'sender', attributes: ['id', 'name']}
            ],
            where: [{codigo_carga: id}],
            transaction
          })

          res.status(200).json(shippiment)
          
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  async addCte(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          //const cte = await db.Cte.findOne({attributes: ['id'], where: [{chaveCt: req.body.chaveCt}], transaction})

          /*
          const cteNfe = await db.CteNfe.findOne({attributes: ['id'], where: [{IDCte: req.body.cteId, IDNota: nfe.id}], transaction})

          if (cteNfe) {
            res.status(201).json({message: 'Conhecimento já está incluída!'})
            return
          }

          if (!nfe) {

          }
          */

          await db.Cte.update({shippimentId: req.body.shippimentId}, {where: [{chaveCt: req.body.chaveCt}], transaction})
          
          res.status(200).json({})

        })


      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  async submit(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        let shippiment = {
          id: req.body.id,
          documento_transporte: req.body.documento_transporte,
          senderId: req.body.sender?.id,
          proPred: req.body.proPred
        }

        console.log(shippiment)

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          if (_.isEmpty(shippiment.id)) {
            shippiment = await db.Shippiment.create(shippiment, {transaction})
          } else {
            await db.Shippiment.update(shippiment, {where: [{codigo_carga: shippiment.id}], transaction})
          }

        })

        res.status(200).json(shippiment)

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

}