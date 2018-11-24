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
      apiKey: 'f5d4ae50e50d268dadea7cfa5f546cb2',
      network: 'mainnet'
    })
  )
}

export const web3 = window.web3