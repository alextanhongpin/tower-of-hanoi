class QLearning {
  constructor () {
    this.gamma = 0.8
    this.alpha = 1
    this.episodes = 1e3
    this.states = 6
    this.epsilon = 0.05
  }
}

function mapToStr (values) {
  const a = values.match(/a/g)
  console.log(a && a.length)
  return a && a.length
}

function strToArray (len) {
  return Array(len).fill(0).map((_, i) => {
    return i + 1
  }).reverse()
}

console.log(strToArray(mapToStr('aaa')))
