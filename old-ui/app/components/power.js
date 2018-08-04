const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const formatPower = require('../util').formatPower
const Tooltip = require('./tooltip.js')

module.exports = PowerComponent

inherits(PowerComponent, Component)
function PowerComponent () {
  Component.call(this)
}

PowerComponent.prototype.render = function () {
  var props = this.props
  console.log('PPP:',props)
  let { value } = props
  const { style, width } = props
  var needsParse = this.props.needsParse !== undefined ? this.props.needsParse : true
  value = value ? formatPower(value, 6, needsParse) : '0'

  return (

    h('.div', {
      style,
    }, [
      h('div', {
        style: {
          display: 'inline',
          width,
        },
      }, this.renderPower(value)),
    ])

  )
}
PowerComponent.prototype.renderPower = function (value) {
  var props = this.props
  console.log('PPP:',props)
  const { powers } = props
  let widthlong = 0
  let maxpower = (Math.exp(-1/(Number(value)*50)*10000) *10000000 + 200000)*18*Math.pow(10,9)/Math.pow(10,18)
  let availablepower = powers.power
  widthlong = Math.round(Number(availablepower) / Number(maxpower) * 10000) / 100

  return (
    h(Tooltip, {
      position: 'bottom',
      title: `${availablepower} / ${maxpower}`,
    }, h('div.flex-column', [
        h('div', {
            style: {
              width: `${widthlong}%`,
              color:'#0A5448',
              backgroundColor: 'rgba(128,185,242,1)',
              fontSize: '12px',
              textAlign: 'center'
            },
          }, `Power:${widthlong}%`)
    ]))
  )
}
