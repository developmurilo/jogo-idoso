// Estado do jogo
const gameState = {
  players: [
    { id: 1, position: 0, name: '' },
    { id: 2, position: 0, name: '' }
  ],
  currentPlayer: 0,
  numberDice: null,
  colorDice: null,
  diceRolling: false,
  waitingForColorDice: false,
  winner: null
};

// Audio elements
const audio = {
  backgroundMusic: new Audio('sounds/background-music.mp3'),
  diceRoll: new Audio('sounds/dice-roll.wav'),
  playerMove: new Audio('sounds/player-move.wav'),
  victory: new Audio('sounds/victory.mp3'),
  cardBenefit: new Audio('sounds/win-sound.wav'), // Novo som para card azul
  cardPenalty: new Audio('sounds/fail-sound.wav')  // Novo som para card vermelho
};

// Add sound control functions
function playSound(soundType) {
  switch(soundType) {
    case 'dice':
      audio.diceRoll.currentTime = 0;
      audio.diceRoll.play();
      break;
    case 'move':
      audio.playerMove.currentTime = 0;
      audio.playerMove.play();
      break;
    case 'victory':
      audio.backgroundMusic.pause();
      audio.victory.play();
      break;
    case 'background':
      audio.backgroundMusic.play();
      break;
  }
}

// Configure background music to loop
audio.backgroundMusic.loop = true;

let soundButton = document.getElementById('toggleSound');
soundButton.addEventListener('click', () => {
  if (audio.backgroundMusic.paused) {
    audio.backgroundMusic.play();
    soundButton.textContent = '🔊 Som';
  } else {
    audio.backgroundMusic.pause();
    soundButton.textContent = '🔈Mudo';
  }
});

// Elementos do DOM
const elements = {
  board: document.getElementById('board'),
  currentPlayerNumber: document.getElementById('currentPlayerNumber'),
  rollNumberBtn: document.getElementById('rollNumberBtn'),
  rollColorBtn: document.getElementById('rollColorBtn'),
  numberDice: document.getElementById('numberDice'),
  colorDice: document.getElementById('colorDice'),
  cardDisplay: document.getElementById('cardDisplay'),
  cardTitle: document.getElementById('cardTitle'),
  cardContent: document.getElementById('cardContent')
};

