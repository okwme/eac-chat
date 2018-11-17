// import eth from 'ethjs'
import sigUtil from 'eth-sig-util'
import { signingParams } from '../assets/auth'

export function handler(event, context, callback) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
  };
  console.log(event)
  if (event.httpMethod === 'POST') {

    let data = JSON.parse(event.body)
    console.log(data)
    console.log(signingParams[0])
    console.log(data.signature)
    const recovered = sigUtil.recoverTypedSignature({
      data: signingParams,
      sig: data.signature
    })
    console.log('recovered', recovered)
    console.log('account', data.account)
    let body, statusCode
    if (recovered.toLowerCase() === data.account.toLowerCase()) {
      statusCode = 200
      body = 'yeeeeeeea boi'
    } else {
      statusCode = 500
      body = 'nop'
    }
    callback(null, {
      headers,
      statusCode,
      body
    })
  } else {

    callback(null, {
      headers,
      statusCode: 200,
      body: JSON.stringify({msg: "Nope"})
    })
  }

}
