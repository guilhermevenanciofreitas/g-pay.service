import Sequelize from 'sequelize'

export class ReceivementInstallment {

  id = {
    field: 'codigo_movimento_detalhe',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT
  }
  
  receivementId = {
    field: 'codigo_movimento',
    type: Sequelize.BIGINT
  }

  installment = {
    field: 'numero_parcela',
    type: Sequelize.SMALLINT
  }

  description = {
    field: 'Descricao',
    type: Sequelize.STRING(1000)
  }

  dueDate = {
    field: 'data_vencimento',
    type: Sequelize.TEXT
  }

  amount = {
    field: 'valor_parcela',
    type: Sequelize.DECIMAL(18, 2)
  }

  createdAt = {
    field: 'data_sistema',
    type: Sequelize.TEXT
  }
  

}