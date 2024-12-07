import Sequelize from 'sequelize';

export class Application {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  };

  name = {
    field: 'name',
    type: Sequelize.STRING(30)
  };

}