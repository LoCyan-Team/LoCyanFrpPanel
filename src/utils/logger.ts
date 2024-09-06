const style = {
  info: {
    levelColor: 'color: #00cc00;'
  },
  warn: {
    levelColor: 'color: #ff9933;'
  },
  error: {
    levelColor: 'color: red;'
  },
  reset: 'color: none; background: none;'
}

const logger = {
  info: (m: any) => {
    console.log(`[%cINFO%c] ${m}`, style.info.levelColor, style.reset)
  },
  warn: (m: any, clevel = true) => {
    const fn = clevel ? console.warn : console.log
    fn(`[%cWARN%c] ${m}`, style.warn.levelColor, style.reset)
  },
  error: (m: any, clevel = true) => {
    const fn = clevel ? console.error : console.log
    fn(`[%cERROR%c] ${m}`, style.error.levelColor, style.reset)
  }
}

export default logger
