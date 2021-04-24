// Beware:
// This is a very basic form of authentication.
// Don't do this in a production app.
// Always use HTTPS.

module.exports = async function (request, reply) {

	// If the route is not private we ignore this hook
	if (!reply.context.config.isPrivate) return

	const faunaSecret = request.headers['fauna-secret']

	// If there is no header
	if (!faunaSecret) {
		reply.status(401).send()
		return
	}

	request.faunaSecret = faunaSecret
}