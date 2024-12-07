import Sequelize from 'sequelize';

export class BankAccountStatement {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  entryAt = {
    field: 'entryAt',
    type: Sequelize.DECIMAL(18, 2),
  }

  partnerId = {
    field: 'partnerId',
    type: Sequelize.UUID,
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: Sequelize.UUID,
  }

  currencyMethodId = {
    field: 'currencyMethodId',
    type: Sequelize.UUID
  }

  categorieId = {
    field: 'categorieId',
    type: Sequelize.UUID,
  }

  amount = {
    field: 'amount',
    type: Sequelize.DECIMAL(18, 2)
  }

}