let letterElement = null
let startElement = null
let timerElement = null

let isInGame = false
let startTime = 0
let endTime = null

const letterList = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
//const letterList = [..."A"]
let letterIndex = 0

// この関数の r あたりの意味がいまだにわからない
const sleep = (duration) => new Promise(r => setTimeout(r, duration))

const gameStart = async () => {
    letterElement.textContent = 3
    await sleep(1000)
    letterElement.textContent = 2
    await sleep(1000)
    letterElement.textContent = 1
    await sleep(1000)
    letterElement.textContent = 'A'
    startTime = Date.now()
    isInGame = true
}

const gameClear = () => {
    endTime = Date.now()
    letterElement.textContent = '🎉'
    isInGame = false
}

const init = () => {
    letterElement = document.getElementById('letter')
    startElement = document.getElementById('start')
    timerElement = document.getElementById('timer')
    console.log(letterElement);
    console.log(startElement);

    startElement.onpointerdown = (e) => {
        e.preventDefault()
        gameStart()
    }

    const tick = () => {
        // ここの引数に呼び出し元の？？関数名を入れるのも結構なぞい
        requestAnimationFrame(tick)
        if (startTime === 0) {
            timerElement.textContent = '0.000s'
        } else {
            // この endTime のきもい書き方に気づいていなかった
            // これは短絡評価みたいなのを用いているのか？？
            const elapsedTime = ((endTime || Date.now()) - startTime) / 1000
            timerElement.textContent = `${elapsedTime.toFixed(3)}s`
        }
    }
    tick()

    document.onkeydown = (e) => {
        // key の文字の取り方は知らなんだが，e.key なんてので簡単に取れちゃうんだね
        e.preventDefault()
        const key = e.key.toUpperCase()
        console.log(key);
        console.log(letterIndex);
        console.log(key, letterList[letterIndex]);
        if (!isInGame) {
            console.log('aaa');
            return;
        }
        if (key === letterList[letterIndex]) {
            console.log('correct');
            letterIndex++
            letterElement.textContent = letterList[letterIndex]
        }
        if (letterIndex === letterList.length) {
            gameClear()
        }

    }
}

window.onload = () => {
    init()
}