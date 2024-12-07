import Sequelize from 'sequelize';

export class Rule {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  };

  description = {
    field: 'description',
    type: Sequelize.STRING(100)
  };

}