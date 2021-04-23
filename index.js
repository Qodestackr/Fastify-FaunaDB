// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

require('dotenv/config')

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/users', require('./routes/create-user.js'))
fastify.get('/users/:userId', require('./routes/get-user.js'))

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()