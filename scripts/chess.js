// 遊戲開始時設定時間
function settingTime() {
  document.querySelector('.js-board').classList.add('choosing-time');
  document.querySelector('.js-confirm-time-button').addEventListener('click', () => {
    clearInterval(blackInterval);
    clearInterval(whiteInterval);
    totalTime = Number(document.querySelector('.js-time-selector').value) * 60000;

    addtime = Number(document.querySelector('.js-addtime-selector').value) * 1000;
    document.querySelector('.js-board').classList.remove('choosing-time');
    whiteInterval = setInterval(() => {
      whiteTimer -= 100;
    }, 100);
    initializeGame();
  });
}
  
  
// 初始化遊戲
function initializeGame() {
  lastCheckerBoard = [
    ['b-R', 'b-N', 'b-B', 'b-Q', 'b-K', 'b-B', 'b-N', 'b-R'],
    ['b-P','b-P', 'b-P', 'b-P','b-P','b-P', 'b-P', 'b-P'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['w-P','w-P', 'w-P', 'w-P','w-P','w-P', 'w-P', 'w-P'],
    ['w-R', 'w-N', 'w-B', 'w-Q', 'w-K', 'w-B', 'w-N', 'w-R']
  ];

  checkerBoard = [
    ['b-R', 'b-N', 'b-B', 'b-Q', 'b-K', 'b-B', 'b-N', 'b-R'],
    ['b-P','b-P', 'b-P', 'b-P','b-P','b-P', 'b-P', 'b-P'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['w-P','w-P', 'w-P', 'w-P','w-P','w-P', 'w-P', 'w-P'],
    ['w-R', 'w-N', 'w-B', 'w-Q', 'w-K', 'w-B', 'w-N', 'w-R']
  ];

  // [blacks], [whites]
  pawnsFirstMove = [
    [true, true, true, true, true, true, true, true],
    [true, true, true, true, true, true, true, true]
  ];

  // black-rooks, white-rooks
  rooksFirstMove = [true, true, true, true];

  // black-king, white-king
  kingsFirstMove = [true, true];

  turn = 'w';
  bKingCheck = false;
  wKingCheck = false;
  moveId = [];
  endGame = false;
  result = '';
  description = '';
  transforming = false;
  removeStyleElement(previousStyleElement, 'previous-move');
  removeStyleElement(currentStyleElement, 'current-move');
  currentStyleElement = [];
  previousStyleElement = [];
  moveHistory = [];
  moveMessage = '';
  blackTimer = totalTime;
  whiteTimer = totalTime;
  stoping = false;

  // 呈現時間
  clearInterval(timerInterval);
  timerInterval =  setInterval(() => {
    manageTimeout();
    timerDisplay(blackTimer, 'black');
    timerDisplay(whiteTimer, 'white');
    if (endGame) {
      manageEndgame();
    }
  }, 500);
  


  document.querySelector('.black-die-piece-container').innerHTML = '';
  document.querySelector('.white-die-piece-container').innerHTML = '';
  document.querySelector('.js-notation-container').innerHTML = '';

  updateBoard()
}

// 更新棋盤圖片
function updateBoard() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (checkerBoard[i][j] !== '') {
        document.getElementById(`js-piece-img${i}${j}`).src = `
          images/chess/${checkerBoard[i][j]}.png
        `;
      } else {
        document.getElementById(`js-piece-img${i}${j}`).src = '';
      }
    }
  }
}


function timerDisplay(timer, color) {
  if (timer <= 0) {
    timer = 0;
  }
  minutes = Math.floor(timer / 60000);
  seconds = Math.floor((timer % 60000)  / 1000);
  if (seconds < 10) {
    seconds = '0' + seconds;
  }


  document.querySelector(`.js-${color}-timer`).innerHTML =`${minutes}:${seconds}`;
}




// 處理換手問題
function manageTurn() {
  if (turn === 'w') {
    clearInterval(whiteInterval);
    blackInterval = setInterval(() => {
      blackTimer -= 100;
    }, 100);
    turn = 'b';
  } else if (turn === 'b') {
    clearInterval(blackInterval);
    whiteInterval = setInterval(() => {
      whiteTimer -= 100;
    }, 100);
    turn = 'w';
  }
}


/**
 * manageMoveId() 傳入棋盤座標i, j, turn及element，來管理moveId及currentStyleElement
 * 
 * @param {棋盤座標第幾橫列} i 
 * @param {棋盤座標第幾直行} j 
 * @param {換哪方下} turn
 * @param {棋盤格元素} element  
 */
function manageMoveId(i, j, turn, element) {
  if (moveId.length === 0 && lastCheckerBoard[i][j].includes(`${turn}`)) {
    moveId.push([i, j]);
    currentStyleElement.push(element);
    addStyleElement(currentStyleElement, 'current-move');
    return;
  } else if (moveId.length === 1) {
    if (!lastCheckerBoard[i][j].includes(`${turn}`)) {
      moveId.push([i, j]);
      currentStyleElement.push(element);
      addStyleElement(currentStyleElement, 'current-move');
      return;
    } else {
      moveId.pop();
      removeStyleElement(currentStyleElement, 'current-move');
      currentStyleElement.pop();
      if (lastCheckerBoard[i][j].includes(`${turn}`)) {
        moveId.push([i, j]);
        currentStyleElement.push(element);
        addStyleElement(currentStyleElement, 'current-move');
        return;
      }
    }
  }
  moveId = [];
}


/**
 * managePawnFirstMove() 傳入棋盤座標，來管理小兵是否為第一次動。
 * 
 * @param {棋盤座標第幾橫列} i 
 * @param {棋盤座標第幾直行} j 
 */
function managePawnFirstMove(i, j) {
  if (checkerBoard[i][j] === 'b-P' && i === 1 && pawnsFirstMove[0][j]) {
    pawnsFirstMove[0][j] = false;
  } else if (checkerBoard[i][j] === 'w-P' && i === 6 && pawnsFirstMove[1][j]) {
    pawnsFirstMove[1][j] = false;
  }
}



