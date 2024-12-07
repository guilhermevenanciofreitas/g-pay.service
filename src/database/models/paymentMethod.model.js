import Sequelize from 'sequelize'

export class PaymentMethod {

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

  currencyMethodId = {
    field: 'currencyMethodId',
    type: Sequelize.UUID
  }

}