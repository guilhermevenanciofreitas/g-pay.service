import Sequelize from 'sequelize'

export class TaskMethod {

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

}