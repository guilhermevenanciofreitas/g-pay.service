import Sequelize from 'sequelize'

export class Task {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.UUID
  }

  schedule = {
    field: 'schedule',
    type: Sequelize.STRING(20)
  }
  
  methodId = {
    field: 'methodId',
    type: Sequelize.UUID
  }

  arguments = {
    field: 'arguments',
    type: Sequelize.JSONB
  }

  inactivatedAt = {
    field: 'inactivatedAt',
    type: Sequelize.DATE
  }

  deletedAt = {
    field: 'deletedAt',
    type: Sequelize.DATE
  }

  status = {
    field: 'status',
    type: Sequelize.STRING
  }

}