const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
    const rows = 9, columns = 9;
    let board = [], score = 0;

    window.onload = function() {
      startGame();
      setInterval(() => {
        crushCandy();
        slideCandy();
        generateCandy();
      }, 100);
    };

    function randomCandy() {
      return candies[Math.floor(Math.random() * candies.length)];
    }

    function startGame() {
      for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
          let tile = document.createElement("img");
          tile.classList.add("tile");
          tile.id = `${r}-${c}`;
          tile.src = `./images/${randomCandy()}.png`;
          tile.draggable = true;
          tile.addEventListener("dragstart", dragStart);
          tile.addEventListener("dragover", dragOver);
          tile.addEventListener("drop", dragDrop);
          document.getElementById("board").append(tile);
          row.push(tile);
        }
        board.push(row);
      }
    }

    let currTile, otherTile;
    function dragStart() {
      currTile = this;
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function dragDrop() {
      otherTile = this;
      if (isAdjacent(currTile, otherTile)) {
        swapTiles(currTile, otherTile);
        if (!checkValid()) {
          swapTiles(currTile, otherTile);  // Undo move if not valid
        }
      }
    }

    function isAdjacent(tile1, tile2) {
      const [r1, c1] = tile1.id.split("-").map(Number);
      const [r2, c2] = tile2.id.split("-").map(Number);
      return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
    }

    function swapTiles(tile1, tile2) {
      const temp = tile1.src;
      tile1.src = tile2.src;
      tile2.src = temp;
    }

    function crushCandy() {
      crushThree("row");
      crushThree("column");
      document.getElementById("score").innerText = score;
    }

    function crushThree(direction) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
          let tiles = direction === "row"
            ? [board[r][c], board[r][c + 1], board[r][c + 2]]
            : [board[c][r], board[c + 1][r], board[c + 2][r]];
          if (tiles[0].src === tiles[1].src && tiles[1].src === tiles[2].src && !tiles[0].src.includes("blank")) {
            tiles.forEach(tile => tile.src = "./images/blank.png");
            score += 30;
          }
        }
      }
    }

    function checkValid() {
      return checkMatch("row") || checkMatch("column");
    }

    function checkMatch(direction) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
          let tiles = direction === "row"
            ? [board[r][c], board[r][c + 1], board[r][c + 2]]
            : [board[c][r], board[c + 1][r], board[c + 2][r]];
          if (tiles[0].src === tiles[1].src && tiles[1].src === tiles[2].src && !tiles[0].src.includes("blank")) {
            return true;
          }
        }
      }
      return false;
    }

    function slideCandy() {
      for (let c = 0; c < columns; c++) {
        let emptyIndex = rows - 1;
        for (let r = rows - 1; r >= 0; r--) {
          if (!board[r][c].src.includes("blank")) {
            board[emptyIndex][c].src = board[r][c].src;
            emptyIndex--;
          }
        }
        for (let r = emptyIndex; r >= 0; r--) {
          board[r][c].src = "./images/blank.png";
        }
      }
    }

    function generateCandy() {
      for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
          board[0][c].src = `./images/${randomCandy()}.png`;
        }
      }
    }