const faunadb = require('faunadb')
const FaunaError = require('../errors/fauna-error')

const {Delete, Ref, Collection} = faunadb.query

module.exports = {
  config: {
    isPrivate: true
  },
  async handler (request, reply) {

    const userId = request.params.userId

    const client = new faunadb.Client({
      secret: request.faunaSecret
    })

    try {

      // Delete the user document
      const resultDelete = await client.query(
        Delete(
          Ref(
            Collection('Users'),
            userId
          )
        )
      )

      // Return the deleted document
      reply.send(resultDelete)

    } catch (error) {
      throw new FaunaError(error);
    }
  }
}