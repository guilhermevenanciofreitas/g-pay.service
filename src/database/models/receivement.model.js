import Sequelize from 'sequelize'

export class Receivement {

  id = {
    field: 'codigo_movimento',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  companyId = {
    field: 'CodigoEmpresaFilial',
    type: Sequelize.SMALLINT
  }

  releaseDate = {
    field: 'data_movimento',
    type: Sequelize.TEXT
  }

  issueDate = {
    field: 'dataEmissao',
    type: Sequelize.TEXT
  }

  documentNumber = {
    field: 'numero_documento',
    type: Sequelize.INTEGER
  }

  payerId = {
    field: 'codigo_pessoa',
    type: Sequelize.BIGINT
  }

  categorieId = {
    field: 'IDPlanoContasContabil',
    type: Sequelize.INTEGER
  }

  description = {
    field: 'descricao',
    type: Sequelize.STRING(1000)
  }

  /*
  currencyMethodId = {
    field: 'currencyMethodId',
    type: Sequelize.UUID
  }

  

  dueDate = {
    field: 'dueDate',
    type: Sequelize.DATE
  }

  bankAccountId = {
    field: 'bankAccountId',
    type: Sequelize.UUID
  }
  */
  /*
  cashierBalanceId = {
    field: 'cashierBalanceId',
    type: DataTypes.UUID
  }
  */

  total = {
    field: 'valor_total',
    type: Sequelize.DECIMAL(18, 2)
  }

  /*
  fee = {
    field: 'fee',
    type: DataTypes.DECIMAL(18, 2)
  }

  discount = {
    field: 'discount',
    type: DataTypes.DECIMAL(18, 2)
  }
  */

  createdAt = {
    field: 'DataInsert',
    type: Sequelize.TEXT
  }

}