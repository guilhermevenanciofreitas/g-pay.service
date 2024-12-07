import Sequelize from 'sequelize';

export class CompanyRole {

  id = {
    field: 'id',
    primaryKey: true,
    type: Sequelize.UUID
  };

  companyId = {
    field: 'companyId',
    type: Sequelize.UUID
  };

  roleId = {
    field: 'roleId',
    type: Sequelize.UUID
  };

}