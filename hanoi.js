const Pole = require('./pole')
class Hanoi {
  constructor (poles) {
    this.poles = poles
  }
  minimumMoves () {
    return Math.pow(2, this.poles.length)
  }
  canRemove (poles, pole) {
    console.log('can remove', poles[pole])
    return poles[pole].canRemove()
  }
  remove (poles, yes) {
    let pole = Math.floor(Math.random() * poles.length)
    while (!this.canRemove(poles, pole)) {
      pole = Math.floor(Math.random() * poles.length)
    }
    return [poles[pole].remove(), pole]
  }
  canAdd (poles, pole, value) {
    return poles[pole] && poles[pole].canAdd(value)
  }
  add (poles, value) {
    let pole = Math.floor(Math.random() * poles.length)
    while (!this.canAdd(poles, pole, value)) {
      pole = Math.floor(Math.random() * poles.length)
    }
    poles[pole].add(value)
    return pole
  }
  state (poles) {
    const scores = poles.reduce((a, b) => {
      return a.concat(b.values.length)
    }, []).join('')
    const formation = poles.reduce((a, b) => {
      return a.concat([...b.values].sort().join(','))
    }, []).join(':')
    return [scores, '(', formation, ')'].join('')
  }
  numberOfDiscs (poles) {
    return Math.max(...poles.reduce((a, b) => {
      return a.concat(b.values.length)
    }, []))
  }
  play () {
    let numberOfMoves = 0
    let rewardMatrix = {}
    let qState = {}
    let lastStep = 0

    // rewardMatrix['Q(003(::1,2,3), 1:2:1)'] = 100
    rewardMatrix['Q(002(::1,2), 1:2:1)'] = 100
    rewardMatrix['Q(002(::1,2), 0:2:1)'] = 100

    Array(10).fill(0).forEach((_, i) => {
      let poles = JSON.parse(JSON.stringify(this.poles))
      poles = poles.map((pole) => {
        return new Pole(pole.values)
      })
      const finalLength = this.numberOfDiscs(poles)
      console.log('copy:', poles)
      while (poles[poles.length - 1].values.length !== finalLength) {
        const [peg, start] = this.remove(poles)
        const end = this.add(poles, peg)
        console.log(`move ${peg} from ${start} to ${end}`)
      // Describes the states for each poles
        const state = this.state(poles)
        const action = `${start}:${end}:${peg}`
      // Create a R-Matrix (reward) that contains state x action
        const q = `Q(${state}, ${action})`

        if (!qState[q]) {
          qState[q] = 0
        } else {
          const r = rewardMatrix[lastStep] ? rewardMatrix[lastStep] : 0
          qState[q] = r + 0.8 * qState[q]
        }
        lastStep = q
        numberOfMoves += 1
        console.log('qlast', q)
      }
      console.log(`completed in ${numberOfMoves} moves with #lastStep = ${lastStep}`, poles)
    })
    console.log('reward', rewardMatrix)
    console.log('q', qState)
  }
}

module.exports = Hanoi