/**
 * implementMovePiece() 傳入兩個棋盤座標，來處理移動棋子事宜。
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 */
function implementMovePiece(i1, j1, i2, j2) {
  [lastCheckerBoard[i1][j1], lastCheckerBoard[i2][j2]] = [lastCheckerBoard[i2][j2], lastCheckerBoard[i1][j1]];
}



/**
 * implementEatPiece() 傳入兩個棋盤座標，來處理吃棋事宜。
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 */
function implementEatPiece(i1, j1, i2, j2) {
  lastCheckerBoard[i2][j2] = lastCheckerBoard[i1][j1];
  lastCheckerBoard[i1][j1] = '';
}



/**
 * pawnTransform() 傳入棋盤座標i, j，檢查小兵是否到底，並顯示選項。
 * @param {棋盤座標第幾橫列} i 
 * @param {棋盤座標第幾直行} j 
 */
function pawnTransform(i1, j1, i2, j2) {
  const matchIdx = i2 * 8 + j2;
  document.querySelectorAll('.js-single-grid').forEach((element, index) => {
    if (index === matchIdx) {
      transforming = true;
      document.querySelector('.js-board').classList.add('transforming');
      element.classList.add('pawn-reach-end');
    }
  });
  
}

/**
 * manageTransformation() 傳入四種可能的棋子種類，來處理小兵到底變身事宜。
 * 
 * @param {棋子的種類，只有Q(皇后)、B(主教)、R(城堡)及N(騎士)} pieceName 
 */
function manageTransformation(pieceName) {
  document.querySelectorAll(`.js-transform-${pieceName}`).forEach((element,index) => {
    element.addEventListener('click', () => {
      transforming = false;
      manageTurn();
      let i = (turn === 'w')? 0:7;
      let j = index % 8;
      checkerBoard[i][j] = `${turn}-${pieceName}`;
      duplicateBoard(checkerBoard, lastCheckerBoard);
      updateBoard();
      manageTurn();
      moveMessage += `=${pieceName}`;
      manageKingCheck();
      if (bKingCheck || wKingCheck) {
        moveMessage += '+';
        determineCheckMate(turn);
      }
      manageMoveHistory();
      manageDeadPiece();
    
      matchIdx = i * 8 + j;
      document.querySelectorAll('.js-single-grid').forEach((element,index) => {
        if (index === matchIdx) {
          element.classList.remove('pawn-reach-end');
          document.querySelector('.js-board').classList.remove('transforming');
        }
      })
    });
  });
}


/**
 * pawnsMove() 傳入兩個棋盤座標，來判定是否符合小兵的規則，回傳booleans
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 * @returns booleans
 */
function pawnsMove(i1, j1, i2, j2) {
  let idx = (turn === 'b')?0:1;
  let pawnSprint = true;

  if (i1 > i2) {
    for (let k = i1 - 1; k >= i2; k--) {
      if (lastCheckerBoard[k][j1] !== '') {
        pawnSprint = false;
      }
    }
  } else {
    for (let k = i1 + 1; k <= i2; k++) {
      if (lastCheckerBoard[k][j1] !== '') {
        pawnSprint = false;
      }
    }
  }
  
  // 首次行棋可走兩格
  if (pawnsFirstMove[idx][j1] && pawnSprint) {
    if (turn === 'b') {
      if (j1 === j2 && i2 - i1 <= 2 && i2- i1 > 0) {
        implementMovePiece(i1, j1, i2, j2);
        return true;
      }
    } else if (turn === 'w') {
      if (j1 === j2 && i1 - i2 <= 2 && i1 - i2 > 0) {
        implementMovePiece(i1, j1, i2, j2);
        return true;
      }
    }
  }

  // 直走
  if (lastCheckerBoard[i2][j2] === '') {
    if (turn === 'b') {
      if (j1 === j2 && i2 - i1 === 1) {
        implementMovePiece(i1, j1, i2, j2);
        return true;
      }
    } else if (turn === 'w') {
      if (j1 === j2 && i1 - i2 === 1) {
        implementMovePiece(i1, j1, i2, j2);
        return true;
      }
    }
  }
  
  // 斜吃
  if (turn === 'b') {
    if (lastCheckerBoard[i2][j2].includes('w') && ((i2 - i1 === 1 && j2 - j1 === 1) || (i2 - i1 === 1 && j2 - j1 === -1))) {
      implementEatPiece(i1, j1, i2, j2);
      return true;
    }
  } else if (turn === 'w') {
    if (lastCheckerBoard[i2][j2].includes('b') && ((i2 - i1 === -1 && j2 - j1 === 1) || (i2 - i1 === -1 && j2 - j1 === -1))) {
      implementEatPiece(i1, j1, i2, j2);
      return true;
    }
  }

  // 過路兵
  if (previousMoveId.length === 2) {
    const [[i3, j3], [i4, j4]] = previousMoveId;
    if (turn == 'b' && lastCheckerBoard[i4][j4] === 'w-P') {
      if (i1 === 4 && ((i2 - i1 === 1 && j2 - j1 === 1) || (i2 - i1 === 1 && j2 - j1 === -1)) && i4 - i3 === -2 && Math.abs(j1 - j4) === 1) {
        lastCheckerBoard[i2][j2] = lastCheckerBoard[i1][j1];
        lastCheckerBoard[i1][j1] = '';
        lastCheckerBoard[i4][j4] = '';
        return true;
      }
    } else if (turn == 'w' && lastCheckerBoard[i4][j4] === 'b-P') {
      if (i1 === 3 && ((i2 - i1 === -1 && j2 - j1 === 1) || (i2 - i1 === -1 && j2 - j1 === -1)) && i4 - i3 === 2 && Math.abs(j1 - j4) === 1) {
        lastCheckerBoard[i2][j2] = lastCheckerBoard[i1][j1];
        lastCheckerBoard[i1][j1] = '';
        lastCheckerBoard[i4][j4] = '';
        return true;
      }
    }
  }

  return false;
}


/**
 * knightsMove() 傳入兩個棋盤座標，來判定是否符合騎士的規則，回傳booleans
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 * @returns booleans
 */
