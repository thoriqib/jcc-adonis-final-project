import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
    public async register({request, response}: HttpContextContract){
        const payload = await request.validate(RegisterValidator)

        const newUser = await User.create(payload)

        return response.created({status: 'success', data: newUser})
    }

    public async login({request, response, auth}: HttpContextContract){
        const loginSchema = schema.create({
            email: schema.string({ trim: true }),
            password: schema.string({ trim: true }),
        })

        const payload = await request.validate({ schema: loginSchema })
        const token = await auth.use('api').attempt(payload.email, payload.password)

        return response.ok({ status: 'success', data: token})

    }
}
