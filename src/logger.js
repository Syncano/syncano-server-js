/**
 * Debug your code.
 * @property {Function}
 */

const TYPES = {
  emergency: 'Emergency',
  alert: 'Alert',
  critical: 'Critical',
  error: 'Error',
  warning: 'Warning',
  notice: 'Notice',
  info: 'Info',
  debug: 'Debug'
}

class Logger {
  constructor() {
    this._start = null

    Object.keys(TYPES).forEach(level => {
      this[level] = (...args) => {
        this._level = TYPES[level]
        const date = this._print(...args)

        if (this._callback) {
          this._callback({args, date, level})
        }

        this._level = null

        return this
      }
    })
  }

  log(...args) {
    if (!this._start) {
      this._start = this._getNow()
    }

    if (args.length > 0) {
      this._print(...args)
    }

    return this
  }

  listen(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function')
    }

    this._callback = callback
  }

  _print(...args) {
    if (global.ARGS && global.ARGS.DEBUG) {
      const now = this._getNow()
      const diff = this._calculateDiff(this._start, now)
      let level = null

      args = args.map(arg => {
        return arg instanceof Object && arg !== null ? JSON.stringify(arg) : arg
      })

      if (this._level !== null) {
        level = `${this._level}:`
      }

      if (level) {
        console.log(level, this._getNowString(now), args.join(' '), `+${diff}`)
      } else {
        console.log(this._getNowString(now), args.join(' '), `+${diff}`)
      }

      return now
    }
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

const logger = new Logger()

export default logger.log.bind(logger)
