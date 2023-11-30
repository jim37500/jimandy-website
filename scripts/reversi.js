// 初始化棋盤
function initializeBoard() {
  // 棋盤真實情況
  checkerBoard = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'w', 'b', '', '', ''],
    ['', '', '', 'b', 'w', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];
  

  // 橫列
  rows = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];
  

  // 直行
  columns = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];
  

  // 左上右下斜線
  diagonPs = [
    ['', '', ''],
    ['', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', ''],
    ['', '', '']
  ];
  

  // 左下右上斜線
  diagonNs = [
    ['', '', ''],
    ['', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', ''],
    ['', '', '']
  ];
}


// 把棋盤資訊更新在每一橫列、直行及斜線
function updateData() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (checkerBoard[i][j] !== '') {
        rows[i][j] = checkerBoard[i][j]
        columns[j][i] = checkerBoard[i][j]

        const diaPIdx = i - j + 5;
        if (diaPIdx >= 0 && diaPIdx <= 5) {
          diagonPs[diaPIdx][i] = checkerBoard[i][j]
        } else if (diaPIdx > 5 && diaPIdx <= 10) {
          diagonPs[diaPIdx][j] = checkerBoard[i][j]
        };

        const diaNIdx = i + j - 2
        if (diaNIdx >= 0 && diaNIdx <= 5) {
          diagonNs[diaNIdx][i] = checkerBoard[i][j]
        } else if (diaNIdx > 5 && diaNIdx <= 10) {
          diagonNs[diaNIdx][7-i] = checkerBoard[i][j]
        };
      };
    };
  };
}


// 把棋盤上的資訊更新在畫面上
function updateCheckerBoard() {
  updateData();
  document.querySelectorAll('.piece').forEach((element, idx) => {
    let i = parseInt( idx / 8);
    let j = idx % 8;
    if (checkerBoard[i][j] == 'w') {
      if (element.classList.contains('piece-black')) {
        element.classList.remove('piece-black');
      } 
      element.classList.add('piece-white');
    } else if (checkerBoard[i][j] == 'b') {
      if (element.classList.contains('piece-white')) {
        element.classList.remove('piece-white');
      } 
      element.classList.add('piece-black');
    } else {
      if (element.classList.contains('piece-white')) {
        element.classList.remove('piece-white');
      } else if (element.classList.contains('piece-black')) {
        element.classList.remove('piece-black');
      }
    }
  })
}


/**
 * updateTurnInfo() 傳入turn，改變棋盤下方輪到誰下的提示顯示 
 * @param {輪到黑/白方行棋} turn 
 */
function updateTurnInfo(turn) {
  const element = document.querySelector('.js-turn-message').classList
  if (element.contains('white-turn') && turn == 'b') {
    element.remove('white-turn')
  } else if (turn == 'w'){
    element.add('white-turn')
  }
}


/**
 * getLinesInfo() 傳入棋盤座標i, j，回傳在橫列/直行/斜線的第幾個行第幾個，方便做後續的邊界判定
 * 
 * @param {棋盤座標第幾橫列} i 
 * @param {棋盤座標第幾直行} j 
 * @returns {在橫列/直行/斜線的第幾個行第幾個}
 */
function getLinesInfo(i, j) {
  // row
  const rowLine = i;
  const rowLineIdx = j;
  
  // column
  const columnLine = j;
  const columnLineIdx = i;

    // diagonPs
    const diaPLine = i - j + 5;
    let diaPLineIdx;
    if (diaPLine >= 0 && diaPLine <= 5) {
    diaPLineIdx = i;
    } else if (diaPLine > 5 && diaPLine <= 10) {
      diaPLineIdx = j;
    };

    // diagonNs
  const diaNLine = i + j - 2;
  let diaNLineIdx;
  if (diaNLine >= 0 && diaNLine <= 5) {
    diaNLineIdx = i;
  } else if (diaNLine > 5 && diaNLine <= 10) {
    diaNLineIdx = 7 - i;
  };

  return [rowLine, rowLineIdx, columnLine, columnLineIdx,
    diaPLine, diaPLineIdx, diaNLine, diaNLineIdx];
}


/**
 * getBoundaryInfo() 傳入line, lineIdx, lines, turn，回傳左右pointer的行index及左右邊界的boolean值
 * 目的是方便確認在這line中能不能吃棋
 * 
 * @param {為四種矩陣其一中的第幾行} line 
 * @param {行中第幾個元素} lineIdx 
 * @param {為橫列/直行/上斜/下斜的矩陣} lines 
 * @param {輪到黑/白棋行棋} turn 
 * @returns {左右pointer的行index及左右邊界的boolean值}
 */
