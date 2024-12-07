import { Sequelize } from "sequelize"
import { Authorization } from "../authorization.js"
import { AppContext } from "../../database/index.js"
import dayjs from 'dayjs'
import _ from 'lodash'
import { taskEmitter } from "../../taskEvents.js"

export class TaskController {

  tasks = async (req, res) => {
    Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter // || { situation: ['active'] }

        const status = req.body.status

        const where = [{companyId: company.id}]

        if (status) {
          where.push({status})
        }

        await db.transaction(async (transaction) => {

          const tasks = await db.Task.findAndCountAll({
            attributes: ['id', 'status'],
            include: [
              {model: db.TaskMethod, as: 'method', attributes: ['id', 'name']}
            ],
            limit: limit,
            offset: offset * limit,
            where,
            order: [['method', 'name', 'asc']],
            transaction
          })

          const taskStatus = await db.Task.findAll({
            attributes: ['status', [Sequelize.literal(`COALESCE(COUNT("status"), 0)`), 'statusCount']],
            where: [{companyId: company.id}],
            group: ['status'],
            raw: true
          })

          res.status(200).json({
            request: {
              status, filter, limit, offset
            },
            response: {
              status: taskStatus, rows: tasks.rows, count: tasks.count
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

  detail = async (req, res) => {
    Authorization.verify(req, res).then(async() => {
      try {

        const db = new AppContext()

        await db.transaction(async (transaction) => {
          
          const task = await db.Task.findOne({
            attributes: ['id', 'schedule', 'status'],
            include: [
              {model: db.TaskMethod, as: 'method', attributes: ['id', 'name']}
            ],
            where: [{id: req.body.id}],
            transaction
          })
  
          res.status(200).json(task)

        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  submit = async (req, res) => {
    Authorization.verify(req, res).then(async () => {
      try {

        let task = req.body

        task.inactivatedAt = task.status == 'inactivated' ? dayjs().format('YYYY-MM-DD HH:mm') : null
        task.methodId = task.method?.id

        const db = new AppContext()

        await db.transaction(async (transaction) => {
          
          if (_.isEmpty(task.id)) {
            await db.Task.create(_.omit(task, ['status']), {transaction})
          } else {
            await db.Task.update(_.omit(task, ['status']), {where: [{id: task.id}], transaction})
          }

          taskEmitter.emit('taskUpdated')

        })

        res.status(200).json(task)

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    }).catch((error) => {
      res.status(400).json({message: error.message})
    })
  }

  histories = async (req, res) => {
    Authorization.verify(req, res).then(async() => {
      try {

        const db = new AppContext()

        let histories = []

        await db.transaction(async (transaction) => {
          
          histories = await db.TaskHistory.findAndCountAll({
            attributes: ['id', 'entryAt', 'finishedAt', 'error'],
            where: [{taskId: req.body.taskId}],
            order: [['entryAt', 'desc']],
            transaction
          })

        })

        res.status(200).json({
          request: {
            //filter, limit, offset
          },
          response: {
            rows: histories.rows, count: histories.count
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