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

module.exports = Pole
