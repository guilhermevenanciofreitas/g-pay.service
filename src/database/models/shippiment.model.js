import Sequelize from 'sequelize'

export class Shippiment {

  id = {
    field: 'codigo_carga',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT
  }

  tripId = {
    field: 'codigo_viagem',
    type: Sequelize.BIGINT
  }

  documento_transporte = {
    field: 'documento_transporte',
    type: Sequelize.STRING
  }

  peso = {
    field: 'peso',
    type: Sequelize.DECIMAL
  }

  valor_frete = {
    field: 'valor_frete',
    type: Sequelize.DECIMAL
  }

  senderId = {
    field: 'codigo_cliente',
    type: Sequelize.BIGINT
  }

  proPred = {
    field: 'proPred',
    type: Sequelize.TEXT
  }

  quantidade_entrega = {
    field: 'quantidade_entrega',
    type: Sequelize.SMALLINT
  }

  peso = {
    field: 'peso',
    type: Sequelize.DECIMAL(18, 3)
  }

  valor_frete = {
    field: 'valor_frete',
    type: Sequelize.DECIMAL(18, 2)
  }

}