/// Inicialização do tabuleiro - Espiral Retangular Corrigido e Deitado
function initializeBoard() {
  // Add the center div with the image
  elements.board.innerHTML = 
    '<div class="board-center"><img src="images/Idoso.svg" alt="Ilustração Idoso"></div>'; 
  
  // Dimensões do tabuleiro e células (Layout Deitado e Casas Maiores)
  const boardWidth = 1350 // Conforme CSS
  const boardHeight = 850;  // Conforme CSS
  const cellWidth = 110;   // Aumentado
  const cellHeight = 130;  // Aumentado
  const spacing = 30; // Reduzido para caber melhor
  const numCells = 26;

  // Limpa o tabuleiro antes de adicionar novas células (exceto o centro)
  const existingCells = elements.board.querySelectorAll('.cell');
  existingCells.forEach(cell => cell.remove());

  // Cálculo das dimensões da grade base
  const cellsAcross = Math.floor((boardWidth - spacing) / (cellWidth + spacing));
  const cellsDown = Math.floor((boardHeight - spacing) / (cellHeight + spacing));

  // Posição inicial e centralização
  const totalSpiralWidth = cellsAcross * (cellWidth + spacing) - spacing;
  const totalSpiralHeight = cellsDown * (cellHeight + spacing) - spacing;
  let x = (boardWidth - totalSpiralWidth) / 2;
  let y = (boardHeight - totalSpiralHeight) / 2;

  // Garante que x e y não sejam negativos se o cálculo der errado
  x = Math.max(spacing, x);
  y = Math.max(spacing, y);

  let dx = cellWidth + spacing; // Movimento inicial para a direita
  let dy = 0;
  let minX = x;
  let minY = y;
  // Limites máximos baseados na primeira camada calculada
  let maxX = x + (cellsAcross - 1) * (cellWidth + spacing);
  let maxY = y + (cellsDown - 1) * (cellHeight + spacing);
  
  let direction = 0; // 0: right, 1: down, 2: left, 3: up

  for (let i = 0; i < numCells; i++) {
    const locationName = locationNames[i];
    const hasCard = cards[locationName] !== undefined;
    const isFinal = i >= (numCells - 1);
    
    const cell = document.createElement("div");
    cell.className = `cell ${hasCard ? "has-card" : "empty"} ${isFinal ? "final" : ""}`;
    cell.dataset.cellIndex = i;
    
    cell.innerHTML = `
      <span class="cell-number">${i + 1}</span>
      <span class="cell-name">${locationName}</span>
      <div class="players"></div>
    `;

    // Define a posição da célula atual
    cell.style.position = "absolute";
    // Arredonda para evitar problemas de pixel fracionado
    cell.style.left = `${Math.round(x)}px`; 
    cell.style.top = `${Math.round(y)}px`;
    
    elements.board.appendChild(cell);

    // Lógica de mudança de direção
    let moved = false;
    switch (direction) {
      case 0: // Movendo para a direita
        if (x + dx <= maxX) { x += dx; moved = true; }
        if (!moved || x + (cellWidth + spacing) > maxX + spacing/2) { // Prepara para virar
          direction = 1; dx = 0; dy = cellHeight + spacing;
          minY += cellHeight + spacing; 
          if (!moved) { y += dy; moved = true; } // Move se não conseguiu ir para direita
        }
        break;
      case 1: // Movendo para baixo
        if (y + dy <= maxY) { y += dy; moved = true; }
        if (!moved || y + (cellHeight + spacing) > maxY + spacing/2) {
          direction = 2; dx = -(cellWidth + spacing); dy = 0;
          maxX -= cellWidth + spacing;
          if (!moved) { x += dx; moved = true; }
        }
        break;
      case 2: // Movendo para a esquerda
        if (x + dx >= minX) { x += dx; moved = true; }
         if (!moved || x + dx < minX - spacing/2) {
          direction = 3; dx = 0; dy = -(cellHeight + spacing);
          maxY -= cellHeight + spacing;
          if (!moved) { y += dy; moved = true; }
        }
        break;
      case 3: // Movendo para cima
        if (y + dy >= minY) { y += dy; moved = true; }
        if (!moved || y + dy < minY - spacing/2) {
          direction = 0; dx = cellWidth + spacing; dy = 0;
          minX += cellWidth + spacing;
          if (!moved) { x += dx; moved = true; }
        }
        break;
    }
    // Fallback se algo der muito errado
    if (!moved && i < numCells -1) {
        console.error("Falha ao calcular próxima posição no espiral", i, direction, x, y, minX, maxX, minY, maxY);
        // Tenta avançar na direção atual como último recurso
        x += dx;
        y += dy;
    }

  }
  
  updatePlayerPositions();
}

// Atualização das posições dos jogadores
function updatePlayerPositions() {
  const cells = elements.board.getElementsByClassName("cell");
  
  // Remove players from old cells if they exist
  document.querySelectorAll(".player").forEach(p => p.remove());

  // Place players in their current cells
  gameState.players.forEach(player => {
    if (player.position < 26) { // Only place if on board
      const targetCell = cells[player.position];
      if (!targetCell) return; // Safety check

      let playerDiv = document.querySelector(`.player-${player.id}`);
      
      // Create player element if it doesn't exist
      if (!playerDiv) {
        playerDiv = document.createElement("div");
        playerDiv.className = `player player-${player.id}`;
        const playerIcon = document.createElement("img");
        // Usando ícones diferentes para cada jogador
        playerIcon.src = player.id === 1 ? 'images/Peão-Vôvo.svg' : 'images/Peão-Vovó.svg';
        playerIcon.alt = `Jogador ${player.id}`;
        playerDiv.appendChild(playerIcon);
        elements.board.appendChild(playerDiv); // Append to board for absolute positioning
      }

      // Calculate target position based on cell center
      const cellRect = targetCell.getBoundingClientRect();
      const boardRect = elements.board.getBoundingClientRect();
      
      // Calculate position relative to the board container
      const targetX = cellRect.left - boardRect.left + (cellRect.width / 2) - (playerDiv.offsetWidth / 2);
      const targetY = cellRect.top - boardRect.top + (cellRect.height / 2) - (playerDiv.offsetHeight / 2);

      // Apply new position using style for smooth transition
      playerDiv.style.left = `${targetX}px`;
      playerDiv.style.top = `${targetY}px`;
    }
  });
}

