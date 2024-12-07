import Sequelize from 'sequelize';

export class Statement {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: Sequelize.UUID,
  }

  sourceId = {
    field: 'sourceId',
    type: Sequelize.STRING,
  }

  createdAt = {
    field: 'createdAt',
    type: Sequelize.DATE
  }

  begin = {
    field: 'begin',
    type: Sequelize.DATE
  }

  end = {
    field: 'end',
    type: Sequelize.DATE
  }

}