import Card_Combat from "../common/Card_Combat.js";

// initial states
let board = Card_Combat.empty_board();
let deck = Card_Combat.new_deck();
let hand = Card_Combat.empty_hands();
let players = Card_Combat.players();

// gameboard is an array of all elements
let gameboard = [board, deck, hand, players];

// card types
const card_types = [
    "empty", "ace", "covered",
    "red1", "red2", "red3", "red4", "red5",
    "green1", "green2", "green3", "green4", "green5",
    "blue1", "blue2", "blue3", "blue4", "blue5"
];

// gameboard sizes
const player_numbers = [0, 1, 2, 3];
const hand_size = [0, 1, 2, 3];
const board_size = [0, 1, 2];

// generate the players' stats
const player_stats = document.getElementById("players");
player_numbers.forEach(function (num) {
    const player_stats_div = document.createElement("div");
    player_stats_div.className = "player_stats";
    player_stats_div.id = `player${num}_stats`;
    player_stats_div.textContent = (
        `Player ${num + 1}
${players[num]}`
    );
    player_stats.append(player_stats_div);
});

// generate the players' hands
const hand_grid = document.getElementById("hand_grid");
player_numbers.forEach(function (player_num) {
    const player_hand_div = document.createElement("div");
    player_hand_div.className = "player_hand";
    player_hand_div.id = `player${player_num}_hand`;
    hand_grid.append(player_hand_div);
    hand_size.forEach(function (cell_index) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.tabIndex = 0;
        cell.id = `player${player_num}_hand_cell${cell_index}`;
        player_hand_div.append(cell);
    });
});

// generate the board grids
const board_grid = document.getElementById("board_grid");
player_numbers.forEach(function (player_num) {
    const player_board_div = document.createElement("div");
    player_board_div.className = "player_board";
    player_board_div.id = `player${player_num}_board`;
    board_grid.append(player_board_div);
    board_size.forEach(function (cell_index) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.classList.add("empty");
        cell.tabIndex = 0;
        cell.id = `player${player_num}_board_cell${cell_index}`;
        player_board_div.append(cell);
    });
});

/**
 * This function update the browser with the current gameboard,
 * including filling the cells by cards, changing the elements' states,
 * detecting the ending condition and starting a new game.
 **/

const update_gameboard = function (gameboard) {
    // the current states
    let cur_board = gameboard[0];
    let cur_deck = gameboard[1];
    let cur_hand = gameboard[2];
    let cur_players = gameboard[3];

    // the game end
    if (Card_Combat.is_ended(cur_players)) {
        const ingame_dialog = document.getElementById("ingame_dialog");
        ingame_dialog.close();
        let result_dialog = document.getElementById("result_dialog");
        if (Card_Combat.is_winning_for_player(cur_players)) {
            let winner = Card_Combat.the_winner(cur_players);
            result_dialog.innerHTML = `<h2>Player ${winner + 1} Wins!</h2>`;
        }
        result_dialog.close();
        result_dialog.showModal();
        result_dialog.onclick = function () {
            result_dialog.close();
            new_game();
        };
    }

    // update players' browser states
    player_numbers.forEach(function (player_num) {
        // cover a player if defeated
        if (Card_Combat.isDefeated_for_player(cur_players, player_num)) {
            freeze_player(player_num);
            let covered = Card_Combat.cover(cur_board, cur_hand, player_num);
            cur_board = covered[0];
            cur_hand = covered[1];
        }
        //update hands
        hand_size.forEach(function (hand_index) {
            const the_cell = document.getElementById(
                `player${player_num}_hand_cell${hand_index}`
            );
            the_cell.classList.remove(...card_types);
            const the_card = cur_hand[player_num][hand_index];
            if (the_card === null || undefined) {
                the_cell.classList.add("empty");
            } else if (the_card[0] === 0 && the_card[1] === 0) {
                the_cell.classList.add("covered");
            } else if (the_card[0] === 0 && the_card[1] === 5) {
                the_cell.classList.add("ace");
            } else if (the_card[0] === 1) {
                the_cell.classList.add(`red${the_card[1]}`);
            } else if (the_card[0] === 2) {
                the_cell.classList.add(`green${the_card[1]}`);
            } else if (the_card[0] === 3) {
                the_cell.classList.add(`blue${the_card[1]}`);
            }
        });
        //update boards
        board_size.forEach(function (board_index) {
            const the_cell = document.getElementById(
                `player${player_num}_board_cell${board_index}`
            );
            the_cell.classList.remove(...card_types);
            const the_card = cur_board[player_num][board_index];
            if (the_card === null || undefined) {
                the_cell.classList.add("empty");
            } else if (the_card[0] === 0 && the_card[1] === 0) {
                the_cell.classList.add("covered");
            } else if (the_card[0] === 0 && the_card[1] === 5) {
                the_cell.classList.add("ace");
            } else if (the_card[0] === 1) {
                the_cell.classList.add(`red${the_card[1]}`);
            } else if (the_card[0] === 2) {
                the_cell.classList.add(`green${the_card[1]}`);
            } else if (the_card[0] === 3) {
                the_cell.classList.add(`blue${the_card[1]}`);
            }
        });
        //update stats
        player_numbers.forEach(function (num) {
            let the_stats = document.getElementById(
                `player${num}_stats`
            );
            the_stats.textContent = (
                `Player ${num + 1}
${cur_players[num]}`
            );
        });
        //update deck
        deck = cur_deck;
    });
};

