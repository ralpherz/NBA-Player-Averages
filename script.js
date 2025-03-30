const playerInput = document.getElementById('playerInput');
const searchButton = document.getElementById('searchButton');
const loadingElement = document.getElementById('loading');
const errorMessageElement = document.getElementById('errorMessage');
const playerInfoElement = document.getElementById('playerInfo');
const playerNameElement = document.getElementById('playerName');
const playerDetailsElement = document.getElementById('playerDetails');
const ppgElement = document.getElementById('ppg');
const apgElement = document.getElementById('apg');
const rpgElement = document.getElementById('rpg');

searchButton.addEventListener('click', searchPlayer);
playerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchPlayer();
    }
});

function searchPlayer() {
    const playerName = playerInput.value.trim();
    
    if (!playerName) {
        alert("Please enter a player name");
        return;
    }
    
    resetDisplay();
    showLoading();

    fetch(`https://www.balldontlie.io/api/v1/players?search=${encodeURIComponent(playerName)}`)
        .then(handleResponse)
        .then(data => {
            if (data.data.length === 0) {
                throw new Error('Player not found');
            }
            
            const player = data.data[0];
            const playerId = player.id;

            displayPlayerInfo(player);

            return fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerId}`);
        })
        .then(handleResponse)
        .then(data => {
            hideLoading();
            
            if (data.data.length === 0) {
                displayNoStats();
            } else {
                displayPlayerStats(data.data[0]);
            }

            showPlayerInfo();
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoading();
            showError();
        });
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

function resetDisplay() {
    playerInfoElement.style.display = 'none';
    errorMessageElement.style.display = 'none';
    loadingElement.style.display = 'none';
}

function showLoading() {
    loadingElement.style.display = 'block';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError() {
    errorMessageElement.style.display = 'block';
}

function showPlayerInfo() {
    playerInfoElement.style.display = 'block';
}

function displayPlayerInfo(player) {
    playerNameElement.textContent = `${player.first_name} ${player.last_name}`;
    playerDetailsElement.textContent = 
        `${player.team.full_name} | ${player.position || 'Position not available'}`;
}

function displayPlayerStats(stats) {
    ppgElement.textContent = stats.pts.toFixed(1);
    apgElement.textContent = stats.ast.toFixed(1);
    rpgElement.textContent = stats.reb.toFixed(1);
}

function displayNoStats() {
    ppgElement.textContent = 'N/A';
    apgElement.textContent = 'N/A';
    rpgElement.textContent = 'N/A';
}