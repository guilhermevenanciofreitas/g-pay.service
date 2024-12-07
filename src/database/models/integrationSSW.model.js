import Sequelize from 'sequelize';

export class IntegrationSSW {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  code = {
    field: 'code',
    type: Sequelize.STRING(10)
  }

}