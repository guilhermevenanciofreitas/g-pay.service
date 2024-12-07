import Sequelize from 'sequelize';

export class CashierBalance {

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

  cashierId = {
    field: 'cashierId',
    type: Sequelize.UUID,
  }

}