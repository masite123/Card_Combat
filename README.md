# Computing 2 Coursework Submission.
**CID**: [01887491]

## Game Instructions
Mage Combat is a fantasy card combat game. Players battle with their spells, and the player who survives from the battles wins.

Magic spells are represented by cards. There are 1 high level and 3 basic types of magic spells:
- Light type (in yellow)
- Fire type (in red)
- Grass type (in green)
- Water type (in blue)

The power of each basic spell type ranges from 1 - 5. The light spell has a power of 5.
Fire spells couter Grass spells, Grass spells counter Water spells, and Water spells counter Fire spells.
Light spells counter all basic types.

Each turn, the players draw the cards from the deck, and then enter the following phases:
- Summon: Each player select 3 cards from their hand of 4, and summon them on the board.
- Switch: After all players finish their summon phase, each player may change the position of the cards on board, according to the opponents' cards.
- Battle: The players dealt/take damages according to the following rules: 
  - Only when the spell type counters the opposing one, damage can be make.
  - Greater power makes the damage by the difference.
Play moves clock-wise through the 'summon'; 'switch'; and 'battle' phases until all but one players are eliminated.




This is the submission template for your Computing 2 Applications coursework submission.

## Checklist
### Install dependencies locally
This template relies on a a few packages from the Node Package Manager, npm.
To install them run the following commands in the terminal.
```properties
npm install
npm install --prefix ./web-app/common
```
These won't be uploaded to your repository because of the `.gitignore`.
I'll run the same commands when I download your repos.

### Game Module – API
*You will produce an API specification, i.e. a list of function names and their signatures, for a Javascript module that represents the state of your game and the operations you can perform on it that advances the game or provides information.*

- [ ] Include a `.js ` module file in `/web-app/common` containing the API using `jsdoc`.
- [ ] Update `/jsdoc.json` to point to this module in `.source.include` (line 7)
- [ ] Compile jsdoc using the run configuration `Generate Docs`
- [ ] Check the generated docs have compiled correctly.

### Game Module – Implementation
*You will implement, in Javascript, the module you specified above. Such that your game can be simulated in code, e.g. in the debug console.*

- [ ] The file above should be fully implemented.

### Unit Tests – Specification
*For the Game module API you have produced, write a set of unit tests descriptions that specify the expected behaviour of one aspect of your API, e.g. you might pick the win condition, or how the state changes when a move is made.*

- [ ] Write unit test definitions in `/web-app/tests`.
- [ ] Check the headings appear in the Testing sidebar.

### Unit Tests – Implementation
*Implement in code the unit tests specified above.*

- [ ] Implement the tests above.

### Web Application
*Produce a web application that allows a user to interface with your game module.*

- Implement in `/web-app/browser`
  - [ ] `index.html`
  - [ ] `default.css`
  - [ ] `main.js`
  - [ ] Any other files you need to include.

### Finally
- [ ] Push to GitHub.
- [ ] Sync the changes.
- [ ] Check submission on GitHub website.
