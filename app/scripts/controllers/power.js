const ObservableStore = require('obs-store')
const extend = require('xtend')
const log = require('loglevel')

// every ten second
const POLLING_INTERVAL = 10 * 1000

class PowerController {

  constructor(opts = {}) {
    const initState = extend({
      power: [],
    }, opts.initState)

    this.address = null
    this.store = new ObservableStore(initState)
  }

  //
  // PUBLIC METHODS
  //

  // Responsible for retrieving the status of Infura's nodes. Can return either
  // ok, degraded, or down.
  async checkPowerNetworkStatus() {
    let arr = new Array()
    if (this.address) {
      for(let i=0;i<this.address.length;i++){
        const response = await fetch(`https://easyetz.io/etzq/api/v1/getPower?address=${this.address[i]}`)
        const parsedResponse = await response.json()
        let result = ""
        if (!parsedResponse.result) {
          result = "0.0036"
        } else {
          result = parsedResponse.result
        }
        const data = {
          address: this.address[i],
          power: result
        }
        arr.push(data)
      }

      this.store.updateState({
        power: arr,
      })
      return null
    } else {
      const parsedResponse = null
      const data = {
        address: null,
        power: "0.0036"
      }
      this.store.updateState({
        power: [data],
      })
      return parsedResponse
    }


  }

  getAddress(address) {
    return this.address = address
  }

  schedulePowerNetworkCheck() {
    if (this.conversionInterval) {
      clearInterval(this.conversionInterval)
    }

    this.conversionInterval = setInterval(() => {
      this.checkPowerNetworkStatus().catch(log.warn)
    }, POLLING_INTERVAL)

  }

}

module.exports = PowerController
