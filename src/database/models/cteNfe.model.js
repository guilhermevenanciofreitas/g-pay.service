import Sequelize from 'sequelize';

export class CteNfe {

  id = {
    field: 'ID',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  cteId = {
    field: 'IDCte',
    type: Sequelize.BIGINT
  }

  nfeId = {
    field: 'IDNota',
    type: Sequelize.BIGINT
  }

}