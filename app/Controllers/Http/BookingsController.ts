import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateBookingValidator from 'App/Validators/CreateBookingValidator'

export default class BookingsController {
    public async store({request, response}: HttpContextContract){
        try {
            const payload = await request.validate(CreateBookingValidator)
            response.status(200).json({
                data: payload
            })
        } catch (error) {
            response.badRequest({errors: error})
        }
    }
}