function knightsMove(i1, j1, i2, j2) {

  if ((Math.abs(i2-i1) === 1 && Math.abs(j2-j1) === 2) || (Math.abs(i2-i1) === 2 && Math.abs(j2-j1) === 1)) {
    if (lastCheckerBoard[i2][j2] === '') {
      implementMovePiece(i1, j1, i2, j2);
      return true;
    } else {
      implementEatPiece(i1, j1, i2, j2);
      return true;
    }
  }

  return false;
}


/**
 * bishopsMove() 傳入兩個棋盤座標，來判定是否符合主教的規則，回傳booleans
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 * @returns booleans
 */
function bishopsMove(i1, j1, i2, j2) {
  if (Math.abs(i2-i1) === Math.abs(j2-j1)) {
    if (i2 >= i1 && j2 >= j1) {
      for (let k = 1; k < i2 - i1; k++) {
        if (lastCheckerBoard[i1+k][j1+k] !== '') {
        return false;
        }
      }
    } else if (i2 >= i1 && j2 < j1) {
      for (let k = 1; k < i2 - i1; k++) {
        if (lastCheckerBoard[i1+k][j1-k] !== '') {
          return false;
        }
        }
    } else if (i2 < i1 && j2 >= j1) {
      for (let k = 1; k < i1 - i2; k++) {
        if (lastCheckerBoard[i1-k][j1+k] !== '') {
          return false;
        }
        }
    } else {
      for (let k = 1; k < i2 - i2; k++) {
        if (lastCheckerBoard[i1-k][j1-k] !== '') {
          return false;
        }
        }
    }
    
    if (lastCheckerBoard[i2][j2] === '') {
      implementMovePiece(i1, j1, i2, j2);
      return true;
    } else {
      implementEatPiece(i1, j1, i2, j2);
      return true;
    }
  }
  return false;
}


/**
 * rooksMove() 傳入兩個棋盤座標，來判定是否符合城堡的規則，回傳booleans
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 * @returns booleans
 */
function rooksMove(i1, j1, i2, j2) {
  if (i1 === i2) {
    let j3 = Math.min(j1, j2);
    let j4 = Math.max(j1, j2);
    for (let k = j3 + 1; k < j4; k++) {
      if (lastCheckerBoard[i1][k] !== '') {
        return false;
      }
    } 

    if (lastCheckerBoard[i2][j2] === '') {
      implementMovePiece(i1, j1, i2, j2);
      return true;
    } else {
      implementEatPiece(i1, j1, i2, j2);
      return true;
    }

  } else if (j1 === j2) {
    let i3 = Math.min(i1, i2);
    let i4 = Math.max(i1, i2);
    for (let k = i3 + 1; k < i4; k++) {
      if (lastCheckerBoard[k][j1] !== '') {
        return false;
      }
    }

    if (lastCheckerBoard[i2][j2] === '') {
      implementMovePiece(i1, j1, i2, j2);
      return true;
    } else {
      implementEatPiece(i1, j1, i2, j2);
      return true;
    } 
  }

  return false;
}


/**
 * queensMove() 傳入兩個棋盤座標，來判定是否符合皇后的規則，回傳booleans
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 * @returns booleans
 */
function queensMove(i1, j1, i2, j2) {
  return bishopsMove(i1, j1, i2, j2) || rooksMove(i1, j1, i2, j2);
}


/**
 * kingsMove() 傳入兩個棋盤座標，來判定是否符合國王的規則，回傳booleans
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 * @returns booleans
 */
function kingsMove(i1, j1, i2, j2) {
  if (i2 - i1 >= -1 && i2 - i1 <= 1 && j2 - j1 >= -1 && j2 - j1 <= 1) {
    if (lastCheckerBoard[i2][j2] === '') {
      implementMovePiece(i1, j1, i2, j2);
      return true;
    } else {
      implementEatPiece(i1, j1, i2, j2);
      return true;
    }
  }


  // 入堡
  if ((kingsFirstMove[0] && rooksFirstMove[0] && (i2 === 0 && j2 === 2))) {
    for (let k = j1; k >= j2; k--) {
      if (lastCheckerBoard[i1][k] === '' || lastCheckerBoard[i1][k] === 'b-K') {
        implementMovePiece(i1, j1, i2, k);
        if (!doubleCheckKingCheck()) {
          return false;
        }
        implementMovePiece(i2, k, i1, j1);
      } else {
        return false;
      }
    }

    implementMovePiece(i1, j1, i2, j2);
    implementMovePiece(0, 0, 0, 3);
    return true;
  } else if ((kingsFirstMove[0] && rooksFirstMove[1] && (i2 === 0 && j2 === 6))) {
    for (let k = j1; k <= j2; k++) {
      if (lastCheckerBoard[i1][k] === '' || lastCheckerBoard[i1][k] === 'b-K') {
        implementMovePiece(i1, j1 , i2, k);
        if (!doubleCheckKingCheck()) {
          return false;
        }
        implementMovePiece(i2, k , i1, j1);
      } else {
        return false;
      }
    }
    implementMovePiece(i1, j1, i2, j2);
    implementMovePiece(0, 5, 0, 7);
    return true;
  }



  if ((kingsFirstMove[1] && rooksFirstMove[2] && (i2 === 7 && j2 === 2))) {
    for (let k = j1; k >= j2; k--) {
      if (lastCheckerBoard[i1][k] === '' || lastCheckerBoard[i1][k] === 'w-K') {
        implementMovePiece(i1, j1, i2, k);
        if (!doubleCheckKingCheck()) {
          return false;
        }
        implementMovePiece(i2, k, i1, j1);
      } else {
        return false;
      }
    }
    implementMovePiece(i1, j1, i2, j2);
    implementMovePiece(7, 0, 7, 3);
    return true;
  } else if ((kingsFirstMove[1] && rooksFirstMove[3] && (i2 === 7 && j2 === 6))) {
    for (let k = j1; k <= j2; k++) {
      if (lastCheckerBoard[i1][k] === '' || lastCheckerBoard[i1][k] === 'w-K') {
        implementMovePiece(i1, j1 , i2, k);
        if (!doubleCheckKingCheck()) {
          return false;
        }
        implementMovePiece(i2, k, i1, j1);
      } else {
        return false;
      }
    }
    implementMovePiece(i1, j1, i2, j2);
    implementMovePiece(7, 5, 7, 7);
    return true;
  }

  return false;
}




