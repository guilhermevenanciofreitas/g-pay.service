import { Exception } from "../../utils/exception.js"
import { AppContext } from "../../database/index.js"
import { Sequelize, Op } from "sequelize"
import dayjs from 'dayjs'
import { Authorization } from "../authorization.js"
import _ from 'lodash'

export class SettingRoleController {

  async roles(req, res) {
    Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = []

        //const where = [{[Op.not]: {situation: 'deleted'}}]

        //if (filter['situation']) where.push({situation: filter['situation']})

        const roles = await db.CompanyRole.findAndCountAll({
          attributes: ['id'],
          include: [
            {model: db.Role, as: 'role', attributes: ['id', 'name']}
          ],
          limit: limit,
          offset: offset * limit,
          order: [['role', 'name', 'asc']],
          where
        })

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: _.map(roles.rows, (companyRole) => companyRole.role), count: roles.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  async detail(req, res) {
    Authorization.verify(req, res).then(async () => {
      try {

        const { id } = req.body

        const db = new AppContext()

        const role = await db.Role.findOne({
          attributes: ['id', 'name'],
          include: [
            {model: db.RoleRule, as: 'roleRules', attributes: ['ruleId']}
          ],
          where: [{id}]
        })

        res.status(200).json(role)

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  async submit(req, res) {
    Authorization.verify(req, res).then(async () => {
      try {

        let role = req.body

        const roleRules = [...role.roleRules]

        const db = new AppContext()

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
    })
  }

}