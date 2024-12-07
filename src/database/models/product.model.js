import Sequelize from 'sequelize';

export class Product {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  };

  name = {
    field: 'name',
    type: Sequelize.STRING(100)
  };

  inactivatedAt = {
    field: 'inactivatedAt',
    type: Sequelize.DATE
  }

  deteledAt = {
    field: 'deteledAt',
    type: Sequelize.DATE
  }

  situation = {
    field: 'situation',
    type: Sequelize.VIRTUAL,
  }

}