// 檢查是否有被將軍
function manageKingCheck() {
  let i1;
  let j1;
  let i2;
  let j2;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (lastCheckerBoard[i][j] === 'b-K') {
        i1 = i;
        j1 = j;
      } 
      if (lastCheckerBoard[i][j] === 'w-K') {
        i2 = i;
        j2 = j;
      } 
    }
  }

  // knights threaten
  let nT = [[1, 2], [1, -2], [-1, 2],[-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];

  for (let k = 0; k < nT.length; k++) {
    let i3 = i1+nT[k][0];
    let j3 = j1+nT[k][1];
    if (i3 >= 0 && i3 < 8 && j3 >= 0 && j3 < 8 && lastCheckerBoard[i3][j3] === 'w-N') {
      bKingCheck = true;
      // console.log(`bKingCheck: ${bKingCheck}`);
      return;
    }

    let i4 = i2+nT[k][0];
    let j4 = j2+nT[k][1];
    if (i4 >= 0 && i4 < 8 && j4 >= 0 && j4 < 8 && lastCheckerBoard[i4][j4] === 'b-N') {
      wKingCheck = true;
      // console.log(`wKingCheck: ${wKingCheck}`);
      return;
    }
  }
  

  // white pawns threaten
  let wPT = [[1, 1], [1, -1]];
  for (let k = 0; k < wPT.length; k++) {
    let i3 = i1+wPT[k][0];
    let j3 = j1+wPT[k][1];
    if (i3 >= 0 && i3 < 8 && j3 >= 0 && j3 < 8 && lastCheckerBoard[i3][j3] === 'w-P') {
      bKingCheck = true;
      // console.log(`bKingCheck: ${bKingCheck}`);
      return;
    }
  }

  // black pawns threaten
  let bPT = [[-1, 1], [-1, -1]];
  for (let k = 0; k < wPT.length; k++) {
    let i4 = i2+bPT[k][0];
    let j4 = j2+bPT[k][1];
    if (i4 >= 0 && i4 < 8 && j4 >= 0 && j4 < 8 && lastCheckerBoard[i4][j4] === 'b-P') {
      wKingCheck = true;
      // console.log(`wKingCheck: ${wKingCheck}`);
      return;
    }
  }



  // king threaten
  let kT = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let k = 0; k < kT.length; k++) {
    let i3 = i1+kT[k][0];
    let j3 = j1+kT[k][1];
    if (i3 >= 0 && i3 < 8 && j3 >= 0 && j3 < 8 && lastCheckerBoard[i3][j3] === 'w-K') {
      bKingCheck = true;
      // console.log(`bKingCheck: ${bKingCheck}`);
      return;
    }

    let i4 = i2+kT[k][0];
    let j4 = j2+kT[k][1];
    if (i4 >= 0 && i4 < 8 && j4 >= 0 && j4 < 8 && lastCheckerBoard[i4][j4] === 'b-K') {
      wKingCheck = true;
      // console.log(`wKingCheck: ${wKingCheck}`);
      return;
    }
  }

  

  // column threat
  for (let k = i1-1; k >= 0; k--) {
    if (lastCheckerBoard[k][j1] === 'w-R' || lastCheckerBoard[k][j1] === 'w-Q') {
      bKingCheck = true;
      // console.log(`bKingCheck: ${bKingCheck}`);
      return;
    } else if (lastCheckerBoard[k][j1] !== '') {
      break;
    } 
  }

  for (let k = i1+1; k < 8; k++) {
    if (lastCheckerBoard[k][j1] === 'w-R' || lastCheckerBoard[k][j1] === 'w-Q') {
      bKingCheck = true;
      // console.log(`bKingCheck: ${bKingCheck}`);
      return;
    } else if (lastCheckerBoard[k][j1] !== '') {
      break;
    } 
  }

  for (let k = i2-1; k >= 0; k--) {
    if (lastCheckerBoard[k][j2] === 'b-R' || lastCheckerBoard[k][j2] === 'b-Q') {
      wKingCheck = true;
      // console.log(`wKingCheck: ${wKingCheck}`);
      return;
    } else if (lastCheckerBoard[k][j2] !== '') {
      break;
    } 
  }

  for (let k = i2+1; k < 0; k++) {
    if (lastCheckerBoard[k][j2] === 'b-R' || lastCheckerBoard[k][j2] === 'b-Q') {
      wKingCheck = true;
      // console.log(`wKingCheck: ${wKingCheck}`);
      return;
    } else if (lastCheckerBoard[k][j2] !== '') {
      break;
    } 
  }


  // row threaten
  for (let k = j1 - 1; k >= 0 ; k--) {
    if (lastCheckerBoard[i1][k] === 'w-R' || lastCheckerBoard[i1][k] === 'w-Q') {
      bKingCheck = true;
      // console.log(`bKingCheck: ${bKingCheck}`);
      return;
    } else if (lastCheckerBoard[i1][k] !== '') {
      break;
    }
  }

  for (let k = j1 + 1; k < 8 ; k++) {
    if (lastCheckerBoard[i1][k] === 'w-R' || lastCheckerBoard[i1][k] === 'w-Q') {
      bKingCheck = true;
      // console.log(`bKingCheck: ${bKingCheck}`);
      return;
    } else if (lastCheckerBoard[i1][k] !== '') {
      break;
    }
  }


  for (let k = j2 - 1; k >= 0 ; k--) {
    if (lastCheckerBoard[i2][k] === 'b-R' || lastCheckerBoard[i2][k] === 'b-Q') {
      wKingCheck = true;
      // console.log(`wKingCheck: ${wKingCheck}`);
      return;
    } else if (lastCheckerBoard[i2][k] !== '') {
      break;
    }

  }
  
  for (let k = j2 + 1; k < 8 ; k++) {
    if (lastCheckerBoard[i2][k] === 'b-R' || lastCheckerBoard[i2][k] === 'b-Q') {
      wKingCheck = true;
      // console.log(`wKingCheck: ${wKingCheck}`);
      return;
    } else if (lastCheckerBoard[i2][k] !== '') {
      break;
    }
  }
  


  // positive diagonal threaten
  for (let k = 1; k < 8; k++) {
    let i3 = i1 + k;
    let j3 = j1 + k;

    if (i3 < 8 && j3 < 8) {
      if (lastCheckerBoard[i3][j3] === 'w-B' || lastCheckerBoard[i3][j3] === 'w-Q') {
        bKingCheck = true;
        // console.log(`bKingCheck: ${bKingCheck}`);
        return;
      } else if (lastCheckerBoard[i3][j3] !== '') {
        break;
      }
    }
  }

  for (let k = -1; k > -8; k--) {
    let i3 = i1 + k;
    let j3 = j1 + k;
    if (i3 >= 0 && j3 >= 0) {
      if (lastCheckerBoard[i3][j3] === 'w-B' || lastCheckerBoard[i3][j3] === 'w-Q') {
        bKingCheck = true;
        // console.log(`bKingCheck: ${bKingCheck}`);
        return;
      } else if (lastCheckerBoard[i3][j3] !== '') {
        break;
      }
    }
  }

  for (let k = 1; k < 8; k++) {
    let i4 = i2 + k;
    let j4 = j2 + k;

    if (i4 < 8 && j4 < 8) {
      if (lastCheckerBoard[i4][j4] === 'b-B' || lastCheckerBoard[i4][j4] === 'b-Q') {
        wKingCheck = true;
        // console.log(`wKingCheck: ${wKingCheck}`);
        return;
      } else if (lastCheckerBoard[i4][j4] !== '') {
        break;
      }
    } 
  }

  for (let k = -1; k > -8; k--) {
    let i4 = i2 + k;
    let j4 = j2 + k;

    if (i4 >= 0 && j4 >= 0) {
      if (lastCheckerBoard[i4][j4] === 'b-B' || lastCheckerBoard[i4][j4] === 'b-Q') {
        wKingCheck = true;
        // console.log(`wKingCheck: ${wKingCheck}`);
        return;
      } else if (lastCheckerBoard[i4][j4] !== '') {
        break;
      }
    }
    
  }

  // negative diagonal threaten
  for (let k = 1; k < 8; k++) {
    let i3 = i1 + k;
    let j3 = j1 - k;

    if (i3 < 8 && j3 >= 0) {
      if (lastCheckerBoard[i3][j3] === 'w-B' || lastCheckerBoard[i3][j3] === 'w-Q') {
        bKingCheck = true;
        // console.log(`bKingCheck: ${bKingCheck}`);
        return;
      } else if (lastCheckerBoard[i3][j3] !== '') {
        break;
      }
    }
    
  }

  for (let k = -1; k > -8; k--) {
    let i3 = i1 + k;
    let j3 = j1 - k;

    if (i3 >= 0 && j3 < 8) {
      if (lastCheckerBoard[i3][j3] === 'w-B' || lastCheckerBoard[i3][j3] === 'w-Q') {
        bKingCheck = true;
        // console.log(`bKingCheck: ${bKingCheck}`);
        return;
      } else if (lastCheckerBoard[i3][j3] !== '') {
        break;
      }
    }
  }

  for (let k = 1; k < 8; k++) {
    let i4 = i2 + k;
    let j4 = j2 - k;

    if (i4 < 8 && j4 >= 0) {
      if (lastCheckerBoard[i4][j4] === 'b-B' || lastCheckerBoard[i4][j4] === 'b-Q') {
        wKingCheck = true;
        // console.log(`wKingCheck: ${wKingCheck}`);
        return;
      } else if (lastCheckerBoard[i4][j4] !== '') {
        break;
      }
    }
  }

  for (let k = -1; k > -8; k--) {
    let i4 = i2 + k;
    let j4 = j2 - k;

    if (i4 >= 0 && j4 < 8) {
      if (lastCheckerBoard[i4][j4] === 'b-B' || lastCheckerBoard[i4][j4] === 'b-Q') {
        wKingCheck = true;
        // console.log(`wKingCheck: ${wKingCheck}`);
        return;
      } else if (lastCheckerBoard[i4][j4] !== '') {
        break;
      }
    }
  }

  wKingCheck = false;
  bKingCheck = false;
}



