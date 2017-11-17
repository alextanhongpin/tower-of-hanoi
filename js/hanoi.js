const Pole = require('./pole')

// const moves = {
//   aaa: ['baa', 'caa'],
//   baa: ['aaa', 'caa'],
//   bca: ['baa', 'aca', 'cca'],
//   cca: ['bca', 'aca', 'cca'],
//   ccb: ['cca', 'acb', 'bcb'],
//   acb: ['ccb', 'bcb', 'cca'],
//   abb: ['acb', 'bbb', 'cbb'],
// }

class Hanoi {
  constructor (poles) {
    this.poles = poles
  }
  minimumMoves () {
    return Math.pow(2, this.poles.length)
  }
  canRemove (poles, pole) {
    return poles[pole].canRemove()
  }
  remove (poles) {
    let pole = Math.floor(Math.random() * poles.length)
    while (!this.canRemove(poles, pole)) {
      pole = Math.floor(Math.random() * poles.length)
    }
    return [poles[pole].remove(), pole]
  }
  canAdd (poles, pole, value) {
    return poles[pole] && poles[pole].canAdd(value)
  }
  combinations (poles) {
    const labels = 'abcdefghijklmnopqrstuvwxyz'
    const count = poles.length
    return Array(count).fill(0).map((_, i) => {
      return Array(count).fill(0).map((_, j) => {
        return Array(count).fill(0).map((_, k) => {
          return labels[i] + labels[j] + labels[k]
        }).reduce((a, b) => a.concat(b), [])
      }).reduce((a, b) => a.concat(b), [])
    }).reduce((a, b) => a.concat(b), [])
  }
  checkPossibleMoves (values) {
    // return this.combinations([1, 2, 3])
    const output = Array(3).fill(0).map((_, i) => {
      return Array(9).fill(0).map((_, j) => {
        const arr = [...values.split('')]
        arr[i] = 'abc'[j % 3]
        return arr.join('')
      })
    }).reduce((a, b) => a.concat(b))

    return [...new Set(output)]
  }
  mapStrToPoles (values) {
    const a = values.match(/a/g)
    const b = values.match(/b/g)
    const c = values.match(/c/g)

    return [
      this.poleWithDiscs((a && a.length) || 0),
      this.poleWithDiscs((b && b.length) || 0),
      this.poleWithDiscs((c && c.length) || 0)
    ]
  }
  poleWithDiscs (len) {
    return Array(len).fill(0).map((_, i) => {
      return i + 1
    }).reverse()
  }
  add (poles, value) {
    let pole = Math.floor(Math.random() * poles.length)
    while (!this.canAdd(poles, pole, value)) {
      pole = Math.floor(Math.random() * poles.length)
    }
    poles[pole].add(value)
    return [poles, pole]
  }
  state (poles) {
    const output = Array(3).fill(0)
    for (let i = 0; i < poles.length; i += 1) {
      const value = poles[i].values
      const key = 'abc'[i]
      if (value.indexOf(1) !== -1 && output[0] === 0) {
        output[0] = key
      }
      if (value.indexOf(2) !== -1 && output[1] === 0) {
        output[1] = key
      }
      if (value.indexOf(3) !== -1 && output[2] === 0) {
        output[2] = key
      }
    }
    return output.join('')
  }
  numberOfDiscs (poles) {
    return Math.max(...poles.reduce((a, b) => {
      return a.concat(b.values.length)
    }, []))
  }
  play () {
    let numberOfMoves = 0
    let rewardMatrix = {
      acc: {
        ccc: 100
      },
      bcc: {
        ccc: 100
      }
    }
    let qState = {}

    // console.log(action)
    Array(10).fill(0).forEach((_, i) => {
      let poles = JSON.parse(JSON.stringify(this.poles))
      poles = poles.map((pole) => {
        return new Pole(pole.values)
      })
      const finalLength = this.numberOfDiscs(poles)
      while (poles[poles.length - 1].values.length !== finalLength) {
        const state = this.state(poles)
        const [peg, start] = this.remove(poles)
        const [updatedPoles, end] = this.add(poles, peg)
        console.log('#updatedPoles', updatedPoles)

        // console.log(`move ${peg} from ${start} to ${end}`)
        // Describes the states for each poles
        const action = this.state(updatedPoles)
        if (!qState[state]) {
          qState[state] = {}
        }
        if (!qState[state][action]) {
          qState[state][action] = 0
        }
        const r = rewardMatrix[state] && rewardMatrix[state][action] ? rewardMatrix[state][action] : 0
        console.log('this.checkPossibleMoves(action)', this.checkPossibleMoves(action))
        const maxReward = Math.max(...this.checkPossibleMoves(action).map((move) => {
          return qState[action] && qState[action][move] ? qState[action][move] : 0
        }))

        console.log('maxreward', maxReward)
        qState[state][action] = r + 0.8 * maxReward

        numberOfMoves += 1
      }
      console.log(`completed in ${numberOfMoves} moves with #lastStep`, qState)
    })
  }
}

module.exports = Hanoi
