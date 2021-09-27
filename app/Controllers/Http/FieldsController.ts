import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Field from 'App/Models/Field'
import Venue from 'App/Models/Venue'

export default class FieldsController {
    //Mendapatkan semua data fields dari semua venue
    public async getAll({response}: HttpContextContract){
        try {
            const fields = await Database.from('fields').select('*')
            response.status(200).json({
                message: 'success get fields',
                data: fields
            })
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    //mendapatkan data fields berdasarkan venue
    public async index({params, response}: HttpContextContract){
        try {
            const fields = await Database.from('fields').where('venue_id', params.venue_id).select('*')
            response.status(200).json({
                message: 'success get fields',
                data: fields
            })
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async store({params, request, response}: HttpContextContract){
        try {
            let venue = await Venue.findByOrFail('id', params.venue_id)

            let newField = new Field()
            newField.name = request.input('name')
            newField.type = request.input('type')
            await newField.related('venue').associate(venue)

            response.created({status: 'created!', data: newField})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async show({params, response}: HttpContextContract){
        try {
            const field = await Field.query().where('id', params.id).preload('bookings', (bookingQuery) => {
                bookingQuery.select(['title', 'play_date_start', 'play_date_end'])
              }).firstOrFail()
          
            return response.ok({status: 'success', data: field})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async update({params, request, response}: HttpContextContract){
        try {
            let id = params.id
            let affectedRows = await Database.from('fields').where('id', id).update({
                name: request.input('name'),
                type: request.input('type'),
                venue_id: params.venue_id
            })
            response.ok({message: 'updated!', data: affectedRows})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }

    public async destroy({params, response}: HttpContextContract){
        try {
            let id = params.id
            await Database.from('fields').where('id', id).delete()
            response.ok({message: 'deleted!'})
        } catch (error) {
            response.badRequest({errors: error})
        }
    }
}