// 檢查動過之後是否還被將軍
function doubleCheckKingCheck() {
  manageKingCheck();
  if ((turn === 'b' && bKingCheck) || (turn === 'w' && wKingCheck)) {
    duplicateBoard(checkerBoard, lastCheckerBoard);
    return false;
  } else {
    return true;
  }
}


/**
 * duplicateBoard() 傳入兩個棋盤，來處理複製棋盤事宜。
 * 
 * @param {要被複製的棋盤} board 
 * @param {複製的棋盤} copiedBoard 
 */
function duplicateBoard(board, copiedBoard) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      copiedBoard[i][j] = board[i][j]
    }
  }
}


// 檢查此步是否合理
function checkMoveValid() {
  if (moveId.length === 2) {
    const [[i1, j1], [i2, j2]] = moveId;
    const piece = lastCheckerBoard[i1][j1];
    if (piece.includes('P') && pawnsMove(i1, j1, i2, j2)) {
      if (doubleCheckKingCheck()) {
        if ((checkerBoard[i1][j1].includes('P') && i2 === 0 || i2 === 7)) {
          pawnTransform(i1, j1, i2, j2);
        }
        managePawnFirstMove(i1, j1);
        return true;
      } else {
        return false;
      }
    } else if (piece.includes('N') && knightsMove(i1, j1, i2, j2)) {
      return doubleCheckKingCheck();
    } else if (piece.includes('B') && bishopsMove(i1, j1, i2, j2)) {
      return doubleCheckKingCheck();
    } else if (piece.includes('R')) {
      if (rooksMove(i1, j1, i2, j2)) {
        if (i1 === 0 && j1 === 0) {
          rooksFirstMove[0] = false;
        } else if (i1 === 0 && j1 === 7) {
          rooksFirstMove[1] = false;
        } else if (i1 === 7 && j1 === 0) {
          rooksFirstMove[2] = false;
        } else if (i1 === 7 && j1 === 7) {
          rooksFirstMove[3] = false;
        }
        return doubleCheckKingCheck();
      }
    } else if (piece.includes('Q') && queensMove(i1, j1, i2, j2)) {
      return doubleCheckKingCheck();
    } else if (piece.includes('K')) {
      if (kingsMove(i1, j1, i2, j2)) {
        if (i1 === 0 && j2 === 4) {
          kingsFirstMove[0] = false;
        } else if (i1 === 7 && j2 === 4) {
          kingsFirstMove[1] = false;
        }
        return doubleCheckKingCheck();
      }
    }
  }
  return false;
}


