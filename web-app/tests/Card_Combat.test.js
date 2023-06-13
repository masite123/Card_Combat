import Card_Combat from "../common/Card_Combat.js";
import R from "../common/ramda.js";

const proper_deck = [
    [0, 0], [0, 5],
    [1, 1], [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 1], [2, 2], [2, 3], [2, 4], [2, 5],
    [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]
];
const covered_card = [0, 0];

describe("Initial States", function () {
    it("An empty board has all free cells", function () {
        const empty_board = Card_Combat.empty_board();
        const all_free_cells = R.pipe(
            R.flatten,
            R.all(R.equals(null))
        )(empty_board);
        if (!all_free_cells) {
            let filled_cells = [];
            empty_board.forEach(function (player) {
                player.forEach(function (cell) {
                    if (cell !== null) {
                        filled_cells.push(cell);
                    }
                });
            });
            throw new Error(
                "The empty board has filled cells: " +
                filled_cells
            );
        }
    });
    it("Empty hands has all free cells", function () {
        const empty_hands = Card_Combat.empty_hands();
        const all_free_cells = R.pipe(
            R.flatten,
            R.all(R.equals(null))
        )(empty_hands);
        if (!all_free_cells) {
            let filled_cells = [];
            empty_hands.forEach(function (player) {
                player.forEach(function (cell) {
                    if (cell !== null) {
                        filled_cells.push(cell);
                    }
                });
            });
            throw new Error(
                "The empty hands has filled cells: " +
                filled_cells
            );
        }
    });
    it("New players has no winning player", function () {
        const new_players = Card_Combat.players();
        if (
            Card_Combat.is_winning_for_player(new_players)
        ) {
            throw new Error(
                "The empty board has a winning player: " +
                new_players
            );
        }
    });
    it("New players is not ended.", function () {
        const new_players = Card_Combat.players();
        if (Card_Combat.is_ended(new_players)) {
            throw new Error(
                "An empty board should not be ended: " +
                new_players
            );
        }
    });
    it("A new deck should be filled with all cards", function () {
        const new_deck = Card_Combat.new_deck();
        let invalid_cards = [];
        let filled_cards = true;
        new_deck.forEach(function (cell) {
            filled_cards *= R.includes(cell, proper_deck);
            if (!R.includes(cell, proper_deck)) {
                invalid_cards.push(cell);
            }
        });
        if (filled_cards !== 1) {
            throw new Error(
                "The new deck has invalid cards: " +
                invalid_cards
            );
        }
    });
});

describe("Between turns", function () {
    it(
        `Given a set of player stats that is not end and the last player,
When finding the next player,
Then the result is:
the next player to start or ply is the next clockwise alive one.`,
        function () {
            const the_last_player = 3;
            const not_end_players = [
                Card_Combat.players(),
                [0, 4, 2, 4],
                [0, 0, 3, 5]
            ];
            const the_next_players = [0, 1, 2];
            let testing_next_ply = [];
            let testing_next_start = [];
            not_end_players.forEach(function (players) {
                testing_next_start.push(
                    Card_Combat.player_to_start(players, the_last_player)
                );
                testing_next_ply.push(
                    Card_Combat.player_to_ply(players, the_last_player)
                );
            });
            if (
                !R.equals(testing_next_start, the_next_players)
                || !R.equals(testing_next_ply, the_next_players)
            ) {
                throw new Error(
                    "Incorrect next player to start/ply " +
                    testing_next_start + testing_next_ply
                );
            }
        }
    );
    it(
        `Given a set of player stats,
When someone is found defeated,
Then the result is:
this player's hand and board should be covered.`,
        function () {
            let board = Card_Combat.empty_board();
            let hands = Card_Combat.empty_hands();
            const players = [2, 0, 4, 5];
            const the_player = 1;
            const isDefeated = Card_Combat.isDefeated_for_player(
                players,
                the_player
            );
            const covered = Card_Combat.cover(board, hands, 1);
            board = covered[0];
            hands = covered[1];
            const board_is_covered = R.all(
                R.equals(covered_card)
            )(board[the_player]);
            const hand_is_covered = R.all(
                R.equals(covered_card)
            )(hands[the_player]);
            if (!isDefeated) {
                throw new Error(
                    "The defeated player is not found defeated: " +
                    the_player
                );
            }
            if (!board_is_covered || !hand_is_covered) {
                throw new Error(
                    "The defeated player is not covered: " +
                    board + "/n" + hands
                );
            }
        }
    );
});

describe("Stage: Draw", function () {
    it(
        `Given empty player hands and a new deck,
When cards are drawn,
Then the result is:
the players' hands should be filled with cards and the deck should be reduced`,
        function () {
            let hands = Card_Combat.empty_hands();
            let deck = Card_Combat.new_deck();
            const drawed = Card_Combat.draw(deck, hands);
            deck = drawed[0];
            hands = drawed[1];
            let hand_is_filled = true;
            R.range(0, 4).forEach(function (player) {
                hands[player].forEach(function (card) {
                    hand_is_filled *= R.includes(card)(proper_deck);
                });
            });
            const hand_length = hands.length * hands[0].length;
            if (hand_is_filled !== 1 || deck.length !== 32 - hand_length) {
                throw new Error(
                    "The hands were not filled with correct amount of card."
                );
            }
        }
    );
});