function getBoundaryInfo(line, lineIdx, lines, turn) {
  let l = lineIdx - 1;
  let r = lineIdx + 1;
  let leftBoundary = false;
  let rightBoundary = false;

  while (l >= 0) {
    if (lines[line][l] == '') {
      break
    } else if (lines[line][l] == turn) {
      if (lineIdx - l > 1) {
        leftBoundary = true;
      };
      break
    } else {
      l -= 1;
    }
  };

  while (r < lines[line].length) {
    if (lines[line][r] == '') {
      break
    } else if (lines[line][r] == turn) {
      if (r - lineIdx > 1) {
        rightBoundary = true;
      }
      break
    } else {
      r += 1;
    }
  };
  return [leftBoundary, l, rightBoundary, r];
}


/**
 * checkLines() 傳入line, lineIdx, lines, turn，回傳此line能不能吃棋(boolean值)
 * 目的是要確認在這line中能不能吃棋
 * 
 * @param {為四種矩陣其一中的第幾行} line 
 * @param {行中第幾個元素} lineIdx 
 * @param {為橫列/直行/上斜/下斜的矩陣} lines 
 * @param {輪到黑/白棋行棋} turn 
 * @returns {boolean}
 */
function checkLines(line, lineIdx, lines, turn) {
  const [leftBoundary, l, rightBoundary, r] = getBoundaryInfo(line, lineIdx, lines, turn);
  
  if ((leftBoundary && rightBoundary) ||( !leftBoundary && !rightBoundary) || r - l <= 2) {
    return false;
  } else {
    return true
  } ;
}


/**
 * generateLinesBools() 傳入棋盤座標i, j, turn，回傳橫列/直行/上斜/下斜能不能吃棋的四個boolean值
 * 目的是方便checkMoveValid()判斷此步是否有效
 * 
 * @param {棋盤座標第幾橫列} i 
 * @param {棋盤座標第幾直行} j 
 * @param {輪到黑/白棋行棋} turn 
 * @returns {橫列/直行/上斜/下斜能不能吃棋} boolean
 */
function generateLinesBools(i, j, turn) {
  const [rowLine, rowLineIdx, columnLine, columnLineIdx, 
    diaPLine, diaPLineIdx, diaNLine, diaNLineIdx] = getLinesInfo(i, j);

  // rows
  const rowBool = checkLines(rowLine, rowLineIdx, rows, turn);

  // columns
  const columnBool = checkLines(columnLine, columnLineIdx, columns, turn);

  // diagonPs
  let diaPBool = false;
  if (diaPLine >= 0 && diaPLine <= 10) {
    diaPBool = checkLines(diaPLine, diaPLineIdx, diagonPs, turn);
  };
  
  // diagonNs
  let diaNBool = false;
  if (diaNLine >= 0 && diaNLine <= 10) {
    diaNBool = checkLines(diaNLine, diaNLineIdx, diagonNs, turn);
  };

  return [rowBool, columnBool, diaPBool,diaNBool];
}


/**
 * checkMoveValid() 傳入棋盤座標i, j, turn，回傳此步是否有效(boolean值)
 * 
 * @param {棋盤座標第幾橫列} i 
 * @param {棋盤座標第幾直行} j 
 * @param {輪到黑/白棋行棋} turn 
 * @returns {此步是否有效} boolean
 */
function checkMoveValid(i, j, turn) {
  if (checkerBoard[i][j] == '') {
    const [rowBool, columnBool, diaPBool,diaNBool] = generateLinesBools(i, j, turn);
    if (rowBool || columnBool || diaPBool || diaNBool) {
      return true;
    } else {
      return false;
    };
  };
  return false;
}


/**
 * changeBoard() 傳入棋盤座標i, j, turn，來改變棋盤資訊
 * 呼叫updateCheckerBoard() 改變棋盤顯示
 * 
 * @param {棋盤座標第幾橫列} i 
 * @param {棋盤座標第幾直行} j 
 * @param {輪到黑/白棋行棋} turn 
 */
