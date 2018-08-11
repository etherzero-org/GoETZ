module.exports = function (address, network) {
  const net = parseInt(network)
  let link
  switch (net) {
    case 90: // main net
      link = `https://etzscan.com/addr/${address}`
      break
    case 2: // morden test net
      link = `https://etzscan.com/addr/${address}`
      break
    case 3: // ropsten test net
      link = `https://etzscan.com/addr/${address}`
      break
    case 4: // rinkeby test net
      link = `https://etzscan.com/addr/${address}`
      break
    case 42: // kovan test net
      link = `https://etzscan.com/addr/${address}`
      break
    default:
      link = ''
      break
  }

  return link
}
