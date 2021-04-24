const faunadb = require('faunadb')

const FaunaError = require('../errors/fauna-error')
const {Get, Ref, Collection} = faunadb.query;

module.exports = {
  config: {
    isPrivate: true
  },
  schema: {
    params: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: {
          type: 'string',
          pattern: "[0-9]+"
        }
      }
    }
  },
  async handler (request, reply) {

    const userId = request.params.userId

    const client = new faunadb.Client({
      secret: request.faunaSecret
    })

    try {

        // Get the user document
        const result = await client.query(
            Get(
                Ref(
                    Collection('Users'),
                    userId
                )
            )
        );

        // Return the document
        reply.send(result);

    } catch (error) {
        throw new FaunaError(error)
    }
  }
}