function changeBoard(i, j, turn) {
  const [rowLine, rowLineIdx, columnLine, columnLineIdx, 
    diaPLine, diaPLineIdx, diaNLine, diaNLineIdx] = getLinesInfo(i, j);

  const [rowBool, columnBool, diaPBool,diaNBool] = generateLinesBools(i, j, turn);

  // row
  if (rowBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(rowLine, rowLineIdx, rows, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= rowLineIdx; idx++){
        checkerBoard[i][idx] = turn;
      };
    } else if (rightBoundary) {
      for (let idx = rowLineIdx; idx <= r; idx++){
        checkerBoard[i][idx] = turn;
      };
    }
  };

  // column
  if (columnBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(columnLine, columnLineIdx, columns, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= columnLineIdx; idx++){
        checkerBoard[idx][j] = turn;
      };
    } else if (rightBoundary) {
      for (let idx = columnLineIdx; idx <= r; idx++){
        checkerBoard[idx][j] = turn;
      };
    }
  };

  // diagonPs
  if (diaPBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(diaPLine, diaPLineIdx, diagonPs, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= diaPLineIdx; idx++){
        if (diaPLine >= 0 && diaPLine <= 5) {
          checkerBoard[idx][idx - diaPLine + 5] = turn;
        } else if (diaPLine > 5 && diaPLine <= 10) {
          checkerBoard[idx + diaPLine - 5][idx] = turn;
        };
      };
    } else if (rightBoundary) {
      for (let idx = diaPLineIdx; idx <= r; idx++){
        if (diaPLine >= 0 && diaPLine <= 5) {
          checkerBoard[idx][idx - diaPLine + 5] = turn;
        } else if (diaPLine > 5 && diaPLine <= 10) {
          checkerBoard[idx + diaPLine - 5][idx] = turn;
        };
      };
    }
    
  }

  // diagonNs
  if (diaNBool) {
    let [leftBoundary, l, rightBoundary, r] = 
      getBoundaryInfo(diaNLine, diaNLineIdx, diagonNs, turn);
    if (leftBoundary) {
      for (let idx = l; idx <= diaNLineIdx; idx++){
        if (diaNLine >= 0 && diaNLine <= 5) {
          checkerBoard[idx][diaNLine - idx + 2] = turn;
        } else if (diaNLine > 5 && diaNLine <= 10) {
          checkerBoard[7 - idx][diaNLine + idx - 5] = turn;
        };
      };
    } else if (rightBoundary) {
      for (let idx = diaNLineIdx; idx <= r; idx++){
        if (diaNLine >= 0 && diaNLine <= 5) {
          checkerBoard[idx][diaNLine - idx + 2] = turn;
        } else if (diaNLine > 5 && diaNLine <= 10) {
          checkerBoard[7 - idx][diaNLine + idx - 5] = turn;
        };
      };
    }
  };
  updateCheckerBoard();
}


/**
 * checkEndGame() 傳入turn，來檢視目前棋盤是否還有沒有可以下的地方，若無則結束遊戲。
 * 
 * @param {輪到黑/白棋行棋} turn 
 */
function checkEndGame(turn) {
  let count = 0;
  let blackPiece = 0;
  let whitePiece = 0;
  for (let i = 0; i < 8; i ++) {
    for (let j = 0; j < 8; j ++) {
      if (checkerBoard[i][j] == 'b') {
        blackPiece += 1;
      } else if (checkerBoard[i][j] == 'w') {
        whitePiece += 1;
      }

      if (checkMoveValid(i, j, turn)) {
        count += 1
      }
    }
  };
  if (count == 0) {
    isEndGame = true;
    if (blackPiece > whitePiece) {
      endGameMessage = 'Black Win!';
      blackScore += 1;
    } else if (blackPiece < whitePiece) {
      endGameMessage = 'White Win!';
      whiteScore += 1;
    } else {
      endGameMessage = 'Draw';
    }

    document.querySelector('.js-score-text').innerHTML = `Black: ${blackPiece} , 
      White: ${whitePiece}`;
    document.querySelector('.js-result-text').innerHTML = endGameMessage;
    setTimeout(() => {
      document.querySelector('.js-grids').classList.add('is-end-game');
      document.querySelector('.js-black-score').innerHTML = blackScore;
      document.querySelector('.js-white-score').innerHTML = whiteScore;
    }, 1000)
  }
}




// Start here!!
let checkerBoard = [];
let rows = [];
let columns = [];
let diagonPs = []
let diagonNs = [];
let turn = 'b';
let isEndGame = false;
let blackScore = 0;
let whiteScore = 0;
let steps = 0
let endGameMessage = '';

initializeBoard();
updateCheckerBoard();

// 主要棋盤控制
document.querySelectorAll('.js-single-grid').forEach((element, idx) => {
  element.addEventListener('click', () => {
    let i = parseInt( idx / 8);
    let j = idx % 8
  //   console.log(`${idx}, ${i}, ${j}`)
    if (!isEndGame && checkMoveValid(i, j, turn)) {
      steps += 1;
      changeBoard(i, j, turn);
      if (turn === 'b') {
        turn = 'w';
      } else if (turn === 'w') {
        turn = 'b';
      };
      updateTurnInfo(turn);
      checkEndGame(turn);
    }
  })
});


// 新的一局按鈕
document.querySelector('.js-reset-button').addEventListener('click', () => {
  checkerBoard = [
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', 'w', 'b', '', '', ''],
    ['', '', '', 'b', 'w', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '']
  ];

  isEndGame = false;
  endGameMessage = '';
  steps = 0
  document.querySelector('.js-grids').classList.remove('is-end-game');
  initializeBoard();
  updateCheckerBoard();
});