const colorTitle: string =
  'background: linear-gradient(to right, #e66465, #9198e5); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'
const colorBadgeA: string = 'background-color: #F14E32; color: #fff;'
const colorBadgeB: string = 'background-color: #000; color: #fff;'
const colorBadgeC: string = 'background-color: #862d59; color: #fff;'
const colorBadgeData: string = 'background-color: #606060; color: #fff;'
const colorReset: string = 'background-color: none; color: none;'
const colorCFU: string = 'wdith: 100%; background-color: #66ccff; color: #fff;'

export default (): void => {
  console.log(
    `%c
        _           ____                  _____           
       | |    ___  / ___|   _  __ _ _ __ |  ___| __ _ __  
       | |   / _ \\| |  | | | |/ _\` | '_ \\| |_ | '__| '_ \\ 
       | |__| (_) | |__| |_| | (_| | | | |  _|| |  | |_) |
       |_____\\___/ \\____\\__, |\\__,_|_| |_|_|  |_|  | .__/ 
                        |___/                      |_|     
       `,
    colorTitle
  )
  console.log(
    `%c Git %c ${GIT_COMMITHASH} %c | %c Upstream %c LoCyan-Team/LoCyanFrpPanel %c | %c GPL-3.0 `,
    colorBadgeA,
    colorBadgeData,
    colorReset,
    colorBadgeB,
    colorBadgeData,
    colorReset,
    colorBadgeC
  )
  console.log(
    `%c CFU CODE %c JRXHB5D4 %c https://内网穿透.中国`,
    colorCFU,
    colorBadgeData,
    colorReset
  )
  console.log('别看了没好东西 (x')
}
