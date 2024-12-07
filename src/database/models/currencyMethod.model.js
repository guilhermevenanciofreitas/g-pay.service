import Sequelize from 'sequelize'

export class CurrencyMethod {

  id = {
    field: 'id',
    primaryKey: true,
    type: Sequelize.UUID
  }

  name = {
    field: 'name',
    type: Sequelize.STRING(50)
  }

}