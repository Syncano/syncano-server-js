/**
 * Debug your code.
 * @property {Function}
 */
import chalk from 'chalk'

const LEVELS = ['fatal', 'error', 'warn', 'info', 'debug']
const COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'gray',
  debug: 'blue'
}

class Logger {
  constructor({scope, callback, levels}) {
    this._start = null
    this._scope = scope
    this._callback = callback

    levels.forEach(level => {
      this[level] = this._makePrinter.bind(this, level)
    })
  }

  _makePrinter(...args) {
    this._start = this._start || this._getNow()
    this._level = args.shift()

    const date = this._print(...args)

    if (this._callback) {
      this._callback({args, date, level: this._level})
    }

    this._level = null
  }

  _pad(width, string, padding) {
    return (width <= string.length) ? string : this._pad(width, string + padding, padding)
  }

  _print(...args) {
    const color = COLORS[this._level]

    // Time
    const now = this._getNow()
    const diff = chalk[color](`+${this._calculateDiff(this._start, now)}`)
    const time = chalk.gray(this._getNowString(now).split(' ')[1])

    if (!this._shouldLog(this._scope)) {
      return
    }

    // Level
    const levelName = this._pad(5, `${this._level}`, ' ')
    const level = color ? chalk[color](levelName) : levelName

    args = args.map(this._parseArg).join(' ')

    console.log(level, this._scope, time, diff, args)

    return now
  }

  _shouldLog(scope) {
    if (global.ARGS && global.ARGS.DEBUG) {
      if (typeof global.ARGS.DEBUG === 'boolean') {
        return global.ARGS.DEBUG
      }

      const vars = global.ARGS.DEBUG.split(',')
      const excluded = vars
        .filter(item => /^-/.test(item))
        .map(item => item.replace(/^-/, ''))

      const matchAll = vars.filter(item => item === '*').length
      const isWhitelisted = vars.indexOf(scope) >= 0
      const isExcluded = excluded.indexOf(scope) >= 0

      return (matchAll || isWhitelisted) && !isExcluded
    }

    return false
  }

  _parseArg(arg) {
    const isObject = arg instanceof Object && arg !== null

    if (isObject) {
      return `\n\n  ${JSON.stringify(arg, null, 2).split('\n').join('\n  ')}\n`
    }

    return arg
  }

  _getNow() {
    return new Date()
  }

  _getNowString(date) {
    return date.toISOString()
      .replace(/T/, ' ')      // replace T with a space
      .replace(/\..+/, '')    // delete the dot and everything after
  }

  _calculateDiff(t1, t2) {
    return (t2.getTime() - t1.getTime()) / 1000
  }
}

const logger = function (scope) {
  return new Logger({
    scope,
    callback: logger._callback,
    levels: logger._levels || LEVELS
  })
}

logger.levels = function (levels) {
  if (Array.isArray(levels)) {
    throw new Error('Levels must be array of strings.')
  }

  logger._levels = levels
}

logger.listen = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error('Callback must be a function.')
  }

  logger._callback = callback
}

export default logger
