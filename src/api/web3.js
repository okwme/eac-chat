require('dotenv').config()
import Web3 from 'web3'
import {
  PortisProvider
} from 'portis'

if (window.ethereum) {
  window.web3 = new Web3(window.ethereum)
} else if (window.web3) {
  window.web3 = new Web3(window.web3.currentProvider)
} else {
  window.web3 = new Web3(
    new PortisProvider({
      apiKey: '4f10a8de9f9fd31b1d6caa907759c00f',
      network: 'mainnet'
    })
  )
}

export const web3 = window.web3