// Movimento do jogador com animação em arco
function movePlayer(steps, isSecondaryMovement = false) {
    const player = gameState.players[gameState.currentPlayer];
    const startPosition = player.position;
    const targetPosition = Math.max(0, Math.min(25, startPosition + steps));
    const playerDiv = document.querySelector(`.player-${player.id}`);
    const cells = elements.board.getElementsByClassName("cell");
    const animationDuration = 500; // Corresponde à duração da transição CSS

    if (!playerDiv) {
        console.error("Elemento do jogador não encontrado!");
        // Tenta recuperar ou apenas avança o turno
        if (steps !== 0) { // Evita loop infinito se o movimento for 0
           player.position = targetPosition;
           updatePlayerPositions(); // Tenta posicionar corretamente
        }
        finishMovement(); // Finaliza mesmo sem animação
        return;
    }

    // Função para mover um passo com arco
    function moveOneStepArc(currentPos) {
        const nextPos = steps > 0 ? currentPos + 1 : currentPos - 1;

        // Verifica se chegou ao destino ou ultrapassou
        if ((steps > 0 && currentPos >= targetPosition) || (steps < 0 && currentPos <= targetPosition)) {
            player.position = targetPosition; // Garante a posição final correta
            // Remove qualquer transformação residual
            playerDiv.style.transform = "translateY(0px)";
            updatePlayerPositions(); // Atualiza a posição final visualmente
            setTimeout(finishMovement, 100); // Pequeno delay antes de finalizar
            return;
        }

        // Define a posição lógica para o próximo passo
        player.position = nextPos;

        // Pega as coordenadas da célula atual e da próxima
        const currentCell = cells[currentPos];
        const nextCell = cells[nextPos];
        if (!currentCell || !nextCell) {
            console.error("Célula atual ou próxima não encontrada!");
            player.position = targetPosition; // Tenta ir para o final
            updatePlayerPositions();
            finishMovement();
            return;
        }

        const boardRect = elements.board.getBoundingClientRect();
        const nextCellRect = nextCell.getBoundingClientRect();

        // Calcula as coordenadas de destino (centro da próxima célula)
        const targetX = nextCellRect.left - boardRect.left + (nextCellRect.width / 2) - (playerDiv.offsetWidth / 2);
        const targetY = nextCellRect.top - boardRect.top + (nextCellRect.height / 2) - (playerDiv.offsetHeight / 2);

        // 1. Aplica o salto inicial (transformação para cima)
        playerDiv.style.transform = "translateY(-40px)"; // Ajuste a altura do salto conforme necessário

        // 2. Após um pequeno delay ou no próximo frame, inicia a transição para a nova posição
        // O CSS cuidará da transição suave de top/left e do arco para baixo (transform Y voltando a 0)
        playSound('move');
        requestAnimationFrame(() => {
            playerDiv.style.left = `${targetX}px`;
            playerDiv.style.top = `${targetY}px`;
            playerDiv.style.transform = "translateY(0px)"; // Volta para a posição Y normal ao aterrissar
        });

        // 3. Aguarda a duração da animação e chama o próximo passo
        setTimeout(() => {
            moveOneStepArc(nextPos);
        }, animationDuration + 50); // Adiciona um pequeno buffer
    }

    function finishMovement() {
        if(playerDiv) playerDiv.style.transform = "translateY(0px)";
        
        if (player.position >= 25 && steps > 0) {
            endGame();
            return;
        }

        const locationName = locationNames[player.position];
        const card = cards[locationName];

        // Se for movimento secundário (após carta), sempre passa o turno
        if (isSecondaryMovement) {
            gameState.waitingForColorDice = false;
            elements.rollColorBtn.disabled = true;
            setTimeout(nextTurn, 500);
            return;
        }

        // Se tem carta e não é movimento secundário, espera o dado de cor
        if (card && !isSecondaryMovement) {
            gameState.waitingForColorDice = true;
            elements.rollColorBtn.disabled = false;
        } else {
            // Se não tem carta, passa a vez imediatamente
            gameState.waitingForColorDice = false;
            elements.rollColorBtn.disabled = true;
            nextTurn();
        }
    }

    // Inicia o movimento a partir da posição atual
    moveOneStepArc(startPosition);
}