describe("Stage: Summon", function () {
    it(
        `Given a filled hand and an empty board,
When the player summons a card,
Then the result is:
the player's selected card is empty and the card takes a slot on the board`,
        function () {
            const player_num = 0;
            const hand_index = 2;
            let board = Card_Combat.empty_board();
            let hands = [
                [[1, 3], [3, 4], [2, 2], [1, 1]],
                [[2, 3], [3, 5], [1, 2], [2, 1]],
                [[3, 3], [2, 4], [3, 2], [3, 1]],
                [[1, 5], [1, 4], [2, 5], [0, 5]]
            ];
            const selected = hands[player_num][hand_index];
            const summoned = Card_Combat.summon(
                player_num,
                hand_index,
                hands,
                board
            );
            let new_board = summoned[0];
            let new_hands = summoned[1];
            if (!R.equals(new_hands[player_num][hand_index])(null)) {
                throw new Error(
                    "The card in hand isn't cleared: " +
                    new_hands[player_num][hand_index]
                );
            }
            if (!R.equals(new_board[player_num][2])(selected)) {
                throw new Error(
                    "The card on the board is not correct: " +
                    new_board[player_num][hand_index]
                );
            }
        }
    );
    it("When a player's board is filled, the player is summoned", function () {
        const board = [
            [[0, 5], [2, 2], [3, 5]],
            [[0, 5], [2, 2], [3, 5]],
            [null, null, null],
            [null, null, null]
        ];
        const player_number = 0;
        if (!Card_Combat.player_is_summoned(player_number, board)) {
            throw new Error(
                "A filled player board should be seen as summoned: " +
                board[player_number]
            );
        }
    });
    it("When the board is filled, summon is end", function () {
        const board = [
            [[0, 5], [2, 2], [3, 5]],
            [[0, 5], [2, 2], [3, 5]],
            [[0, 5], [2, 2], [3, 5]],
            [[0, 5], [2, 2], [3, 5]]
        ];
        if (!Card_Combat.summon_is_end(board)) {
            throw new Error(
                "A filled player board should be seen as summoned: " +
                board
            );
        }
    });
});


describe("Stage: Switch", function () {
    it(
        `Given a filled board, a hand and a deck,
When the player switch two cards on the board,
Then the result is:
the position of the cards should be switched`,
        function () {
            let deck = Card_Combat.new_deck();
            const player_num = 0;
            let board = [
                [[1, 3], [3, 4], [2, 2]],
                [[2, 3], [3, 5], [1, 2]],
                [[3, 3], [2, 4], [3, 2]],
                [[1, 5], [1, 4], [2, 5]]
            ];
            let hands = [
                [null, null, null, [1, 1]],
                [null, null, null, [2, 1]],
                [null, null, null, [3, 1]],
                [null, null, null, [0, 5]]
            ];
            const index1 = 2;
            const index2 = 0;
            const switched = Card_Combat.switch_card(
                player_num,
                index1,
                index2,
                0,
                "board",
                board,
                hands,
                deck
            );
            let new_board = switched[0];
            if (!R.equals(new_board[player_num][index1])(
                board[player_num][index2]
            ) || !R.equals(
                new_board[player_num][index2]
            )(board[player_num][index1])) {
                throw new Error(
                    "The cards are not switched properly: " +
                    new_board[player_num]
                );
            }

        }
    );
});

describe("Stage: Battle", function () {
    it(
        `Given a filled board and players stats,
When a player is damaged by the whole heath,
Then the result is:
The player should be defeated`,
        function () {
            let board = [
                [[0, 5], [2, 2], [3, 5]],
                [[1, 1], [1, 1], [3, 1]],
                [[3, 5], [2, 2], [0, 5]],
                [[1, 5], [3, 5], [2, 5]]
            ];
            const player_num = 1;
            let players = Card_Combat.players();
            const battled = Card_Combat.battle(board, players);
            board = battled[0];
            players = battled[1];
            if (!Card_Combat.isDefeated_for_player(players, player_num)) {
                throw new Error(
                    "A zero health player should be defeated after the battle" +
                    players
                );
            }
        }
    );
    it(
        `Given a filled board and players stats,
When 3 player is damaged by the whole heath,
Then the result is:
The last player should be the winner`,
        function () {
            let board = [
                [[1, 1], [1, 1], [1, 1]],
                [[1, 1], [1, 1], [3, 5]],
                [[1, 1], [1, 1], [3, 5]],
                [[1, 1], [1, 1], [3, 5]]
            ];
            const player_num = 3;
            let players = [1, 1, 1, 1];
            const battled = Card_Combat.battle(board, players);
            board = battled[0];
            players = battled[1];
            if (
                !Card_Combat.is_winning_for_player(players) ||
                Card_Combat.the_winner(players) !== player_num
            ) {
                throw new Error(
                    "The player who survives should win: " +
                    players
                );
            }
        }
    );
    it(
        `Given a filled board and players stats,
When all player is damaged by the whole heath,
Then the result is:
The game is end, which is a tie`,
        function () {
            let board = [
                [[1, 1], [1, 1], [3, 5]],
                [[1, 1], [1, 1], [3, 5]],
                [[1, 1], [1, 1], [3, 5]],
                [[1, 1], [1, 1], [3, 5]]
            ];
            let players = [1, 1, 1, 1];
            const battled = Card_Combat.battle(board, players);
            board = battled[0];
            players = battled[1];
            Card_Combat.is_winning_for_player(players);
            if (!Card_Combat.is_ended(players)) {
                throw new Error(
                    "The game should ends if all health equal 0" +
                    players
                );
            }
        }
    );
});