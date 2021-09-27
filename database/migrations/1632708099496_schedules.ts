import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Schedules extends BaseSchema {
  protected tableName = 'schedules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('booking_id').unsigned().references('id').inTable('bookings')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