// Freeze a player if not in the turn
const freeze_player = function (player_num) {
    board_size.forEach(function (all_index) {
        const all_cells = document.getElementById(
            `player${player_num}_board_cell${all_index}`
        );
        all_cells.onclick = null;
    });
    hand_size.forEach(function (all_index) {
        const all_cells = document.getElementById(
            `player${player_num}_hand_cell${all_index}`
        );
        all_cells.onclick = null;
    });
};

// Randomly shuffle the deck
const shuffle_deck = function (deck) {
    deck.sort(() => Math.random() - 0.5);
    return deck;
};

// Draw cards
const draw = function () {
    deck = shuffle_deck(deck);
    const drawed = Card_Combat.draw(deck, hand);
    deck = drawed[0];
    hand = drawed[1];
    gameboard = [board, deck, hand, players];
    update_gameboard(gameboard);
};

// Summon cards
const summon = function (switch_is_end, player_start) {
    let player_num = player_start;
    const player_summon = function (player_num) {
        let the_hand_index = -1;
        hand_size.forEach(function (hand_index) {
            const the_cell = document.getElementById(
                `player${player_num}_hand_cell${hand_index}`
            );
            const the_stats = document.getElementById(
                `player${player_num}_stats`
            );
            the_stats.classList.remove("player_stats");
            the_stats.classList.add("turn_stats");

            the_cell.onclick = function () {
                the_hand_index = hand_index;
                const summoned = Card_Combat.summon(
                    player_num,
                    the_hand_index,
                    hand,
                    board
                );
                if (Array.isArray(summoned)) {
                    board = summoned[0];
                    hand = summoned[1];
                }
                gameboard = [board, deck, hand, players];
                update_gameboard(gameboard);
                // Show the dialog and enter "switch" phase if all summoned
                if (Card_Combat.summon_is_end(board)) {
                    freeze_player(player_num);
                    const ingame_dialog = document.getElementById(
                        "ingame_dialog"
                    );
                    ingame_dialog.innerHTML = `<h2>Switch!</h2>`;
                    ingame_dialog.showModal();
                    ingame_dialog.onclick = function () {
                        ingame_dialog.close();
                        switch_card(switch_is_end, player_start);
                    };
                }
                // Jump to the next player if current one is summoned
                if (Card_Combat.player_is_summoned(player_num, board)) {
                    freeze_player(player_num);
                    let next_player_num = Card_Combat.player_to_ply(
                        players,
                        player_num
                    );
                    the_stats.classList.remove("turn_stats");
                    the_stats.classList.add("player_stats");
                    player_summon(next_player_num);
                }
            };
        });
    };
    player_summon(player_num);
};

