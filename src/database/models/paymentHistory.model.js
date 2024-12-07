import Sequelize from 'sequelize'

export class PaymentHistory {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  paymentId = {
    field: 'paymentId',
    type: Sequelize.UUID
  }

  cashierBalanceStatementId = {
    field: 'cashierBalanceStatementId',
    type: Sequelize.UUID
  }

  bankAccountStatementId = {
    field: 'bankAccountStatementId',
    type: Sequelize.UUID
  }

}