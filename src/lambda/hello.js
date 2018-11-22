// import eth from 'ethjs'
require('dotenv').config()
import sigUtil from 'eth-sig-util'
import { signingParams } from '../assets/auth'
import axios from 'axios'
var admin = require('firebase-admin')

var serviceAccount = require('../../serviceAccountKey.json')
const mainnet = 1
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
    let recovered, data, network
		
    try {
      data = JSON.parse(event.body)
      network = data.network
      console.log(network)
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
      const request = {
        url: 'https://web3api.io/api/v1/addresses/' + recovered + '/tokens', 
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-amberdata-api-key': network === mainnet ? process.env.AMBER_DATA_MAINNET_KEY : process.env.AMBER_DATA_RINKEBY_KEY,
          'x-amberdata-blockchain-id': network === mainnet ? process.env.AMBER_DATA_MAINNET : process.env.AMBER_DATA_RINKEBY
        } 
      }
      console.log(request)
      axios(request).then((response) => {
        statusCode = response.status
        body = JSON.stringify(response.data)

        var uid = recovered + '-' + (network === mainnet ? '1' : '4')
        let additionalClaims = {lobby: true}
        response.data.payload.records.forEach(r => {
          additionalClaims[r.address] = parseInt(r.balance) > 0
        })
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
