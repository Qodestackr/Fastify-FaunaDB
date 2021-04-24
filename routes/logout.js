const faunadb = require('faunadb')
const FaunaError = require('../errors/fauna-error')

// We do this so that our FQL code is cleaner
const {Logout} = faunadb.query

module.exports = {
  config: {
  	isPrivate: true
  },
  // Validation schema for the Fastify route
  schema: {
    body: {
      type: 'object',
      required: ['deleteAllTokens'],
      properties: {
        deleteAllTokens: {type: 'boolean'}
      }
    }
  },
  async handler (request, reply) {

    // request.faunaSecret is created in the private hook
    const client = new faunadb.Client({
      secret: request.faunaSecret
    })

    try {

      // Logout from FaunaDB
      const result = await client.query(
        Logout(request.body.deleteAllTokens)
      )

      reply.send()

    } catch (error) {
      throw new FaunaError(error)
    }
  }
}