import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import FormBookingValidator from 'App/Validators/FormBookingValidator'

export default class BookingsController {
  public async index ({}: HttpContextContract) {
  }

  public async store ({request, response, params, auth}: HttpContextContract) {
    const field = await Field.findByOrFail('id', params.field_id)
    const user = auth.user!

    const payload = await request.validate(FormBookingValidator)

    const booking = new Booking()
    booking.playDateStart = payload.play_date_start
    booking.playDateEnd = payload.play_date_end

    booking.related('field').associate(field)
    user.related('myBookings').save(booking)

    return response.created({status: 'created', data: booking})
  }

  public async show ({params, response}: HttpContextContract) {
    const booking = await Booking.query().where('id', params.id).preload('players', (userQuery) => {
      userQuery.select(['id', 'name', 'email'])
    }).withCount('players').firstOrFail()


    return response.ok({status: 'success', data: booking})
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }

  public async join ({response, auth, params}: HttpContextContract){
    const booking = await Booking.firstOrFail(params.id)
    let user = auth.user!
    const checkJoin = await Database.from('schedules').where('booking_id', params.id).where('user_id', user.id).first()
    if (!checkJoin) {
      await booking.related('players').attach([user.id])
    }else {
      await booking.related('players').detach([user.id])
    }
    return response.ok({status: 'success', message: 'successfully join/unjoin'})
  }

  public async get_schedules({response}: HttpContextContract){
    try {
      const data = await Database.from('schedules')
  
      return response.ok({status: 'success', data})
    } catch (error) {
      return response.badRequest({status: 'failed'})
    }
  }
}
