const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const request = require('request');
const config = require('../config');

// Authentication middleware
// This middleware will check access token in authorization headers
// of a request
// It will verify access token against Auth0 JSON web key set
exports.checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://dev-2vzf7rez.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://dev-2vzf7rez.us.auth0.com/api/v2/',
  issuer: 'https://dev-2vzf7rez.us.auth0.com/',
  algorithms: ['RS256']
});

exports.checkRole = role => (req, res, next) => {
  const user = req.user;
  console.log(user);
  if (user && user[config.AUTH0_NAMESPACE + '/roles'].includes(role)) {
    next();
  } else {
    return res.status(401).send('You are not authorized to access this resource');
  }
}

exports.getAccessToken = (callback) => {
	/*
	const options = {
		methods: 'POST',
		url: config.AUTH0_TOKEN_URL,
		headers: {'content-type': 'application/json'},
		body: `{"client_id":"${config.AUTH0_CLIENT_ID}","client_secret":"${config.AUTH0_CLIENT_SECRET}","audience":"${config.AUTH0_AUDIENCE}","grant_type":"client_credentials"}` 
	}
//		form: {
//			grant_type: 'client_credentials',
//			client_id: config.AUTH0_CLIENT_ID,
//			client_secret: config.AUTH0_CLIENT_SECRET,
//			audience: config.AUTH0_AUDIENCE
//		}

	request(options, (error, res, body) => {
		if (error) { callback(error); }

		return callback(null, JSON.parse(body));
	});
	*/
	const options = { method: 'POST',
		url: config.AUTH0_TOKEN_URL,
		headers: { 'content-type': 'application/json' },
		body: `{"client_id":"${config.AUTH0_CLIENT_ID}","client_secret":"${config.AUTH0_CLIENT_SECRET}","audience":"${config.AUTH0_AUDIENCE}","grant_type":"client_credentials"}` };

  return new Promise((resolve, reject) => {

		request(options, function (error, response, body) {
			if (error) { 
				return reject(new Error(error)) 
			}

			console.log(body);
			resolve(body ? JSON.parse(body) : '');
		});
	});		
}

exports.getAuth0User = accessToken => userId => {
	const options = {
		method: 'GET',
		url: `${config.AUTH0_AUDIENCE}users/${userId}?fields=name,picture,user_id`,
		headers: { 'authorization': `Bearer ${accessToken}`}
	}

  return new Promise((resolve, reject) => {

		request(options, function (error, response, body) {
			if (error) { 
				return reject(new Error(error)) 
			}

			console.log(body);
			resolve(body ? JSON.parse(body) : '');
		});
	});		
}