// import eth from 'ethjs'
require('dotenv').config()
import sigUtil from 'eth-sig-util'
import { signingParams } from '../assets/auth'
import axios from 'axios'
var admin = require('firebase-admin')

var serviceAccount = require('../../serviceAccountKey.json')

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://eac-chat-ddecb.firebaseio.com'
})

export const handler = function(event, context, callback) {
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
	}


	if (event.httpMethod === 'POST') {
		let recovered, data
		try {
			data = JSON.parse(event.body)
			recovered = sigUtil.recoverTypedSignature({
				data: signingParams,
				sig: data.signature
			})
		} catch(error) {
			console.log('error')
			callback(error)
		}
		let body, statusCode
		if (recovered.toLowerCase() === data.account.toLowerCase()) {
			console.log('https://web3api.io/api/v1/addresses/' + recovered + '/tokens')
			axios({
				// url: 'https://jsonplaceholder.typicode.com/posts',
				url: 'https://web3api.io/api/v1/addresses/' + recovered + '/tokens', 
				method: 'GET',
				headers: {
					'accept': 'application/json',
					'x-amberdata-api-key': process.env.AMBER_DATA_MAINNET_KEY,
					'x-amberdata-blockchain-id': process.env.AMBER_DATA_MAINNET
				} 
			}).then((response) => {
				statusCode = response.status
				body = JSON.stringify(response.data)

				var uid = recovered
				var additionalClaims = {rooms: response.data.payload.records.filter(r => parseInt(r.balance) > 0).map(r => r.address)}
				console.log(additionalClaims)
				admin.auth().createCustomToken(uid, additionalClaims)
					.then((customToken) => {
						body = JSON.stringify({
							customToken,
							data: response.data,
							additionalClaims
						})		
						callback(null, {
							headers,
							statusCode,
							body
						})
					})
					.catch((error) => {
						console.log('Error creating custom token:', error)
						callback(error)
					})
			}).catch(error => {
				console.log('axios error')
				callback(error)
			})
		} else {
			console.log('not recovered match')
			statusCode = 500
			body = 'nop'
			callback(null, {
				headers,
				statusCode,
				body
			})
		}
	} else {
		console.log('else')
		callback(null, {
			headers,
			statusCode: 200,
			body: JSON.stringify({msg: 'Nope'})
		})
	}
}
