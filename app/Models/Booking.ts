import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Field from './Field'
import User from './User'

export default class Booking extends BaseModel {
  public serializeExtras = true 
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc', { keepLocalTime: true }).toFormat('dd LLL yyy hh:mm') : value
    },
  })
  public playDateStart: DateTime

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.setZone('utc', { keepLocalTime: true }).toFormat('dd LLL yyy hh:mm') : value
    },
  })
  public playDateEnd: DateTime

  @column()
  public userId: number

  @column()
  public fieldId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Field)
  public field: BelongsTo<typeof Field>

  @belongsTo(() => User)
  public bookingUser: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'schedules'
  })
  public players: ManyToMany<typeof User>
}
