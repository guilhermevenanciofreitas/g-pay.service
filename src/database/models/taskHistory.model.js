import Sequelize from 'sequelize'

export class TaskHistory {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  entryAt = {
    field: 'entryAt',
    type: Sequelize.DATE
  }

  taskId = {
    field: 'taskId',
    type: Sequelize.UUID
  }

  finishedAt = {
    field: 'finishedAt',
    type: Sequelize.DATE
  }

  error = {
    field: 'error',
    type: Sequelize.STRING(200)
  }
  
}