/**
 * determineCheckMate() 傳入turn，來檢查是否checkmate。
 * 
 * @param {輪到哪方下} turn 
 * @returns none
 */
function determineCheckMate(turn) {
  for (let i1 = 0; i1 < 8; i1++) {
    for (let j1 = 0; j1 < 8; j1++) {
      for (let i2 = 0; i2 < 8; i2++) {
        for (let j2 = 0; j2 < 8; j2++) {
          if (!checkerBoard[i2][j2].includes(turn)) {
            if ((checkerBoard[i1][j1] === `${turn}-P` && pawnsMove(i1, j1, i2, j2) && doubleCheckKingCheck()) ||
            (checkerBoard[i1][j1] === `${turn}-N` && knightsMove(i1, j1, i2, j2) && doubleCheckKingCheck()) ||
            (checkerBoard[i1][j1] === `${turn}-B` && bishopsMove(i1, j1, i2, j2) && doubleCheckKingCheck()) ||
            (checkerBoard[i1][j1] === `${turn}-R` && rooksMove(i1, j1, i2, j2) && doubleCheckKingCheck()) ||
            (checkerBoard[i1][j1] === `${turn}-Q` && queensMove(i1, j1, i2, j2) && doubleCheckKingCheck()) ||
            (checkerBoard[i1][j1] === `${turn}-K` && kingsMove(i1, j1, i2, j2) && doubleCheckKingCheck())) {
              duplicateBoard(checkerBoard, lastCheckerBoard);
              return;
            }
          }
        } 
      }
    }
  }

  endGame = true;
  if (wKingCheck || bKingCheck) {
    if (moveMessage.includes('+')) {
      moveMessage = moveMessage.replace('+', '#')
    }
    if (turn === 'b') {
      result = 'White Win!';
      description = 'Black Checkmate'
    } else if (turn === 'w') {
      result = 'Black Win!';
      description = 'White Checkmate';
    }
  } else {
    result = 'Draw';
    if (turn === 'b') {
      description = 'Black has no available moves';
    } else if (turn === 'w') {
      description = 'White has no available moves';
    }
  }
}


/**
 * determineAbleToWin() 判定黑方或白方還有沒有能力贏，回傳booleans
 * 
 * @param {輪到哪方下} turn 
 * @returns booleans
 */
function determineAbleToWin(turn) {
  let count = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (checkerBoard[i][j] === `${turn}-P` || checkerBoard[i][j] === `${turn}-R` || checkerBoard[i][j] === `${turn}-Q`) {
        return true;
      } else if (checkerBoard[i][j] === `${turn}-K`) {
        continue;
      } else {
        count += 1;
      }
    }
  }

  if (count > 1) {
    return true;
  } else {
    return false;
  }
}



// 處理時間到
function manageTimeout() {
  if (blackTimer <= 0) {
    endGame = true;
    if (determineAbleToWin('w')) {
      result = 'White Win!';
      description = "Black's time is up";
    } else {
      result = 'Draw';
      description = "Black's time is up, but white's pieces are not enough to win";
    }
  }

  if (whiteTimer <= 0) {
    endGame = true;
    if (determineAbleToWin('b')) {
      result = 'Black Win!';
      description = "White's time is up";
    } else {
      result = 'Draw';
      description = "White's time is up, but Black's pieces are not enough to win";
    }
  }
}



// 處理結束遊戲事宜
function manageEndgame() {
  // 計時器停止倒數
  clearInterval(blackInterval);
  clearInterval(whiteInterval);
  clearInterval(timerInterval);

  // 顯示結束畫面
  document.querySelector('.js-result-message').innerHTML = result;
  document.querySelector('.js-description-message').innerHTML = description;
  document.querySelector('.js-board').classList.add('game-over');
}


/**
 * addStyleElement() 傳入傳入elementList、className，增加棋盤格裡面的className，來管理提示現在走什麼。
 * 
 * @param {需增加className的棋盤格列表} elementList 
 * @param {css class名稱} className 
 */
function addStyleElement(elementList, className) {
  elementList.forEach((element) => {
    element.classList.add(className);
  })
}



/**
 * removeStyleElement() 傳入elementList、className，移除棋盤格裡面的className，來管理提示上一步走哪裡。
 * 
 * @param {需移除className的棋盤格列表} elementList 
 * @param {css class名稱} className 
 */
function removeStyleElement(elementList, className) {
  elementList.forEach((element) => {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  });
}



/**
 * manageSurrender() 傳入 color，來處理投降事宜。
 * 
 * @param {黑棋或白棋} color 
 */
function manageSurrender(color) {
  // 點選中間的白旗
  document.querySelector(`.js-${color}-white-flag-container`).addEventListener('click', () => {
    const classElement = document.querySelector(`.js-${color}-surrender-container`).classList;
    if (classElement.contains(`${color}-asking-surrender`)) {
      classElement.remove(`${color}-asking-surrender`);
    } else {
      classElement.add(`${color}-asking-surrender`);
    }
  });
  

  // 點選是的選項
  document.querySelector(`.js-${color}-surrender-yes`).addEventListener('click', () => {
    if (color === 'black') {
      result = 'White Win!';
      description = 'Black admits defeat';
    } else {
      result = 'Black Win!';
      description = 'White admits defeat';
    }
    
    manageEndgame();
    document.querySelector(`.js-${color}-surrender-container`).classList.remove(`${color}-asking-surrender`);
  });
  

  // 點選否的選項
  document.querySelector(`.js-${color}-surrender-no`).addEventListener('click', () => {
    document.querySelector(`.js-${color}-surrender-container`).classList.remove(`${color}-asking-surrender`);
  });
}



