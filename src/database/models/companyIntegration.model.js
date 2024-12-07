import Sequelize from 'sequelize';

export class CompanyIntegration {

  id = {
    field: 'id',
    primaryKey: true,
    type: Sequelize.UUID
  }

  companyId = {
    field: 'companyId',
    type: Sequelize.UUID
  }

  integrationId = {
    field: 'integrationId',
    type: Sequelize.UUID
  }

  options = {
    field: 'options',
    type: Sequelize.JSONB
  }

}