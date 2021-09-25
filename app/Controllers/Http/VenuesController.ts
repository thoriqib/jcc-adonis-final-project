import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
import Venue from 'App/Models/Venue'

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
            const venue = await Venue.query().where('id', params.id).preload('fields').first()
            response.status(200).json({
                status: 'success get venues',
                data: venue
            })
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async update({params, request, response}: HttpContextContract){
        try {
            let id = params.id
            let affectedRows = await Venue.updateOrCreate({id}, {
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
            let venue = await Venue.findByOrFail('id', params.id)
            await venue.delete()
            response.ok({message: 'deleted!'})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }
}
