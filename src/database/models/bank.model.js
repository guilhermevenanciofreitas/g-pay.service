import Sequelize from 'sequelize'

export class Bank {

  id = {
    field: 'id',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.UUID,
  }

  name = {
    field: 'name',
    type: Sequelize.STRING(30)
  }

  image = {
    field: 'image',
    type: Sequelize.STRING(200)
  }

}