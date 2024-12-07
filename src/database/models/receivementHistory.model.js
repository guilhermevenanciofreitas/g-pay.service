import Sequelize from 'sequelize';

export class ReceivementHistory {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  receivementId = {
    field: 'receivementId',
    type: Sequelize.UUID
  };

  cashierBalanceStatementId = {
    field: 'cashierBalanceStatementId',
    type: Sequelize.UUID
  }

  bankAccountStatementId = {
    field: 'bankAccountStatementId',
    type: Sequelize.UUID
  }

}