require('dotenv').config()
import sigUtil from 'eth-sig-util'
import { signingParams } from '../assets/auth'
import axios from 'axios'

// setup firebase w serviceAccountKey.json
var admin = require('firebase-admin')
const serviceAccount = require('../../serviceAccountKey.json')
console.log('serviceAccount', serviceAccount)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://eac-chat-ddecb.firebaseio.com'
})

const mainnet = 1
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
  'Origin, X-Requested-With, Content-Type, Accept',
}

export const handler = function(event, context, callback) {
  if (event.httpMethod !== 'POST') {
    return callback(null, {
      headers,
      statusCode: 200,
      body: JSON.stringify({msg: 'Nope'})
    })
  }

  // get POST values
  let data = JSON.parse(event.body)
  let network = data.network

  // recover address used to sign
  let recovered
  try {
    recovered = sigUtil.recoverTypedSignature({
      data: signingParams,
      sig: data.signature
    })
  } catch(error) {
    return callback(error)
  }

  // confirm address and signature match (unnecessary)
  if (recovered.toLowerCase() !== data.account.toLowerCase()) {
    return callback(null, {
      headers,
      statusCode: 500,
      body: 'signature doesnt match account'
    })
  }

  // get token balances using the proper network id
  axios({
    url: 'https://web3api.io/api/v1/addresses/' + recovered + '/tokens', 
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'x-amberdata-api-key': network === mainnet ? process.env.AMBER_DATA_MAINNET_KEY : process.env.AMBER_DATA_RINKEBY_KEY,
      'x-amberdata-blockchain-id': network === mainnet ? process.env.AMBER_DATA_MAINNET : process.env.AMBER_DATA_RINKEBY
    }
  
  // authenticate the user with firebase and give them token specific permissions
  }).then((response) => {
    // network specific firebase user id
    var uid = recovered + '-' + (network === mainnet ? '1' : '4')

    // add access to lobby
    let additionalClaims = {lobby: true}

    // add access to tokens with balance > 0
    response.data.payload.records.forEach(r => {
      additionalClaims['0x' + r.address] = parseInt(r.balance) > 0 && r.symbol !== ''
    })

    // create token with additional claims
    admin.auth().createCustomToken(uid, additionalClaims).then((customToken) => {
      let body = JSON.stringify({
        customToken,
        data: response.data,
        additionalClaims
      })

      // send back custom token, token balances and additional claims
      callback(null, {
        headers,
        statusCode: '200',
        body
      })
    }).catch((error) => {
      console.log('Error creating custom token:', error)
      callback(error)
    })
  }).catch(error => {
    console.log('axios error')
    callback(error)
  })
}
