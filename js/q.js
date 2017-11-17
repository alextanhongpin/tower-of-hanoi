class QLearning {
  constructor () {
    this.gamma = 0.8
    this.alpha = 1
    this.episodes = 1e3
    this.states = 6
    this.epsilon = 0.05
  }
}

function polesToAlphabets (input) {
  const output = Array(3).fill(0)
  for (let i = 0; i < input.length; i += 1) {
    const value = input[i]
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

const a = polesToAlphabets([
  [3, 2],
  [],
  [1]
])
console.log(a)
