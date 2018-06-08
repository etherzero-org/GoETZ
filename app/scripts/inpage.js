/*global Web3*/
cleanContextForImports()
require('web3/dist/web3.min.js')
const log = require('loglevel')
const LocalMessageDuplexStream = require('post-message-stream')
const setupDappAutoReload = require('./lib/auto-reload.js')
const MetamaskInpageProvider = require('./lib/inpage-provider.js')
restoreContextAfterImports()

log.setDefaultLevel(process.env.METAMASK_DEBUG ? 'debug' : 'warn')

//
// setup plugin communication
//

// setup background connection
var metamaskStream = new LocalMessageDuplexStream({
  name: 'inpage',
  target: 'contentscript',
})

// compose the inpage provider
var inpageProvider = new MetamaskInpageProvider(metamaskStream)

//
// setup web3
//

if (typeof window.web3_etz !== 'undefined') {
  throw new Error(`GoETZ detected another web3.
     GoETZ will not work reliably with another web3 extension.
     This usually happens if you have two GoETZ installed,
     or GoETZ and another web3 extension. Please remove one
     and try again.`)
}
var web3_etz = new Web3(inpageProvider)
web3_etz.setProvider = function () {
  log.debug('GoETZ- overrode web3.setProvider')
}
log.debug('GoETZ- injected web3')
// export global web3, with usage-detection
setupDappAutoReload(web3_etz, inpageProvider.publicConfigStore)

// set web3 defaultAccount
inpageProvider.publicConfigStore.subscribe(function (state) {
  web3_etz.eth.defaultAccount = state.selectedAddress
})

// need to make sure we aren't affected by overlapping namespaces
// and that we dont affect the app with our namespace
// mostly a fix for web3's BigNumber if AMD's "define" is defined...
var __define

/**
 * Caches reference to global define object and deletes it to
 * avoid conflicts with other global define objects, such as
 * AMD's define function
 */
function cleanContextForImports () {
  __define = global.define
  try {
    global.define = undefined
  } catch (_) {
    console.warn('GoETZ- global.define could not be deleted.')
  }
}

/**
 * Restores global define object from cached reference
 */
function restoreContextAfterImports () {
  try {
    global.define = __define
  } catch (_) {
    console.warn('GoETZ- global.define could not be overwritten.')
  }
}
