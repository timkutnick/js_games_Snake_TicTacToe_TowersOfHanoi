(function (root) {

  var TTT = root.TTT = (root.TTT || {});

  var Game = TTT.Game = function () {
    this.player = Game.marks[0];
    this.board = this.makeBoard();
  }

  Game.marks = ["x", "o"];

  Game.prototype.diagonalWinner = function () {
    var game = this;

    var diagonalPositions1 = [[0, 0], [1, 1], [2, 2]];
    var diagonalPositions2 = [[2, 0], [1, 1], [0, 2]];

    var winner = null;
    _(Game.marks).each(function (mark) {
      function didWinDiagonal (diagonalPositions) {
        return _.every(diagonalPositions, function (pos) {
          return game.board[pos[0]][pos[1]] === mark;
        });
      }

      var won = _.any(
        [diagonalPositions1, diagonalPositions2],
        didWinDiagonal
      );

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.horizontalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (i) {
        return _(indices).every(function (j) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.makeBoard = function () {
    return _.times(3, function (i) {
      return _.times(3, function (j) {
        return null;
      });
    });
  };

  Game.prototype.move = function (pos) {

    this.placeMark(eval(pos));
    this.switchPlayer();
    return true;
  };

  Game.prototype.placeMark = function (pos) {
    this.board[pos[0]][pos[1]] = this.player;
  };

  Game.prototype.switchPlayer = function () {
    if (this.player === Game.marks[0]) {
      this.player = Game.marks[1];
    } else {
      this.player = Game.marks[0];
    }
  };


  Game.prototype.verticalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (j) {
        return _(indices).every(function (i) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.winner = function () {
    return (
      this.diagonalWinner() || this.horizontalWinner() || this.verticalWinner()
    );
  };

  Game.prototype.draw = function() {
    var result = true
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if(!this.board[i][j]) {
          result = false
        }
      }
    }
    return result
  };
})(this);

(function (root) {

  var TTT = root.TTT = (root.TTT || {});

  var UI = TTT.UI = function (game) {
    this.game = game
  }

  UI.prototype.start = function() {
    game = this.game

    $(".row div").each( function(i, div) {
      $(div).addClass("empty");
    })

    $(".row").on('click', 'div.empty', function(e) {
      var player = game.player;
      var tile = $(this)
      drawTile(player, tile)

      var pos = $(this).data('pos');
      game.move(pos);
      console.log(game.board);

      checkGameOver(game)
    })
  }

  var drawTile = function(player, tile) {
    tile.addClass(player);
    tile.removeClass("empty");
    tile.append(player);
  }

  var checkGameOver = function(game) {
    var winner = game.winner();
    var draw = game.draw();

    if(winner) {
      alert(winner + " is the winner!");
      $("div.empty").each( function (i, div) {
        $(div).removeClass("empty");
      });
    } else if(draw) {
      alert("Nobody wins!");
    } else {
      player = game.player;
      $('#instructions').text("It's " + player + "'s turn.");
    };
  }


})(this);