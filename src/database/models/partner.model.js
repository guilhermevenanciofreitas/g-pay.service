import Sequelize from 'sequelize'

export class Partner {

  id = {
    field: 'codigo_pessoa',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID
  }

  cpfCnpj = {
    field: 'cpfCnpj',
    type: Sequelize.STRING(14)
  }

  name = {
    field: 'RazaoSocial',
    type: Sequelize.STRING(100)
  }

  surname = {
    field: 'nome',
    type: Sequelize.STRING(100)
  }

  diasPrazoPagamento = {
    field: 'diasPrazoPagamento',
    type: Sequelize.SMALLINT
  }

  ISRemetente = {
    field: 'ISRemetente',
    type: Sequelize.SMALLINT
  }

  ISDestinatario = {
    field: 'ISDestinatario',
    type: Sequelize.SMALLINT
  }

  ativo = {
    field: 'ativo',
    type: Sequelize.SMALLINT
  }

}