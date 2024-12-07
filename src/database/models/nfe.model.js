import Sequelize from 'sequelize';

export class NFe {

  id = {
    field: 'codigo_nota',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  chaveNf = {
    field: 'chaveNf',
    type: Sequelize.STRING(44),
  }

}