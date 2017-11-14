function main () {
  class Pole {
    constructor (values = []) {
      this.values = values
    }
    add (value) {
      if (!this.values.length) {
        // Empty pole, can add value
        this.values.push(value)
        return true
      }
      // Check the last value
      const curr = this.values[this.values.length - 1]
      if (curr - value === 1) {
        // One class bigger, can add it
        this.values.push(value)
        return true
      }
      return false
    }
    remove () {
      if (this.values.length) {
        return this.values.pop()
      }
      return false
    }
  }
  class Hanoi {
    constructor (poles) {
      this.poles = poles
    }
    remove () {
      const pole = Math.floor(Math.random() * this.poles.length)
      const value = this.poles[pole].remove()

      return [value, pole]
    }
    add (value) {
      let pole
      while (true) {
        pole = Math.floor(Math.random() * this.poles.length)
        if (this.poles[pole].add(value)) {
          break
        }
      }
      return pole
    }
    play () {
      let numberOfMoves = 0
      while (this.poles[this.poles.length - 1].values.length !== this.poles.length) {
        const [peg, start] = this.remove()
        if (peg !== false) {
          const end = this.add(peg)
          console.log(`move ${peg} from ${start} to ${end}`)
          numberOfMoves += 1
        }
      }
      console.log(`completed in ${numberOfMoves} moves`, this.poles)
    }
  }
  const hanoi = new Hanoi([
    new Pole([3, 2, 1]),
    new Pole([]),
    new Pole([])
  ])
  hanoi.play()
  // move([[3, 2, 1], [], []])
  // move([3, 2], [], [1]) // Pop the A one, push to the 3rd one
  // move([3], [2], [1]) // Pop the B one, push to the 2nd one
  // move([3], [2, 1], []) // Pop the A one, push to the 2nd one
  // move([], [2, 1], [3]) // Pop the 1st one, push to the 3rd one
  // move([1], [2], [3]) // Pop the 2nd one, push to 1st one...
  // move([1], [], [3, 2])
  // move([], [], [3, 2, 1])
}

main()