// 處理顯示死子及分數差
function manageDeadPiece() {
  // 棋子數目[小兵, 騎士, 主教, 城堡, 皇后]
  let blackPiece = [0, 0, 0, 0, 0];
  let whitePiece = [0, 0, 0, 0, 0];
  let blackPieceScore = 0;
  let whitePieceScore = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let piece = checkerBoard[i][j];
      if (piece.includes('b')) {
        if (piece.includes('P')) {
          blackPiece[0] += 1;
          blackPieceScore += 1;
        } else if (piece.includes('N')) {
          blackPiece[1] += 1;
          blackPieceScore += 3;
        } else if (piece.includes('B')) {
          blackPiece[2] += 1;
          blackPieceScore += 3;
        } else if (piece.includes('R')) {
          blackPiece[3] += 1;
          blackPieceScore += 5;
        } else if (piece.includes('Q')) {
          blackPiece[4] += 1;
          blackPieceScore += 9;
        }
      } else if (piece.includes('w')) {
        if (piece.includes('P')) {
          whitePiece[0] += 1;
          whitePieceScore += 1;
        } else if (piece.includes('N')) {
          whitePiece[1] += 1;
          whitePieceScore += 3;
        } else if (piece.includes('B')) {
          whitePiece[2] += 1;
          whitePieceScore += 3;
        } else if (piece.includes('R')) {
          whitePiece[3] += 1;
          whitePieceScore += 5;
        } else if (piece.includes('Q')) {
          whitePiece[4] += 1;
          whitePieceScore += 9;
        }
      }
    }
  }

  let initialPiece = [['P', 8], ['N', 2], ['B', 2], ['R', 2], ['Q', 1]];
  let blackDeadPieceHTML = '';
  let whiteDeadPieceHTML = '';
  

  for (let k = 0; k < 5; k++) {
    let blackDeadPiece = initialPiece[k][1] - blackPiece[k];
    let whiteDeadPiece = initialPiece[k][1] - whitePiece[k];
    if (blackDeadPiece > 0) {
      for (let n = 0; n < blackDeadPiece; n++) {
        whiteDeadPieceHTML += `
        <img class="dead-piece" src="images/chess/b-${initialPiece[k][0]}.png">
        `;
      }
    }

    if (whiteDeadPiece > 0) {
      for (let n = 0; n < whiteDeadPiece; n++) {
        blackDeadPieceHTML += `
        <img class="dead-piece" src="images/chess/w-${initialPiece[k][0]}.png">
        `;
      }
    }
  }

  if (blackPieceScore > whitePieceScore) {
    blackDeadPieceHTML += `
    <div class="balance js-balance">+${blackPieceScore - whitePieceScore}</div>
    `;
  } else if (blackPieceScore < whitePieceScore) {
    whiteDeadPieceHTML += `
    <div class="balance js-balance">+${whitePieceScore - blackPieceScore}</div>
    `;
  }


  document.querySelector('.black-die-piece-container').innerHTML = blackDeadPieceHTML;
  document.querySelector('.white-die-piece-container').innerHTML = whiteDeadPieceHTML;
}





// 產生棋譜上的棋步
function generateMoveMessage() {
  const [[i1, j1], [i2, j2]] = moveId;
  const conversionTable = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h'
  }
  const r1 = 8 - i1;
  const c1 = conversionTable[j1];
  const r2 = 8 - i2;
  const c2 = conversionTable[j2];
  moveMessage = '';
  if (checkerBoard[i1][j1].includes('K')) {
    if (j2 - j1 === 2) {
      moveMessage = 'O-O';
      return;
    } else if (j1 - j2 === 2) {
      moveMessage ='O-O-O';
      return;
    } else {
      moveMessage += 'K'
    }
  } else if (checkerBoard[i1][j1].includes('P')) {
    if (j1 !== j2) {
      moveMessage += c1;
    }
  } else if (checkerBoard[i1][j1].includes('N')) {
    moveMessage += 'N';
  } else if (checkerBoard[i1][j1].includes('B')) {
    moveMessage += 'B';
  } else if (checkerBoard[i1][j1].includes('R')) {
    moveMessage += 'R';
  } else if (checkerBoard[i1][j1].includes('Q')) {
    moveMessage += 'Q';
  }


  if (checkerBoard[i2][j2] !== '' || (checkerBoard[i1][j1].includes('P') && j1 !== j2)) {
    moveMessage += 'x' + c2 + r2;
  } else {
    moveMessage += c2 + r2;
  }

  checkMessageUnique('Q', i1, j1, r1, c1, i2, j2);
  checkMessageUnique('R', i1, j1, r1, c1, i2, j2);
  checkMessageUnique('B', i1, j1, r1, c1, i2, j2);
  checkMessageUnique('N', i1, j1, r1, c1, i2, j2);
}



/**
 * checkMessageUnique() 傳入pieceName, 兩個棋盤座標及一個顯示座標，來判定棋步是否獨特
 * 
 * @param {棋子的種類} pieceName 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第一個棋盤座標的橫向顯示座標} r1 
 * @param {第一個棋盤座標的直向顯示座標} c1 
 * @param {第二個棋盤座標的第幾橫列} i2 
 * @param {第二個棋盤座標的第幾直行} j2 
 */
function checkMessageUnique(pieceName, i1, j1, r1, c1, i2, j2) {
  if (moveMessage[0] === pieceName) {
    for (let i3 = 0; i3 < 8; i3++) {
      for (let j3 = 0; j3 < 8; j3++) {
        if ((i1 !== i3 || j1 !== j3) && checkerBoard[i3][j3] === `${turn}-${pieceName}`) {
          duplicateBoard(lastCheckerBoard, checkerBoard);
          if ((pieceName === 'Q' && queensMove(i3, j3, i2, j2)) || (pieceName === 'R' && rooksMove(i3, j3, i2, j2)) || (pieceName === 'B' && bishopsMove(i3, j3, i2, j2)) || (pieceName === 'N' && knightsMove(i3, j3, i2, j2))) {
            duplicateBoard(checkerBoard, lastCheckerBoard);
            modifyMoveMessage(i1, j1, r1, c1, i3, j3);
          }
        }
      }
    }
  }
}




