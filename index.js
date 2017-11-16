const Pole = require('./pole')
const Hanoi = require('./hanoi')

function main () {
  const hanoi = new Hanoi([
    new Pole([2, 1]),
    new Pole([]),
    new Pole([])
  ])
  hanoi.play()
}

main()
