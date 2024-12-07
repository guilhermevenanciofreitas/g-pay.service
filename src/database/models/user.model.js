import Sequelize from 'sequelize'

export class User {

  id = {
    field: 'UserId',
    primaryKey: true,
    type: Sequelize.UUID
  }

  login = {
    field: 'UserName',
    type: Sequelize.STRING
  }

  password = {
    field: 'password',
    type: Sequelize.STRING
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