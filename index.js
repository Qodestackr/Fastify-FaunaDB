// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

require('dotenv/config')

// Declare a route
fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/login', require('./routes/login.js'))
fastify.post('/logout', require('./routes/logout.js'))

fastify.post('/users', require('./routes/create-user.js'))
fastify.get('/users/:userId', require('./routes/get-user.js'))
fastify.delete('/users/:userId', require('./routes/delete-user.js'))

// Hooks
fastify.addHook('onRequest', async (request, reply) => {

  // If the route is not private we ignore this hook
  if (!reply.context.config.isPrivate) return

  const faunaSecret = request.headers['fauna-secret']

  // If there is no header
  if (!faunaSecret) {
    reply.status(401).send();
    return
  }

  // Add the secret to the request object
  request.faunaSecret = faunaSecret;
})

// Decorators
fastify.decorateRequest('faunaSecret', '')


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