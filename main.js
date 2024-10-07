// TODO
// 1. more gametoidconverter
// 2. refactor into class to add state, start with just global variables (for the getUrl)
// 3.1 clip player - popup? slider on top?
// 3.2 comments section
// 4.1 profiles
// 4.2 likes, dislikes
// 4.3 follows (channels, clippers), notifications

gameToIdConverter = {
  "IRL": "509672",
  "Just Chatting": "509658",
  "World of Warcraft": "18122",
  "League of Legends": "21779",
  "Grand Theft Auto V": "32982",
  "Valorant": "516575",
  "EA Sports FC 25": "2011938005",
  "Minecraft": "27471",
  "Throne and Liberty": "19801",
  "Fortnite": "33214",
  "Counter-Strike": "32399",
  "World of Warcraft": "18122",
  "Twitch All categories / multiple categories": "509658"
}

globalGame = "Just Chatting"
globalDaysBack = 1

function thumbnailClickListener(index) {
    window.location.href = "test.html?" + "index=" + index;
}

function makeGetUrl(game, daysBack) {
  const gameId = gameToIdConverter[game];
  const currentDateTime = getCurrentDateTime();
  const pastDateTime = getPastDateTime(daysBack);
  return "https://api.twitch.tv/helix/clips?game_id=" + gameId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime + "&is_featured=false" + "&first=100";

}

function getCurrentDateTime() {
  const dateTime = new Date();
  const rfcDateTime = dateTime.toISOString();
  return rfcDateTime;
}

function getPastDateTime(daysBack) {
  const hoursBack = daysBack * 24;
  const dateTime = new Date();
  const pastDateTime = new Date(dateTime.getTime() - hoursBack * 60 * 60 * 1000);
  const pastRfcDateTime = pastDateTime.toISOString();
  return pastRfcDateTime;
}

function clearThumbnailCardsContainer() {
  const element = document.getElementById("thumbnail-cards-container");
  element.remove();
}

async function getTopClips(clientId, authToken, game, daysBack) {
    try {
      const response = await fetch(makeGetUrl(game, daysBack), {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();
      
      const embedUrls = clipsData.data.map((datum) => datum.embed_url)
      localStorage.setItem("embedUrls", JSON.stringify(embedUrls));
      embedUrls.forEach((element, index) => {localStorage.setItem(index, element)})
      const thumbnailUrls = clipsData.data.map((datum) => datum.thumbnail_url)
      const titles = clipsData.data.map((datum) => datum.title)
      const languages = clipsData.data.map((datum) => datum.language)
      const viewCounts = clipsData.data.map((datum) => datum.view_count)

      const thumbnailCardsContainer = document.createElement('div');
      thumbnailCardsContainer.className = "thumbnail-cards-container";
      thumbnailCardsContainer.id = "thumbnail-cards-container";
      document.body.appendChild(thumbnailCardsContainer);
      const parentElement = thumbnailCardsContainer;

      thumbnailUrls.forEach((url, index) => {
        if(languages[index] === 'en') {
            const thumbnail = document.createElement('img');
            thumbnail.src = url + "&parent=localhost";
            thumbnail.height = 360;
            thumbnail.width = 640;
            thumbnail.frameBorder = 0;
            thumbnail.allow = 'autoplay *; encrypted-media *;';
            thumbnail.loading = 'lazy';
            thumbnail.allowFullscreen = true;
            thumbnail.className = "thumbnail";
            thumbnail.addEventListener('click', () => {thumbnailClickListener(index)});
    
            const titleElement = document.createElement('p');
            titleElement.textContent = titles[index];

            const viewCountElement = document.createElement('p');
            viewCountElement.textContent = viewCounts[index].toLocaleString() + " views";

            const thumbnailCard = document.createElement('div');
            thumbnailCard.appendChild(titleElement);
            thumbnailCard.appendChild(thumbnail);
            thumbnailCard.appendChild(viewCountElement);
            thumbnailCard.className = "thumbnail-card";
          
            parentElement.appendChild(thumbnailCard);
            console.log("yo");
        }

      });
  
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }
  
const timeFrameButtons = document.querySelectorAll('.timeframe-button');

for (const timeFrameButton of timeFrameButtons) {
  timeFrameButton.addEventListener('click', () => {
    clearThumbnailCardsContainer();
    const timeFrameText = timeFrameButton.textContent;
    const timeFrameTextToDaysBackConverter = {
      "24H": 1,
      "7D": 7,
      "30D": 30,
      "ALL": 300
    }
    globalDaysBack = timeFrameTextToDaysBackConverter[timeFrameText]
    getTopClips(clientId, authToken, globalGame, globalDaysBack);
    
  })
}

const categoriesDropDownMenu = document.getElementById('categories-dropdown-menu');

categoriesDropDownMenu.addEventListener('change', () => {
  clearThumbnailCardsContainer();
  globalGame = categoriesDropDownMenu.options[categoriesDropDownMenu.selectedIndex].text;
  //console.log(selectedText);
  getTopClips(clientId, authToken, globalGame, globalDaysBack);
});

const heading = document.querySelector('h1');
heading.addEventListener('click', () => {
    window.location.href = "index.html";
});

const data = getTopClips(clientId, authToken, globalGame, globalDaysBack)
