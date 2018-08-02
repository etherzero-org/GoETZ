const ObservableStore = require('obs-store')
const extend = require('xtend')
const log = require('loglevel')

// every ten second
const POLLING_INTERVAL = 10 * 1000

class PowerController {

  constructor (opts = {}) {
    const initState = extend({
      power: {},
    }, opts.initState)
    const { address } = opts
    
    // log.debug("AAA",opts)
    this.address = address
    this.store = new ObservableStore(initState)
  }

  //
  // PUBLIC METHODS
  //

  // Responsible for retrieving the status of Infura's nodes. Can return either
  // ok, degraded, or down.
  async checkPowerNetworkStatus () {
    // const response = await fetch(`https://openetz.org/api/v1/getPower?address=${this.address}`)
    const response = await fetch(`https://openetz.org/etzq/api/v1/getPower?address=${this.address}`)
    const parsedResponse = await response.json()
    let result = ""
    if(!parsedResponse.result){
        result = "0.0036"
    }else{
        result = parsedResponse.result
    }
    const data = {
        address:this.address,
        power:result
    }
    this.store.updateState({
        power: data,
    })
    return parsedResponse
  }

  schedulePowerNetworkCheck () {
    if (this.conversionInterval) {
      clearInterval(this.conversionInterval)
    }

    this.conversionInterval = setInterval(() => {
        this.checkPowerNetworkStatus().catch(log.warn)
        }, POLLING_INTERVAL)

  }

}

module.exports = PowerController
