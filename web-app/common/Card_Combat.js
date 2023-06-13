import R from "../common/ramda.js";
console.log('1');
/**
 * Card_Combat.js is a module to play "card combats".
 * Cards are drawn by the players from the deck to battle the opponents,
 * until only one player is left.
 * Play moves clock-wise through the 'summon'; 'switch'; and 'battle' phases,
 * until all but one players are eliminated.
 * @namespace Card_Combat
 * @author Site
 * @version 1.0.1
 */
const Card_Combat = Object.create(null);

/**
 * The board is for the players to place the cards for combat.
 * Each player is assigned with a row to place the cards.
 * It is empty at the beginning of the turns, then filled by cards.
 * @memberof Card_Combat
 * @typedef {Card_Combat.Card_or_empty[][]} Board
 */


/**
 * A deck is a whole set of cards.
 * @memberof Card_Combat
 * @typedef {Card_Combat.Card[]} Deck
 */

/**
 * A hand is the players' hand of cards
 * @memberof Card_Combat
 * @typedef {Card_Combat.Card[]} Hand
 */

/**
 * A card is consist of two elements, colour and value.
 * @memberof Card_Combat
 * @typedef {number[]} Card
 */

/**
 * The colour is the category of the card.
 * @memberof Card_Combat
 * @typedef {(0 | 1 | 2 | 3)} Colour
 */

/**
 * The value of the card is the number on it.
 * @memberof Card_Combat
 * @typedef {(1 | 2 | 3 | 4 | 5)} Value
 */

/**
 * Card Combat has a maximum of 4 players. Represented by a number array
 * HP is the health of the players.
 * It could be reduced when the player is damaged.
 * Each element in the array represents a player.
 * The value of each element represents the HP.
 * @memberof Card_Combat
 * @typedef {number[]} Players
 */


/**
 * Create a new empty board.
 * Optionally with a specified width and height,
 * otherwise returns a standard 3 wide, 4 long board.
 * @memberof Card_Combat
 * @function
 * @param {number} [width = 3] The width of the new board.
 * @param {number} [length = 4] The length of the new board.
 * @returns {}
 */
Card_Combat.empty_board = function (height = 4, width = 3) {

    return new Array(height).fill().map(() => new Array(width).fill(null));
};

/**
 * Create new empty hands.
 * Optionally with a specified width and height,
 * otherwise returns a standard 4 wide, 4 long board.
 * @memberof Card_Combat
 * @function
 * @param {number} [width = 4] The width of the new board.
 * @param {number} [length = 4] The length of the new board.
 */
Card_Combat.empty_hands = function (height = 4, width = 4) {
    return new Array(height).fill().map(() => new Array(width).fill(null));
};

/**
 * Create a new deck.
 * Optionally with cards of specified colours and values,
 * Otherwise one typical full deck holds the following cards:
 * red 1 - 5, green 1 - 5, blue 1 - 5, white 5.
 * @memberof Card_Combat
 * @function
 * @param {number} [colours = 3]
 * @param {number} [values = 5]
 * @param {number} [sets = 2] The number of decks.
 */
Card_Combat.new_deck = function (colours = 3, values = 5, sets = 2) {
    const new_deck = [];
    const ace_card = [0, values];
    const new_regular_cards = function (colours, values, empty_deck = []) {
        const new_regular_deck = empty_deck;
        R.range(1, colours + 1).forEach(function (colour) {
            R.range(1, values + 1).forEach(function (value) {
                new_regular_deck.push([colour, value]);
            });
        });
        return new_regular_deck;
    };
    R.range(0, sets).forEach(function () {
        new_deck.push(ace_card);
        new_deck.push(...new_regular_cards(colours, values));
    });

    return (new_deck);
};

/**
 * Create a new set of players
 * @memberof Card_Combat
 * @function
 * @param {number} number The number of players
 * @param {number} health The health of each player
 * @returns {Card_Combat.Players} A new set of players with full health.
 */
Card_Combat.players = function (number = 4, health = 10) {
    return new Array(number).fill(health);
};

/**
 * Returns if a game has ended,
 * either because a player has won or every player is defeated.
 * @memberof Card_Combat
 * @function
 * @param {Card_Combat.Players} players The players stats to test.
 * @returns {boolean} Whether the game has ended.
 */
Card_Combat.is_ended = function (players) {
    return (
        Card_Combat.is_winning_for_player(players) ||
        R.all(R.equals(0))(players)
    );
};

/**
 * Returns if the game has a winner,
 * who is the only player survives
 * @memberof Card_Combat
 * @function
 * @param {number[]} players The players stats to test.
 * @returns {boolean} Whether the game has a winner or not.
 */
Card_Combat.is_winning_for_player = function (players) {
    return players.filter(
        (health) => health === 0
    ).length === (players.length - 1);
};

/**
 * Returns the winner of the game.
 * @memberof Card_Combat
 * @function
 * @param {number[]} players The players stats to test.
 * @returns {number} The player number of the winner.
 */
