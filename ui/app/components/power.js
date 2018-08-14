const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const connect = require('react-redux').connect
const Tooltip = require('./tooltip-v2.js')

module.exports = connect(mapStateToProps)(PowerComponent)

inherits(PowerComponent, Component)
function PowerComponent() {
    Component.call(this)
}

function mapStateToProps(state) {
    return {
        powers: state.metamask.power,
    }
}

PowerComponent.prototype.render = function () {
    var props = this.props
    const { powers, children, address } = props
    let ispower = 0

    const newArr = powers.filter(function (p) {
        return p.address === address;
    });
    if (newArr.length == 0) {
        ispower = 0
    } else {
        ispower = newArr[0].power
    }

    let value = children.split(" ")[0]
    if (!value) {
        value = 0
    }


    let widthlong = 0
    let maxpower = (Math.exp(-1 / (Number(value) * 50) * 10000) * 10000000 + 200000) * 18 * Math.pow(10, 9) / Math.pow(10, 18)
    let availablepower = ispower || 0
    widthlong = Math.round(Number(availablepower) / Number(maxpower) * 10000) / 100 || 0
    if(Number(availablepower) > Number(maxpower)){
        widthlong = 100
    }

    return (
        h(Tooltip, {
            position: 'bottom',
            title: `${Number(availablepower).toFixed(4)} / ${Number(maxpower).toFixed(4)}`
        }, [
                h('div.powerlabel', {
                    style: {
                        borderStyle: 'solid',
                        borderWidth: '2px',
                        borderColor: 'rgba(128,185,242,1)',
                        width: '180px'
                    }
                }, [
                        h('div', {
                            style: {
                                width: `${widthlong}%`,
                                color: '#0A5448',
                                backgroundColor: 'rgba(128,185,242,1)',
                                fontSize: '14px',
                                textAlign: 'center',
                            },
                        }, `Power:${widthlong}%`)])
            ])
    )
}

PowerComponent.prototype.componentDidMount = function () {
    var props = this.props
    const { powers } = props
}

PowerComponent.prototype.componentDidUpdate = function () {
    var props = this.props
    const { powers } = props

}