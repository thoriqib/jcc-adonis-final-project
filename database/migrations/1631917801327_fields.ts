import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Fields extends BaseSchema {
  protected tableName = 'fields'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name')
      table.enum('type', ['futsal', 'mini soccer', 'basketball' ])
      table.integer('venue_id').unsigned()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamps(true, true)
      table.foreign('venue_id').references('id').inTable('venues')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
