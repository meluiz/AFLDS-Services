import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'meta_images'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('path')
      table.string('image')
      table.json('metadata')
      table.integer('revalidate')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
