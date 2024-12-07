import Sequelize from 'sequelize';

export class RoleRule {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  roleId = {
    field: 'roleId',
    type: Sequelize.UUID
  }

  ruleId = {
    field: 'ruleId',
    type: Sequelize.UUID
  }

}