/**
 * 
 * @param {第一個棋盤座標的第幾橫列} i1 
 * @param {第一個棋盤座標的第幾直行} j1 
 * @param {第一個棋盤座標的橫向顯示座標} r1 
 * @param {第一個棋盤座標的直向顯示座標} c1 
 * @param {可能棋子的棋盤座標的第幾橫列} i3 
 * @param {可能棋子的棋盤座標的第幾直行} j3 
 */
function modifyMoveMessage(i1, j1, r1, c1, i3, j3) {
  let addedMessage = moveMessage[0];
  if (i1 === i3) {
    addedMessage += c1
  } else if (j1 === j3) {
    addedMessage += r1
  } 
  moveMessage = moveMessage.replace(moveMessage[0], addedMessage);
}




// 處理顯示棋譜
function manageMoveHistory() {
  if (turn === 'b' && !transforming) {
    moveHistory.push([moveMessage,'']);
  } else if (turn === 'w' && !transforming) {
    moveHistory[moveHistory.length-1][1] = moveMessage;
  }

  let notationHTML = '';
  for (let i = 0; i < moveHistory.length; i++) {
    notationHTML += `
    <div class="move-message">${i+1}.</div>
    <div class="move-message">${moveHistory[i][0]}</div>
    <div class="move-message">${moveHistory[i][1]}</div>
    `
  }

  document.querySelector('.js-notation-container').innerHTML = notationHTML;
  
}


function determineDraw() {
  if (!determineAbleToWin('w') && !determineAbleToWin('b')) {
    endGame = true;
    result = 'Draw';
    description = 'Neither side has enough pieces to win';
  }

  if (moveHistory.length > 5) {

    if (turn === 'w') {
      if ((moveHistory[moveHistory.length-1][0] === moveHistory[moveHistory.length-3][0] && moveHistory[moveHistory.length-3][0] === moveHistory[moveHistory.length-5][0]) && (moveHistory[moveHistory.length-1][1] === moveHistory[moveHistory.length-3][1] && moveHistory[moveHistory.length-3][1] === moveHistory[moveHistory.length-5][1])) {
        endGame = true;
        result = 'Draw';
        description = 'Repeat situation';
      }
    } else if (turn === 'b') {
      if ((moveHistory[moveHistory.length-2][1] === moveHistory[moveHistory.length-4][1] && moveHistory[moveHistory.length-4][1] === moveHistory[moveHistory.length-6][1]) && (moveHistory[moveHistory.length-1][0] === moveHistory[moveHistory.length-3][0] && moveHistory[moveHistory.length-3][0] === moveHistory[moveHistory.length-5][0])) {
        endGame = true;
        result = 'Draw';
        description = 'Repeat situation';
      }
    }
  }
}


let lastCheckerBoard = [];
let checkerBoard = [];
let pawnsFirstMove = [];
let rooksFirstMove = [];
let kingsFirstMove = [];
let turn = 'w';
let bKingCheck = false;
let wKingCheck = false;
let moveId = [];
let previousMoveId = [];
let currentStyleElement = [];
let previousStyleElement = [];
let endGame = false;
let result = '';
let description = '';
let moveHistory = [];
let moveMessage = '';
let transforming = false;
let blackInterval;
let whiteInterval;
let totalTime = 0;
let blackTimer = 0;
let whiteTimer = 0;
let addtime = 0;
let timerInterval;
let stoping = false;

settingTime();

document.querySelectorAll('.js-single-grid').forEach((element, index) => {
  if (!endGame && !transforming) {
    element.addEventListener('click', () => {
      let i = Math.floor(index / 8);
      let j = index % 8;

      manageMoveId(i, j, turn, element);
      // console.log(moveId);

      if (checkMoveValid()) {
        if (turn === 'w') {
          whiteTimer += addtime;
        } else if (turn === 'b') {
          blackTimer += addtime;
        }
        generateMoveMessage();
        manageTurn();
        duplicateBoard(lastCheckerBoard, checkerBoard);
        updateBoard();
        removeStyleElement(previousStyleElement, 'previous-move');
        removeStyleElement(currentStyleElement, 'current-move');
        previousStyleElement = currentStyleElement;
        addStyleElement(previousStyleElement, 'previous-move');
        currentStyleElement = [];
        manageKingCheck();
        if (wKingCheck || bKingCheck) {
          moveMessage += '+';
        }
        determineCheckMate(turn);
        manageMoveHistory();
        determineDraw();
        manageDeadPiece();
        previousMoveId = moveId;
        moveId = [];
      } else {
        if (moveId.length === 2) {
          moveId = [];
          removeStyleElement(currentStyleElement, 'current-move');
          currentStyleElement = [];
        }
      }

      if (endGame) {
        manageEndgame();
      }
    });
  }
});


manageTransformation('Q');
manageTransformation('R');
manageTransformation('N');
manageTransformation('B');


// 投降
manageSurrender('black');
manageSurrender('white');


// 開新一局按鈕
document.querySelector('.js-new-game-button').addEventListener('click', () => {
  document.querySelector('.js-board').classList.remove('game-over');
  settingTime();
});



// 時間暫停
document.querySelector('.js-clock-container').addEventListener('click', () => {
  clearInterval(blackInterval);
  clearInterval(whiteInterval);
  if (!stoping) {
    stoping = true;
  } else {
    stoping = false;
    if (turn === 'w') {
      whiteInterval = setInterval(() => {
        whiteTimer -= 100;
      }, 100);
    } else if (turn === 'b') {
      blackInterval = setInterval(() => {
        blackTimer -= 100;
      }, 100);
    }
  }
});

// 展開＆關閉棋譜
document.querySelector('.js-reveal-notation').addEventListener('click', () => {
  const classElement = document.querySelector('.js-board').classList;
  const element = document.querySelector('.js-reveal-text');
  if (classElement.contains('revealing')) {
    classElement.remove('revealing');
    element.innerHTML = 'Open';
  } else {
    classElement.add('revealing');
    element.innerHTML = 'Close';
  }
});