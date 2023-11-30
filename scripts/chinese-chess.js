/**
 * shuffle() 根據傳入array來進行遊戲開始前的洗牌
 * 
 * @param {* 所有棋子} array 
 */
function shuffle(array) {
  for (let i = array.length-1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}


// 將遊戲數值設為初始值
function createNewGame() {
  shuffle(pieces);
  endGame = false;
  isFirstMove = true;
  turn = '';
  result = '';
  blackPiece = 16;
  redPiece = 16;
  pieceMove = 0;
  removeStyleElement(previousStyleElement, 'prev-pointed');
  previousStyleElement.pop();


  // 清掉左右殘子圖片
  document.querySelector('#js-left-die-piece1').innerHTML = '';
  document.querySelector('#js-left-die-piece2').innerHTML = '';
  document.querySelector('#js-right-die-piece1').innerHTML = '';
  document.querySelector('#js-right-die-piece2').innerHTML = '';
  

  // 將棋盤上的圖片都變為未翻牌的圖片
  for (let i = 0; i < 4; i ++) {
    for (let j = 0; j < 8; j++) {
      checkerBoard[i][j] = pieces[8*i+j]
      document.getElementById(`js-piece-img${i}${j}`).src = images["unfold"];
    }
  }
}


/**
 * changeImage() 根據傳入的棋盤座標，來讓棋子翻牌、移動及吃棋更換棋盤上的圖片
 * 
 * @param {* 棋盤上第幾橫列} i 
 * @param {* 棋盤上第幾直行} j 
 */
function changeImage(i, j) {
  if (checkerBoard[i][j]) {
    document.getElementById(`js-piece-img${i}${j}`).src = images[checkerBoard[i][j]];
  } else {
    document.getElementById(`js-piece-img${i}${j}`).src = '';
  }
}


/**
 * foldPiece(i, j) 根據傳入的棋盤座標翻牌時改變儲存棋盤矩陣的資訊 
 * 呼叫 changeImage()來變動棋盤上的圖片
 * 
 * @param {* 棋盤上第幾橫列} i 
 * @param {* 棋盤上第幾直行} j 
 */
function foldPiece(i, j) {
  checkerBoard[i][j] = checkerBoard[i][j].replace('#', '');
  changeImage(i, j);
}


/**
 * determineFirstMove() 根據傳入的棋盤座標，來判定首步是誰先下
 * 
 * @param {* 棋盤上第幾橫列} i 
 * @param {* 棋盤上第幾直行} j 
 */ 
function determineFirstMove(i, j) {
  if (isFirstMove) {
    if (checkerBoard[i][j].includes('r')) {
      turn = 'r';
    } else {
      turn = 'b';
    }
    isFirstMove = false;
  }
}

// manageTurn() 為當上回做出有效的指令，更換行棋權
function manageTurn() {
  if (turn === 'r') {
    turn = 'b';
  } else {
    turn = 'r';
  }
}


/**
 * checkMoveValid() 根據傳入的棋盤座標及turn，來判定是否為有效指令，回傳true/ false
 * 
 * @param {* 棋盤上第幾橫列} i 
 * @param {* 棋盤上第幾直行} j 
 * @param {* 輪黑/紅方下} turn 
 * @returns true / false
 */
function checkMoveValid(i, j, turn) {
  manageMoveId(i, j, turn);
  // 翻牌
  if (checkerBoard[i][j].includes('#')) {
    foldPiece(i, j);
    changeImage(i, j);
    return true;
  }

  // 判斷移動或吃棋是否有效
  if (moveId.length === 2) {
    if (checkerBoard[i][j] === '' && checkMovePiece) {
      movePiece(moveId);
      return true;
    } else if (checkEatPiece(moveId)) {
      return true;
    }
  }
  return false;
}


/**
 * manageMoveId() 根據傳入的棋盤座標及turn，來管理moveId
 * @param {* 棋盤上第幾橫列} i 
 * @param {* 棋盤上第幾直行} j 
 * @param {* 輪黑/紅方下} turn 
 * @returns none
 */
function manageMoveId(i, j, turn) {
  if (moveId.length === 0 && checkerBoard[i][j].includes(turn) && !checkerBoard[i][j].includes('#')) {
    moveId.push([i, j]);
    return;
  } else if (moveId.length === 1 && !checkerBoard[i][j].includes('#')) {
    if (checkerBoard[i][j].includes(turn)) {
      moveId.pop();
      moveId.push([i, j]);
    } else {
      moveId.push([i, j]);
    }
    return;
  } 

  moveId = [];
}


/**
 * checkMovePiece() 根據棋盤傳入的兩個座標，來檢查移動棋子是否合理，回傳true/false
 * 
 * @param {* 第一個座標棋盤上第幾橫列} i1 
 * @param {* 第一個座標棋盤上第幾直行} j1 
 * @param {* 第二個座標棋盤上第幾橫列} i2 
 * @param {* 第二個座標棋盤上第幾直行} j2 
 * @returns true / false
 */
function checkMovePiece(i1, j1, i2, j2) {
  return (Math.abs(i1-i2) === 1 && Math.abs(j1-j2) === 0)
    || (Math.abs(i1-i2) === 0 && Math.abs(j1-j2) === 1)
}


/**
 * movePiece() 根據moveId，更新棋盤上的資訊
 * 並呼叫changeImage() 來變動棋盤上的圖片
 * 
 * @param {* 為只有兩個座標的矩陣，處理移動及吃棋事宜} moveId 
 */
function movePiece(moveId) {
  [i1, j1] = moveId[0];
  [i2, j2] = moveId[1];
  [checkerBoard[i1][j1], checkerBoard[i2][j2]] = [checkerBoard[i2][j2], checkerBoard[i1][j1]];
  changeImage(i1, j1);
  changeImage(i2, j2);
}


/**
 * generateStatus() 根據傳入的棋盤座標，來決定棋子的身份，回傳棋子身份status
 * @param {* 棋盤上第幾橫列} i 
 * @param {* 棋盤上第幾直行} j 
 * @returns {* 棋子身份} status
 */
function generateStatus(i, j) {
  let piece = checkerBoard[i][j];
  let status = 0;
  if (piece.includes('7')) {
    status = 7;
  } else if (piece.includes('6')) {
    status = 6;
  } else if (piece.includes('5')) {
    status = 5;
  } else if (piece.includes('4')) {
    status = 4;
  } else if (piece.includes('3')) {
    status = 3;
  } else if (piece.includes('2')) {
    status = 2;
  } else if (piece.includes('1')) {
    status = 1;
  }
  return status
}


/**
 * eatPiece() 根據傳入的兩個棋盤座標，來執行吃棋的動作
 * 
 * @param {* 第一個座標棋盤上第幾橫列} i1 
 * @param {* 第一個座標棋盤上第幾直行} j1 
 * @param {* 第二個座標棋盤上第幾橫列} i2 
 * @param {* 第二個座標棋盤上第幾直行} j2 
 */
function eatPiece(i1, j1, i2, j2) {
  manageDiePiece(i2, j2)
  checkerBoard[i2][j2] = checkerBoard[i1][j1];
  checkerBoard[i1][j1] = '';
  changeImage(i1, j1);
  changeImage(i2, j2);
}


/**
 * manageDiePiece() 根據傳入的棋盤座標，來處理顯示死子事宜
 * @param {* 棋盤上第幾橫列} i 
 * @param {* 棋盤上第幾直行} j 
 */
function manageDiePiece(i, j) {
  const imgElement = document.createElement('img')
  imgElement.classList.add('die-piece-img');
  imgElement.src = images[`${checkerBoard[i][j]}`];
  if (checkerBoard[i][j].includes('r')) {
    redPiece -= 1;
    if (redPiece >= 8) {
      document.querySelector('#js-left-die-piece1').append(imgElement);
    } else {
      document.querySelector('#js-left-die-piece2').append(imgElement);
    }
  } else if (checkerBoard[i][j].includes('b')) {
    blackPiece -= 1;
    if (blackPiece >= 8) {
      document.querySelector('#js-right-die-piece1').append(imgElement);
    } else {
      document.querySelector('#js-right-die-piece2').append(imgElement);
    }
  }
}


/**
 * cannonEat() 根據傳入棋盤兩個坐標，來判定炮/包吃棋是否有效，回傳boolean值
 * @param {* 第一個座標棋盤上第幾橫列} i1 
 * @param {* 第一個座標棋盤上第幾直行} j1 
 * @param {* 第二個座標棋盤上第幾橫列} i2 
 * @param {* 第二個座標棋盤上第幾直行} j2 
 * @returns boolean值
 */
function cannonEat(i1, j1, i2, j2) {
  if (i1 === i2) {
    let count = 0;
    for (let n = Math.min(j1, j2)+1; n < Math.max(j1, j2); n++) {
      if (checkerBoard[i1][n] !== '') {
        count += 1
      }
    }
    return count === 1
  } else if (j1 === j2) {
    let count = 0;
    for (let n = Math.min(i1, i2)+1; n < Math.max(i1, i2); n++) {
      if (checkerBoard[n][j1] !== '') {
        count += 1
      }
    }
    return count === 1
  } else {
    return false;
  }
}


/**
 * checkEatPiece() 根據傳入的moveId，來檢視吃棋是否有效，回傳boolean值
 * @param {* 為只有兩個座標的矩陣，處理移動及吃棋事宜} moveId 
 * @returns boolean值
 */
function checkEatPiece(moveId) {
  [i1, j1] = moveId[0];
  [i2, j2] = moveId[1];
  const status1 = generateStatus(i1, j1);
  const status2 = generateStatus(i2, j2);
  
  if (status1 === 2) {
    if (cannonEat(i1, j1, i2, j2)) {
      eatPiece(i1, j1, i2, j2);
      return true;
    }
  } else if (checkMovePiece(i1, j1, i2, j2)) {
    if (status1 === 7 && status2 === 1) {
      return false;
    } else if (status1 === 1 && status2 === 7) {
      eatPiece(i1, j1, i2, j2);
      return true;
    } else if (status1 >= status2) {
      eatPiece(i1, j1, i2, j2);
      return true;
    }
  }
  return false;
}


// 判斷遊戲是否結束
function checkEndGame() {
  if (blackPiece === 0) {
    result = 'Red Win!';
    endGame = true;
  } else if (redPiece === 0) {
    result = 'Black Win!';
    endGame = true;
  }
}


// 處理遊戲結束時的事宜
function manageEndgame() {
  // 取消上面顯示換誰移動提示
  clearInterval(blackInterval);
  clearInterval(redInterval);
  const blackElement = document.querySelector('.js-black-king-icon-container').classList;

  const redElement = document.querySelector('.js-red-king-icon-container').classList;

  removeClassList(blackElement, 'turn1');
  removeClassList(blackElement, 'turn2');
  removeClassList(redElement, 'turn1');
  removeClassList(redElement, 'turn2');

  // 顯示遊戲結束時的畫面
  document.querySelector('.js-result-message').innerHTML = result;
  if (result === 'Black Win!') {
    document.querySelector('.js-board').classList.add('gameover-black-win');
  } else if (result === 'Red Win!') {
    document.querySelector('.js-board').classList.add('gameover-red-win');
  } else if (result === 'Draw') {
    document.querySelector('.js-board').classList.add('gameover-draw');
  }
  
}


/**
 * addStyleElement() 傳入styleElement及className，將styleElement裡的每個element的classList都加入className
 * 
 * @param {* 為一矩陣，裡面皆是document.querySelector過的} styleElement 
 * @param {* 為css中的classname} className 
 */
function addStyleElement(styleElement, className) {
  styleElement.forEach((element) => {
    element.classList.add(className);
  })
}

/**
 * removeStyleElement() 傳入styleElement及className，將styleElement裡的每個element的classList都移除className
 * 
 * @param {* 為一矩陣，裡面皆是document.querySelector過的} styleElement 
 * @param {* 為css中的classname} className 
 */
function removeStyleElement(styleElement, className) {
  styleElement.forEach((element) => {
    if (element.classList.contains(className)) {
      element.classList.remove(className)
    } 
  })
}

/**
 * manageInterval() 傳入element，處理上方提醒移動動畫的間隔
 * 
 * @param {* 為document.querySelector().classList過的element} element 
 */
function manageInterval(element) {
  element.add('turn1');
  element.add('turn2');
  setTimeout(() => {
    if (element.contains('turn1') && element.contains('turn2')) {
      element.remove('turn2');
      setTimeout (() => {
        element.remove('turn1');
      }, 400)
    } 
  }, 800);
}

/**
 * removeClassList() 傳入elelment及classname，將element中的classList移除className
 * 
 * @param {* 為document.querySelector().classList過的element} element 
 * @param {* 為css中的classname} className 
 */
function removeClassList(element, className) {
  if (element.contains(className)) {
    element.remove(className);
  }
}


/**
 * turnAnimation() 傳入turn，為處理上方提醒下棋動畫
 * @param {* 輪黑/紅方下} turn 
 */
function turnAnimation(turn) {
  const blackElement = document.querySelector('.js-black-king-icon-container').classList;
  
  const redElement = document.querySelector('.js-red-king-icon-container').classList;

  removeClassList(blackElement, 'turn1');
  removeClassList(blackElement, 'turn2');
  removeClassList(redElement, 'turn1');
  removeClassList(redElement, 'turn2');
  
  if (turn === 'b') {
    clearInterval(redInterval);
    blackElement.add('turn1');
    blackElement.add('turn2');
    manageInterval(blackElement)
    blackInterval = setInterval(() => {
      manageInterval(blackElement)
    }, 2400);
  } else if (turn == 'r') {
    clearInterval(blackInterval);
    redElement.add('turn1');
    redElement.add('turn2');
    manageInterval(redElement)
    redInterval = setInterval(() => {
      manageInterval(redElement)
    }, 2400);
  }
}  


// 所有棋子
const pieces = [
  '#r7', '#r6', '#r6', '#r5', '#r5', '#r4', '#r4', '#r3',
  '#r3', '#r2', '#r2', '#r1', '#r1', '#r1', '#r1', '#r1',
  '#b7', '#b6', '#b6', '#b5', '#b5', '#b4', '#b4', '#b3',
  '#b3', '#b2', '#b2', '#b1', '#b1', '#b1', '#b1', '#b1'
]


const images = {
  'b1': "images/chinese-chess/b1.png",
  'b2': "images/chinese-chess/b2.png",
  'b3': "images/chinese-chess/b3.png",
  'b4': "images/chinese-chess/b4.png",
  'b5': "images/chinese-chess/b5.png",
  'b6': "images/chinese-chess/b6.png",
  'b7': "images/chinese-chess/b7.png",
  'r1': "images/chinese-chess/r1.png",
  'r2': "images/chinese-chess/r2.png",
  'r3': "images/chinese-chess/r3.png",
  'r4': "images/chinese-chess/r4.png",
  'r5': "images/chinese-chess/r5.png",
  'r6': "images/chinese-chess/r6.png",
  'r7': "images/chinese-chess/r7.png",
  'unfold': "images/chinese-chess/unfold.png"
}


// 控制棋盤矩陣
let checkerBoard = [
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', '']
]



// 初始化遊戲參數
let turn = '';
let isFirstMove = true;
let moveId = [];
let result = '';
let currentStyleElement = [];
let previousStyleElement = [];
let redPiece = 16;
let blackPiece = 16;
let endGame = false;
let blackInterval;
let redInterval;
let pieceMove = 0;


// 主要程式開始
createNewGame();


// 主要棋盤控制
document.querySelectorAll('.js-single-grid').forEach((element, index) => {
  if (!endGame) {
    element.addEventListener('click', () => {
      let i = Math.floor(index / 8);
      let j = index % 8;
      
      removeStyleElement(currentStyleElement, 'pointed');
      currentStyleElement.pop();
      determineFirstMove(i, j);
      if (checkMoveValid(i, j, turn)) {
        pieceMove += 1
        manageTurn();
        turnAnimation(turn);
        moveId = [];
        removeStyleElement(previousStyleElement, 'prev-pointed');
        previousStyleElement.pop();
        previousStyleElement.push(element);
        addStyleElement(previousStyleElement, 'prev-pointed');
        checkEndGame();
      } else {
        currentStyleElement.push(element);
        addStyleElement(currentStyleElement, 'pointed')
      }
      
      if (pieceMove >= 100) {
        endGame = true;
        result = 'Draw';
      }

      if (endGame) {
        manageEndgame();
      }
    })
  }
});


// 結束畫面的新的一局按鈕
document.querySelector('.js-new-game-button').addEventListener('click',() => {
  element = document.querySelector('.js-board').classList;
  removeClassList(element, 'gameover-black-win');
  removeClassList(element, 'gameover-red-win');
  removeClassList(element, 'gameover-draw');
  createNewGame();
});



// 投降按鈕事宜
document.querySelector('.js-black-surrender-container').addEventListener('click', () => {
  document.querySelector('.js-black-king-icon-container').classList.add('is-surrender');
});

document.querySelector('.js-black-surrender-yes').addEventListener('click', () => {
  document.querySelector('.js-black-king-icon-container').classList.remove('is-surrender');
  endGame = true;
  result = 'Red Win!';
  manageEndgame();
});

document.querySelector('.js-black-surrender-no').addEventListener('click', () => {
  document.querySelector('.js-black-king-icon-container').classList.remove('is-surrender');
});

document.querySelector('.js-red-surrender-container').addEventListener('click', () => {
  document.querySelector('.js-red-king-icon-container').classList.add('is-surrender');
});

document.querySelector('.js-red-surrender-yes').addEventListener('click', () => {
  document.querySelector('.js-red-king-icon-container').classList.remove('is-surrender');
  endGame = true;
  result = 'Black Win!';
  manageEndgame();
});

document.querySelector('.js-red-surrender-no').addEventListener('click', () => {
  document.querySelector('.js-red-king-icon-container').classList.remove('is-surrender');
});