// Lançamento do dado numérico
function rollNumberDice() {
  if (gameState.diceRolling) return;
  
  playSound('dice');
  gameState.diceRolling = true;
  elements.rollNumberBtn.disabled = true;
  elements.numberDice.classList.add('rolling');
  
  let rollCount = 0;
  const totalRolls = 10;
  
  const rollInterval = setInterval(() => {
    const tempResult = Math.floor(Math.random() * 6) + 1;
    elements.numberDice.textContent = '🎲'
    rollCount++;
    
    if (rollCount >= totalRolls) {
      clearInterval(rollInterval);
      const finalResult = Math.floor(Math.random() * 6) + 1;
      elements.numberDice.textContent = `${finalResult}`
      elements.numberDice.classList.remove('rolling');
      gameState.diceRolling = false;
      gameState.numberDice = finalResult;
      
      setTimeout(() => movePlayer(finalResult), 500);
    }
  }, 100);
}

// Lançamento do dado de cor
function rollColorDice() {
    if (!gameState.waitingForColorDice || gameState.diceRolling) return;
    
    playSound('dice');
    gameState.diceRolling = true;
    elements.rollColorBtn.disabled = true;
    elements.colorDice.classList.add('color-dice-rolling');
    elements.colorDice.textContent = '';
    
    setTimeout(() => {
        const result = Math.random() < 0.5 ? 'red' : 'blue';
        gameState.colorDice = result;
        
        elements.colorDice.style.backgroundColor = result;
        elements.colorDice.classList.remove('color-dice-rolling');
        gameState.diceRolling = false;
        
        const currentCard = cards[locationNames[gameState.players[gameState.currentPlayer].position]];
        if (currentCard) {
            const movement = result === 'blue' ? 
                currentCard.blue.movement :
                currentCard.red.movement;
            
            updateCardDisplay(currentCard, result);
            showCard(currentCard);
            
            const dismissBtn = document.querySelector('.card-dismiss');
            if (dismissBtn) {
                dismissBtn.onclick = () => {
                    hideCard();
                    gameState.waitingForColorDice = false;
                    // Passa true para indicar que é um movimento secundário
                    movePlayer(movement, true);
                };
            }
        }
    }, 1000);
}

// Atualização do display da carta
function showCard(card) {
    const cardDisplay = document.getElementById('cardDisplay');
    const cardOverlay = document.querySelector('.card-overlay');
    
    // Remove hidden class and show overlay
    cardDisplay.classList.remove('hidden');
    cardOverlay.style.display = 'block';
    
    // Create dismiss button if it doesn't exist
    let dismissBtn = cardDisplay.querySelector('.card-dismiss');
    if (!dismissBtn) {
        dismissBtn = document.createElement('button');
        dismissBtn.className = 'card-dismiss';
        dismissBtn.textContent = 'OK';
        cardDisplay.appendChild(dismissBtn);
    }
    
    // Show card with animation
    requestAnimationFrame(() => {
        cardOverlay.classList.add('active');
        cardDisplay.classList.add('show', 'animate');
    });
}

function hideCard() {
    const cardDisplay = document.getElementById('cardDisplay');
    const cardOverlay = document.querySelector('.card-overlay');
    const dismissBtn = cardDisplay.querySelector('.card-dismiss');
    
    // Hide card with animation
    cardDisplay.classList.remove('show', 'animate');
    cardOverlay.classList.remove('active');
    
    // Wait for animation to complete before hiding completely
    setTimeout(() => {
        cardDisplay.classList.add('hidden');
        cardOverlay.style.display = 'none';
        // Remove the dismiss button
        if (dismissBtn) {
            dismissBtn.remove();
        }
    }, 400);
}

