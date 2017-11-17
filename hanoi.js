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
    return poles.reduce((a, b, i) => {
      if (b.values.length === 0) {
        return a + ''
      }
      if (b.values.length === 1) {
        const index = b.values[0] - 1
        return a + 'abc'[index]
      } else if (b.values.length === 2) {
        const index = b.values[1] - 1
        a += 'abc'[index]
        a += 'abc'[index]
        return a
      } else {
        const index = b.values[2] - 1
        a += 'abc'[index]
        a += 'abc'[index]
        a += 'abc'[index]
        return a
      }
      // a += b.values.includes(1) ? 'abc'[i] : ''
      // a += b.values.includes(2) ? 'abc'[i] : ''
      // a += b.values.includes(3) ? 'abc'[i] : ''

      // console.log('#alert this.state', a, poles)
      // return a
    }, '')
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
    const action = this.state([
      { values: [3, 2, 1]},
      { values: []},
      { values: []}
    ])

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
