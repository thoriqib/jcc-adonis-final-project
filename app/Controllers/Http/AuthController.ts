import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { schema } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class AuthController {
    public async register({request, response}: HttpContextContract){
        const payload = await request.validate(RegisterValidator)

        const newUser = await User.create(payload)
        let otp_code: number = Math.floor(100000 + Math.random() * 900000)
        await Database.table('otp_codes').insert({otp_code, user_id: newUser.id})
        await Mail.send((message) => {
            message
                .from('adonis.demo@sanberdev.com')
                .to(payload.email)
                .subject('Welcome Onboard!')
                .htmlView('mail/otp_verification', { name: payload.name, otp_code })
        })

        return response.created({status: 'success', data: newUser, message: 'Silakan lakukan verifikasi kode OTP yang telah dikirimkan melalui email anda'})
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

    public async otp_verification({request, response}: HttpContextContract) {
        const otp_code = request.input('otp_code')
        const email = request.input('email')

        const user = await User.findByOrFail('email', email)
        const dataOtp = await Database.from('otp_codes').where('otp_code', otp_code).firstOrFail()

        if(user.id == dataOtp.user_id){
            user.isVerified = true
            await user.save()

            return response.ok({status: 'success', message: 'verification succeded'})
        }else{
            return response.badRequest({status: 'failed', message: 'verification failed'})
        }
    }
}