function updateCardDisplay(card, color) {
    const content = color === 'blue' ? card.blue : card.red;
    
    elements.cardTitle.textContent = card.title;
    elements.cardContent.className = `card-content ${color}`;
    elements.cardContent.innerHTML = `
        <p>${content.description}</p>
        <p class="movement">
            ${color === 'blue' ? 
                `Avance ${content.movement} casas` : 
                `Volte ${Math.abs(content.movement)} casas`}
        </p>
    `;
    
    // Toca o som específico do card
    if (color === 'blue') {
        audio.cardBenefit.play();
    } else {
        audio.cardPenalty.play();
    }
}

// Próximo turno
function nextTurn() {
  if (gameState.winner) return; // Don't change turns if game is over
  
  // Limpa qualquer estado pendente do turno atual
  gameState.waitingForColorDice = false;
  elements.rollColorBtn.disabled = true;
  
  // Passa para o próximo jogador
  gameState.currentPlayer = gameState.currentPlayer === 0 ? 1 : 0;
  
  // Habilita o botão de dado numérico para o novo jogador
  elements.rollNumberBtn.disabled = false;
  
  // Atualiza o indicador de turno
  updatePlayerTurn();
}

// Fim do jogo
function endGame() {
    playSound('victory');
    const winner = gameState.players[gameState.currentPlayer];
    gameState.winner = winner.id;
    
    // Create victory card data
    const victoryCard = {
        title: '🎉 Fim do Jogo! 🎉',
        blue: {
            description: `Parabéns ${winner.name}!\nVocê venceu o jogo!`,
            movement: 0
        }
    };
    
    // Show victory card
    updateCardDisplay(victoryCard, 'blue');
    showCard(victoryCard);
    // Update the dismiss button to restart the game
    const dismissBtn = document.querySelector('.card-dismiss');
    if (dismissBtn) {
        dismissBtn.textContent = 'Jogar Novamente';
        dismissBtn.onclick = () => {
            hideCard();
            resetGame();
        };
    }
    
    // Disable all game controls
    elements.rollNumberBtn.disabled = true;
    elements.rollColorBtn.disabled = true;
}

// Add new function to reset the game
function resetGame() {
    // Reset player positions
    gameState.players.forEach(player => {
        player.position = 0;
    });
    
    // Reset game state
    gameState.currentPlayer = 0;
    gameState.winner = null;
    gameState.waitingForColorDice = false;
    gameState.diceRolling = false;
    
    // Reset dice displays
    elements.numberDice.textContent = '';
    elements.colorDice.textContent = '';
    elements.colorDice.style.backgroundColor = '';
    
    // Enable roll number button for first player
    elements.rollNumberBtn.disabled = false;
    elements.rollColorBtn.disabled = true;
    
    // Update player positions on board
    updatePlayerPositions();
    
    // Update turn display
    updatePlayerTurn();
    
    // Reset and start background music
    audio.backgroundMusic.currentTime = 0;
    playSound('background');
}

// Add new function to handle game start
function startGame() {
  const player1Name = document.getElementById('player1Name').value.trim();
  const player2Name = document.getElementById('player2Name').value.trim();
  
  if (!player1Name || !player2Name) {
    alert('Por favor, insira os nomes dos dois jogadores!');
    return;
  }
  
  gameState.players[0].name = player1Name;
  gameState.players[1].name = player2Name;
  
  document.getElementById('playerSetup').style.display = 'none';
  initializeBoard();
  updatePlayerTurn();
  playSound('background');
}

// Event listeners
elements.rollNumberBtn.addEventListener('click', rollNumberDice);
elements.rollColorBtn.addEventListener('click', rollColorDice);
document.getElementById('startGameBtn').addEventListener('click', startGame);

// Inicialização do jogo
initializeBoard();

function updatePlayerTurn() {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  const playerColor = currentPlayer.id === 1 ? '#0057ed' : '#ff1904'; // Azul para jogador 1, Vermelho para jogador 2
  elements.currentPlayerNumber.innerHTML = `<span style="color: ${playerColor}">${currentPlayer.name}</span>`;
}

