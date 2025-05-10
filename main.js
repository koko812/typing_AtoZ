// TODO リトライの実装
// ミスタイプ時に，画面を赤く点滅させるのは面白そうとのこと（by t-kihira)
// リバースモードとかも面白そう，あとはランダムモードも

let letterElement = null
let startElement = null
let timerElement = null
let shareElement = null
let clipboardElement = null
let movieElement = null
let movietextElement = null
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
    letterElement.textContent = '️A'
    startTime = Date.now()
    isInGame = true
}

const gameClear = () => {
    endTime = Date.now()
    letterElement.textContent = '🎉'
    isInGame = false
}

const share = async () => {
    // この辺の，特に navigator 関連はマジで意味不明で，何に使うのかが本当にわからない
    const shareText = `あなたは A から Z までを ${((endTime - startTime) / 1000).toFixed(3)} 秒でタイプしました.  #typing A to Z ${window.location.href}`
    try {
        window.navigator.clipboard.writeText(shareText)
    } catch (e) {
        console.log(e);
    }
    // あなたは A から Z までを 0.208 秒でタイプしました.  #typing A to Z http://127.0.0.1:3000/index.html
    // 完璧ですね

    clipboardElement.style.opacity = 1
    clipboardElement.style.transform = 'translateY(0)'
    await sleep(150)
    await sleep(2000)
    clipboardElement.style.opacity = 0
    clipboardElement.style.transform = 'translateY(1rem)'
    await sleep(150)
    movietextElement.style.visibility = 'visible'
    movieElement.style.visibility = 'visible'
}

const init = () => {
    letterElement = document.getElementById('letter')
    startElement = document.getElementById('start')
    timerElement = document.getElementById('timer')
    shareElement = document.getElementById('share')
    clipboardElement = document.getElementById('clipboard')
    movietextElement = document.getElementById('movie-text')
    movietextElement.style.visibility = 'hidden'
    movieElement = document.getElementById('movie')
    movieElement.style.visibility = 'hidden'
    console.log(letterElement);
    console.log(startElement);

    startElement.onpointerdown = (e) => {
        e.preventDefault()
        gameStart()
    }

    shareElement.onpointerup = (e) => {
        e.preventDefault()
        share()
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
            shareElement.style.visibility = 'visible'
        }

    }
}

window.onload = () => {
    init()
}