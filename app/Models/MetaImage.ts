import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MetaImage extends BaseModel {
  @column()
  public path: string

  @column()
  public image: string

  @column()
  public revalidate: number

  @column()
  public metadata: Record<string, unknown>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
