/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', async ({ view }) => {
        return view.render('home')
    })      
    Route.resource('venues', 'VenuesController').apiOnly().middleware({
        '*': ['auth', 'verify', 'authorization'],
    })
    Route.resource('venues.fields', 'FieldsController').apiOnly().middleware({
        '*': ['auth', 'verify'],
    })
    Route.resource('fields.bookings', 'BookingsController').apiOnly().middleware({
        '*': ['auth', 'verify'],
    })
    Route.get('/schedules', 'BookingController.get_schedules').middleware(['auth', 'verify'])
    Route.put('/bookings/:id', 'BookingsController.join').middleware(['auth', 'verify']).as('booking.join')
    Route.post('/login', 'AuthController.login').as('auth.login')
    Route.post('/register', 'AuthController.register').as('auth.register')
    Route.post('/otp_verification', 'AuthController.otp_verification').as('auth.verify')
}).prefix('/api/v1')

