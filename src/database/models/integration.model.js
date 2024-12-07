import Sequelize from 'sequelize';

export class Integration {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  name = {
    field: 'name',
    type: Sequelize.STRING(50)
  }

  image = {
    field: 'image',
    type: Sequelize.STRING(200)
  }

}