Card_Combat.the_winner = function (players) {
    let the_winner = null;
    if (Card_Combat.is_winning_for_player(players)) {
        players.forEach(function (player) {
            if (player !== 0) {
                the_winner = players.indexOf(player);
            }
        });
    }
    return the_winner;
};

/**
 * Return if a player is defeated
 * @memberof Card_Combat
 * @function
 * @param {number} players The players stats to test.
 * @param {number[]} player_number The player number to test.
 * @returns {boolean} Whether the player is defeated or not.
 */
Card_Combat.isDefeated_for_player = function (players, player_number) {
    return players[player_number] === 0;
};

/**
 * Return the number of the alive players.
 * @memberof Card_Combat
 * @function
 * @param {number[]} players The players stats to test.
 * @returns {number} The number of alive players.
 */
Card_Combat.number_alive = function (players) {
    let number_alive = 0;
    if (!Card_Combat.is_winning_for_player(players)) {
        players.forEach(function (player) {
            if (player !== 0) {
                number_alive += 1;
            }
        });
    }
    return number_alive;
};

/*
 Summon phase("summon"):
 each player draw cards clockwisely,
 and summons the selected cards
 */

 /**
 * Returns which player is the next to start a turn.
 * This player is also the first to make a ply in this turn.
 * @memberof Card_Combat
 * @function
 * @param {Card_Combat.Players} players The players to check.
 * @param {number} [last_player = 3] The starting player for the last turn
 * @returns {number} The player to start.
 */
Card_Combat.player_to_start = function (players, last_player = 3) {
    const starting_player = find_next_alive(players, last_player);
    return starting_player;
};

/**
 * Returns the player to ply with in a turn.
 * @memberof Card_Combat
 * @function
 * @param {Card_Combat.Players} players The players to check.
 * @param {number} last_player The last player to ply.
 * @returns {number} The player to ply.
 */
Card_Combat.player_to_ply = function (players, last_player) {
    const player_to_ply = find_next_alive(players, last_player);
    return player_to_ply;
};


const find_next_alive = function (players, last_player) {
    let next_alive_player = last_player;
    if (last_player < players.length - 1) {
        next_alive_player = last_player + 1;
    } else if (last_player === players.length - 1) {
        next_alive_player = 0;
    }
    if (Card_Combat.isDefeated_for_player(players, next_alive_player)) {
        next_alive_player = find_next_alive(players, next_alive_player);
    }
    if (!Card_Combat.isDefeated_for_player(players, next_alive_player)) {
        return next_alive_player;
    }
};


/**
 * Each player draws card from the deck
 * @memberof Card_Combat
 * @function
 * @param {Card_Combat.Deck} deck The deck to be drawn.
 * @param {Card_Combat.Hand} hand The hand to be filled.
 * @returns {number[]} The new deck and hand.
 */
Card_Combat.draw = function (deck, hand) {

    const filled_hand = [];
    hand.forEach(function (player_hand) {
        const hand_size = player_hand.length;
        const the_cards = deck.slice(0, hand_size);
        filled_hand.push(the_cards);
        deck.splice(0, hand_size);
    });
    hand = filled_hand;
    return [deck, hand];
};

const isFilled = function (cell) {
    const filled = (cell !== null || undefined);
    return filled;
};

/**
 * The player select one card from the hand,
 * and the card will be summoned on the board.
 * @memberof Card_Combat
 * @function
 * @param {number} player_number The player number that makes the summon.
 * @param {number} hand_index The index of the selected card.
 * @param {Card_Combat.Hand} hand The hand of the players.
 * @param {Card_Combat.Board} board The board to be summoned.
 * @returns {number[]} The new board and hand.
 */
Card_Combat.summon = function (player_number, hand_index, hand, board) {

    if (board[player_number].every(isFilled)) {
        return undefined;
    }
    const selected_card = hand[player_number][hand_index];
    const empty_index = [];
    R.range(0, board[player_number].length).forEach(function (index) {
        if (!isFilled(board[player_number][index])) {
            empty_index.push(index);
        }
    });
    board[player_number][empty_index.length - 1] = selected_card;
    hand[player_number][hand_index] = null;
    return [board, hand];
};

/**
 * Test if the summon phase is end.
 * It ends when all the players complete their summon.
 * @memberof Card_Combat
 * @function
 * @param {Card_Combat.Board} board The board to be tested
 * @returns {boolean} Whether the summon is end.
 */
Card_Combat.summon_is_end = function (board) {
    let end = true;
    board.forEach(function (player_board) {
        let pbis_filled = player_board.every(isFilled);
        end *= pbis_filled;
    });
    return end === 1;
};

/**
 * Test if the player finish their summon.
 * @memberof Card_Combat
 * @function
 * @param {number} player_number The player to be tested
 * @param {Card_Combat.Board} board The summoned board.
 * @returns {boolean} Whether the player finishes the summon.
 */
