import Sequelize from 'sequelize';

export class Cashier {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.UUID,
  }

  name = {
    field: 'name',
    type: Sequelize.STRING(30),
  }

}