const faunadb = require('faunadb')
const FaunaError = require('../errors/fauna-error')

// We do this so that our FQL code is cleaner
const {Login, Match, Index} = faunadb.query;

module.exports = {
  // Validation schema for the Fastify route
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: {type: 'string'},
        password: {type: 'string'}
      }
    }
  },
  async handler (request, reply) {

    const {username, password} = request.body

    // FAUNA_SERVER_SECRET comes from our .env file
    const client = new faunadb.Client({
      secret: process.env.FAUNA_SERVER_SECRET
    })

    try {

      // Authenticate with FaunaDB
      const result = await client.query(
        Login(
          Match(Index('Users_by_username'), username),
          {password}
          )
        )

      // If the authentication was succesful
      // return the secret to the client
      reply.send({
        secret: result.secret
      })

    } catch (error) {
      throw new FaunaError(error)
    }
  }
}