// Switch cards
let switch_is_end = 0;
const switch_card = function (switch_is_end, player_start) {
    let player_num = player_start;
    const player_switch = function (player_num) {
        board_size.forEach(function (board_index) {
            const the_cell = document.getElementById(
                `player${player_num}_board_cell${board_index}`
            );
            const the_stats = document.getElementById(
                `player${player_num}_stats`
            );
            the_stats.classList.remove("player_stats");
            the_stats.classList.add("turn_stats");
            the_cell.onclick = function () {
                let the_selected_index = board_index;
                let isSwitched = false;
                board_size.forEach(function (other_board_index) {
                    const the_other_cell = document.getElementById(
                        `player${player_num}_board_cell${other_board_index}`
                    );
                    the_other_cell.onclick = function () {
                        let the_other_index = other_board_index;
                        let switched = Card_Combat.switch_card(
                            player_num,
                            the_selected_index,
                            the_other_index,
                            0,
                            "board",
                            board,
                            hand,
                            deck
                        );
                        if (Array.isArray(switched)) {
                            board = switched[0];
                            hand = switched[1];
                            deck = switched[2];
                            isSwitched = true;
                        }
                        gameboard = [board, deck, hand, players];
                        update_gameboard(gameboard);
                        // jump to the next player if is switched
                        if (isSwitched) {
                            freeze_player(player_num);
                            let next_player_num = Card_Combat.player_to_ply(
                                players,
                                player_num
                            );
                            the_stats.classList.remove("turn_stats");
                            the_stats.classList.add("player_stats");
                            // Enter "battle" phase if all switched
                            if (
                                switch_is_end ===
                                Card_Combat.number_alive(players) - 1
                            ) {
                                switch_is_end = 0;
                                const ingame_dialog = document.getElementById(
                                    "ingame_dialog"
                                );
                                ingame_dialog.innerHTML = `<h2>Battle!</h2>`;
                                ingame_dialog.showModal();
                                ingame_dialog.onclick = function () {
                                    ingame_dialog.close();
                                    battle(next_player_num);
                                };
                            }
                            switch_is_end += 1;
                            player_switch(next_player_num);
                        }
                    };
                });
            };
        });
    };
    player_switch(player_num);
};
// let switch_is_end = 0;
// const switch_card = function (switch_is_end, player_start) {
//     let player_num = player_start;
//     const player_switch = function (player_num) {
//         board_size.forEach(function (board_index) {
//             const the_cell = document.getElementById(
//                 `player${player_num}_board_cell${board_index}`
//             );
//             const the_stats = document.getElementById(
//                 `player${player_num}_stats`
//             );
//             the_stats.classList.remove("player_stats");
//             the_stats.classList.add("turn_stats");
//             the_cell.onclick = function () {
//                 let the_selected_index = board_index;
//                 let isSwitched = false;
//                 board_size.forEach(function (other_board_index) {
//                     const the_other_cell = document.getElementById(
//                         `player${player_num}_board_cell${other_board_index}`
//                     );
//                     the_other_cell.onclick = function () {
//                         let the_other_index = other_board_index;
//                         let switched = Card_Combat.switch_card(
//                             player_num,
//                             the_selected_index,
//                             the_other_index,
//                             0,
//                             "board",
//                             board,
//                             hand,
//                             deck
//                         );
//                         if (Array.isArray(switched)) {
//                             board = switched[0];
//                             hand = switched[1];
//                             deck = switched[2];
//                             isSwitched = true;
//                         }
//                         gameboard = [board, deck, hand, players];
//                         update_gameboard(gameboard);
//                         switch_is_end = finish_switch (isSwitched, switch_is_end, player_num, the_stats, player_switch);
//                     };
//                     const the_deck = document.getElementById("deck");
//                     the_deck.onclick = function () {

