import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateVenueValidator from 'App/Validators/CreateVenueValidator'
import Venue from 'App/Models/Venue'

export default class VenuesController {
    /**
     * @swagger
     *   /api/v1/venues:
     *   get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      responses:
     *       200:
     *          description: 'Will send `Venues`'
     *       401: 
     *          description: 'You do not have necessary permissions for the resource'
     */
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

    /**
     * 
     * @swagger
     * /api/v1/venues:
     *  post:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *           - Venues
     *      requestBody:
     *          description: Data venue baru yang akan ditambahkan
     *          content:
     *          application/json:
     *              schema:
     *              required:
     *                  - name
     *                  - address
     *                  - phone
     *              type: object
     *              properties:
     *               name:
     *                  type: string
     *                  example: Gelora Bung Karno
     *               address:
     *                  type: string
     *                  example: Jl. Sesama No. 5 - Suka Hati Kecamatan Sirnasari, Tanjung Harapan
     *               phone:
     *                  type: string
     *                  example: "+6285123456789"
     *          responses:
     *              200:
     *                  description: 'Berhasil membuat venue'
     *              401: 
     *                  description: 'You do not have necessary permissions for the resource'
     */
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

    /**
     * @swagger
     *   /api/v1/venues/:id:
     *   get:
     *      security:
     *          - bearerAuth: []
     *      tags:
     *          - Venues
     *      parameters:
     *       - name: Id
     *         description: Venue Id
     *         required: true
     *         type: integer
     *      responses:
     *         200:
     *          description: 'Will send `Venues` by id'
     *         401: 
     *          description: 'You do not have necessary permissions for the resource'
     */

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