Card_Combat.player_is_summoned = function (player_number, board) {
    return board[player_number].every(isFilled);
};



/*
Switch Phase
 */

/**
 * Returns a board after the player switching the cards
 * Each player has one chance.
 * The card on the board can be switched with another card from,
 * the board, the hand, or the deck.
 * @memberof Card_Combat
 * @function
 * @param {number} player_number The current player number
 * @param {number} board_index The index of the selected card
 * @param {string} place The place where the player wants to switch
 * @param {Card_Combat.Board} board
 * @param {Card_Combat.Hand} hand
 * @param {Card_Combat.Deck} deck
 * @returns {number[]} The new board, hand, and deck.
 */
Card_Combat.switch_card = function (
    player_number,
    board_index1,
    board_index2,
    hand_index,
    place,
    board,
    hand,
    deck
) {
    if (place === "pass") {
        return [board, hand, deck];
    }
    const switched_board = R.clone(board);
    if (place === "board") {
        switched_board[player_number][board_index2] =
        board[player_number][board_index1];
        switched_board[player_number][board_index1] = (
            board[player_number][board_index2]
        );
        board = switched_board;
        return [board, hand, deck];
    }
    if (place === "hand") {
        switched_board[player_number][board_index1] =
        hand[player_number][hand_index];
        hand[player_number][hand_index] = board[player_number][board_index1];
        board = switched_board;
        return [board, hand, deck];
    }
    if (place === "deck") {
        switched_board[player_number][board_index1] = deck[0];
        deck[0] = board[player_number][board_index1];
        board = switched_board;
        return [board, hand, deck];
    }
};

/*
Battle phase
*/

/**
 * Calculate the damage taken of each player and updated the stats.
 * Bigger number beats the smaller one. Card being countered takes the damage.
 * Red counters green, green counters blue and blue counters red.
 * Ace counters every colours.
 * @memberof Card_Combat
 * @function
 * @param {Card_Combat.Board} board The board to calculate.
 * @param {Card_Combat.Players} players The player stats to update.
 * @returns {number[]} new gameboard and stats.
 */
Card_Combat.battle = function (board, players) {
    const players_number = players.length;
    R.range(0, players_number).forEach(function (player_number) {
        const damage = calculate_damage_for_player(player_number, board);
        players = take_damage_for_player(players, player_number, damage);
    });
    return [board, players];
};

// update the stats
const take_damage_for_player = function (players, player_number, damage) {
    const players_damaged = R.clone(players);
    if (damage <= players_damaged[player_number]) {
        players_damaged[player_number] -= damage;
    } else if (damage > players_damaged[player_number]) {
        players_damaged[player_number] = 0;
    }
    return players_damaged;
};

// calculate the damage for a player
const calculate_damage_for_player = function (player_number, board) {
    const player_board = board[player_number];
    const player_length = board.length - 1;
    let last_player_index = (
        player_number === 0
        ? player_length
        : player_number - 1
    );
    let next_player_index = (
        player_number === player_length
        ? 0
        : player_number + 1
    );
    let next2_player_index = (
        player_number === player_length - 1
        ? 0
        : next_player_index + 1
    );
    let total_damage = 0;
    R.range(0, player_board.length).forEach(function (card_index) {
        let selected_card = player_board[card_index];
        let opposing_card = [];
        if (card_index === 0) {
            opposing_card = board[next_player_index][2];
        }
        if (card_index === 1) {
            opposing_card = board[next2_player_index][1];
        }
        if (card_index === 2) {
            opposing_card = board[last_player_index][0];
        }
        let card_damage = compare_cards(opposing_card, selected_card);
        total_damage += card_damage;
    });
    return total_damage;
};

// calculate the damage done by a card
const compare_cards = function (card_1, card_2) {
    const colour_card1 = card_1[0];
    const colour_card2 = card_2[0];
    const value_card1 = card_1[1];
    const value_card2 = card_2[1];
    let card_damage = 0;
    if (colour_card2 !== 0) {
        if (colour_card1 === 0) {
            card_damage = value_card1 - value_card2;
        } else if (
            colour_card1 === colour_card2 - 1 ||
            colour_card1 === colour_card2 + 2
        ) {
            card_damage = value_card1 - value_card2;
        }
    }
    if (card_damage < 0) {
        card_damage = 0;
    }
    return card_damage;
};

/**
 * Covers the cards of a player.
 * Make the cards to be ignored.
 * @memberof Card_Combat
 * @function
 * @param {Card_Combat.Board} board The board to be covered.
 * @param {Card_Combat.Hand} hand The hand to be covered.
 * @param {number} player_number The player being covered.
 * @returns {number[]} New board and hand.
 */
Card_Combat.cover = function (board, hand, player_number) {
    board[player_number].fill([0, 0]);
    hand[player_number].fill([0, 0]);
    return [board, hand];
};

export default Object.freeze(Card_Combat);      