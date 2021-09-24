import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'

export default class VenuesController {
    public async index({response}: HttpContextContract){
        try {
            const venues = await Database.from('venues').select('*')
            response.status(200).json({
                message: 'success get venues',
                data: venues
            })
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async store({request, response}: HttpContextContract){
        try {
            await request.validate(CreateVenueValidator)
            let newVenueId = await Database.table('venues').returning('id').insert({
                name: request.input('name'),
                address: request.input('address'),
                phone: request.input('phone')
            })
            response.created({message: 'created!', id: newVenueId})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async show({params, response}: HttpContextContract){
        try {
            const venue = await Database.from('venues').where('id', params.id).select('*').firstOrFail()
            response.status(200).json({
                message: 'success get venues',
                data: venue
            })
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async update({params, request, response}: HttpContextContract){
        try {
            let id = params.id
            let affectedRows = await Database.from('venues').where('id', id).update({
                name: request.input('name'),
                address: request.input('address'),
                phone: request.input('phone')
            })
            response.ok({message: 'updated!', data: affectedRows})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async destroy({params, response}: HttpContextContract){
        try {
            let id = params.id
            await Database.from('venues').where('id', id).delete()
            response.ok({message: 'deleted!'})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }
}
