function main () {
  class Pole {
    constructor (values = []) {
      this.values = values
    }
    canAdd (value) {
      const isEmpty = !this.values.length
      const isSmallerPeg = this.values[this.values.length - 1] - value === 1
      return isEmpty || isSmallerPeg
    }
    add (value) {
      this.values.push(value)
    }
    canRemove () {
      return this.values.length
    }
    remove () {
      return this.values.pop()
    }
  }
  class Hanoi {
    constructor (poles) {
      this.poles = poles
    }
    canRemove (pole) {
      return this.poles[pole].canRemove()
    }
    remove (yes) {
      let pole = Math.floor(Math.random() * this.poles.length)
      while (!this.canRemove(pole)) {
        pole = Math.floor(Math.random() * this.poles.length)
      }
      return [this.poles[pole].remove(), pole]
    }
    canAdd (pole, value) {
      return this.poles[pole] && this.poles[pole].canAdd(value)
    }
    add (value) {
      let pole = Math.floor(Math.random() * this.poles.length)
      while (!this.canAdd(pole, value)) {
        pole = Math.floor(Math.random() * this.poles.length)
      }
      this.poles[pole].add(value)
      return pole
    }
    play () {
      let numberOfMoves = 0
      while (this.poles[this.poles.length - 1].values.length !== this.poles.length) {
        const [peg, start] = this.remove()
        const end = this.add(peg)
        console.log(`move ${peg} from ${start} to ${end}`)
        numberOfMoves += 1
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
}

main()
