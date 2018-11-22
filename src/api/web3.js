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
      apiKey: process.env.VUE_APP_PORTIS_KEY,
      network: 'mainnet'
    })
  )
}

export const web3 = window.web3