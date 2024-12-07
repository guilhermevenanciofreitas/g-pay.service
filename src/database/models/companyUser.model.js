import Sequelize from 'sequelize'

export class CompanyUser {

  id = {
    field: 'id',
    primaryKey: true,
    type: Sequelize.UUID
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.UUID
  }

  userId = {
    field: 'userId',
    type: Sequelize.UUID
  }

  roleId = {
    field: 'roleId',
    type: Sequelize.UUID
  }

}