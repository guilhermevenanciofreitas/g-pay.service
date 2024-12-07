import Sequelize from 'sequelize';

export class Company {

  id = {
    field: 'id',
    primaryKey: true,
    type: Sequelize.UUID
  };

  name = {
    field: 'name',
    type: Sequelize.STRING(100)
  };

  surname = {
    field: 'surname',
    type: Sequelize.STRING(80)
  };

}