import Sequelize from 'sequelize';

export class BankAccount {

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

  bankId = {
    field: 'bankId',
    type: Sequelize.UUID,
  }

  agency = {
    field: 'agency',
    type: Sequelize.STRING(4)
  }

  agencyDigit = {
    field: 'agencyDigit',
    type: Sequelize.STRING(1)
  }

  account = {
    field: 'account',
    type: Sequelize.STRING(10)
  }

  accountDigit = {
    field: 'accountDigit',
    type: Sequelize.STRING(1)
  }

  integrationId = {
    field: 'integrationId',
    type: Sequelize.UUID
  }

}