//                         let switched = Card_Combat.switch_card(
//                             player_num,
//                             the_selected_index,
//                             -1,
//                             0,
//                             "deck",
//                             board,
//                             hand,
//                             deck
//                         );
//                         if (Array.isArray(switched)) {
//                             board = switched[0];
//                             hand = switched[1];
//                             deck = switched[2];
//                             isSwitched = true;
//                         }
//                         gameboard = [board, deck, hand, players];
//                         update_gameboard(gameboard);
//                         switch_is_end = finish_switch (isSwitched, switch_is_end, player_num, the_stats, player_switch);
//                     };
//                     const the_hand = document.getElementById("hand_grid");
//                     the_hand.onclick = function () {
//                         let hand_index = -1;
//                         hand[player_num].forEach(function (card) {
//                             if (card !== null) {
//                                 hand_index = hand[player_num].indexOf(card);
//                             }
//                         });
//                         let switched = Card_Combat.switch_card(
//                             player_num,
//                             the_selected_index,
//                             -1,
//                             hand_index,
//                             "hand",
//                             board,
//                             hand,
//                             deck
//                         );
//                         if (Array.isArray(switched)) {
//                             board = switched[0];
//                             hand = switched[1];
//                             deck = switched[2];
//                             isSwitched = true;
//                         }
//                         gameboard = [board, deck, hand, players];
//                         update_gameboard(gameboard);
//                         switch_is_end = finish_switch (isSwitched, switch_is_end, player_num, the_stats, player_switch);
//                     };
//                 });
//             };
//         });
//     };
//     player_switch(player_num);
// };

// const finish_switch = function(isSwitched, switch_is_end, player_num, the_stats, player_switch) {
//     // jump to the next player if is switched
//     if (isSwitched) {
//         freeze_player(player_num);
//         let next_player_num = Card_Combat.player_to_ply(
//             players,
//             player_num
//         );
//         the_stats.classList.remove("turn_stats");
//         the_stats.classList.add("player_stats");
//         // Enter "battle" phase if all switched
//         if (
//             switch_is_end ===
//             Card_Combat.number_alive(players) - 1
//         ) {
//             switch_is_end = 0;
//             const ingame_dialog = document.getElementById(
//                 "ingame_dialog"
//             );
//             ingame_dialog.innerHTML = `<h2>Battle!</h2>`;
//             ingame_dialog.showModal();
//             ingame_dialog.onclick = function () {
//                 ingame_dialog.close();
//                 battle(next_player_num);
//                 return switch_is_end;
//             };
//         }
//         switch_is_end += 1;
//         console.log(switch_is_end);
//         player_switch(next_player_num);
//         return switch_is_end;
//     }
// };

// Battle phase
const battle = function (player_start) {
    let battled = Card_Combat.battle(board, players);
    if (Array.isArray(battled)) {
        board = battled[0];
        players = battled[1];
    }
    gameboard = [board, deck, hand, players];
    update_gameboard(gameboard);
    new_turn(player_start);
};

// New turn includes all four phase, but keeps the players' stats (health)
const new_turn = function (player_start) {
    board = Card_Combat.empty_board();
    deck = Card_Combat.new_deck();
    hand = Card_Combat.empty_hands();
    gameboard = [board, deck, hand, players];
    const the_stats = document.getElementById(
        `player${player_start}_stats`
    );
    the_stats.classList.remove("turn_stats");
    the_stats.classList.add("player_stats");
    let starting_player = Card_Combat.player_to_start(players, player_start);
    update_gameboard(gameboard);
    draw();
    const ingame_dialog = document.getElementById("ingame_dialog");
    ingame_dialog.innerHTML = `<h2>Summon!</h2>`;
    ingame_dialog.showModal();
    ingame_dialog.onclick = function () {
        ingame_dialog.close();
        summon(switch_is_end, starting_player);
    };
};

// New game has all brand new elements
const new_game = function () {
    board = Card_Combat.empty_board();
    deck = Card_Combat.new_deck();
    hand = Card_Combat.empty_hands();
    players = Card_Combat.players();
    const start_dialog = document.getElementById("start_dialog");
    start_dialog.show();
    start_dialog.onclick = function () {
        start_dialog.close();
        const ingame_dialog = document.getElementById("ingame_dialog");
        gameboard = [board, deck, hand, players];
        update_gameboard(gameboard);
        ingame_dialog.innerHTML = `<h2>Draw!</h2>`;
        ingame_dialog.show();
        ingame_dialog.onclick = function () {
            ingame_dialog.close();
            draw();
            let starting_player = 0;
            ingame_dialog.innerHTML = `<h2>Summon!</h2>`;
            ingame_dialog.show();
            ingame_dialog.onclick = function () {
                ingame_dialog.close();
                summon(switch_is_end, starting_player);
            };
        };

    };
};

// Start
new_game();


