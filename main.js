
function thumbnailClickListener(index) {
    window.location.href = "test.html?" + "index=" + index;
}

function makeGetUrl() {
  const currentDateTime = getCurrentDateTime();
  const yesterdayDateTime = getPastDateTime(3);
  return "https://api.twitch.tv/helix/clips?game_id=509658&started_at=" + yesterdayDateTime + "&ended_at=" + currentDateTime + "&is_featured=false" + "&first=100";

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

async function getTopClips(clientId, authToken) {
    try {
      const getUrl = makeGetUrl();
      console.log(getUrl);
      const response = await fetch(makeGetUrl(), {
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
      console.log(clipsData.data);

      //const parentElement = document.body;

      const thumbnailCardsContainer = document.createElement('div');
      thumbnailCardsContainer.className = "thumbnail-cards-container";
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
            //thumbnail.onclick = () => {console.log("clicked")};
            thumbnail.addEventListener('click', () => {thumbnailClickListener(index)});
    
            const titleElement = document.createElement('p');
            titleElement.textContent = titles[index];
            //titleElement.addEventListener('click', () => console.log("clicked"));
            //titleElement.addEventListener('click', () => {thumbnailClickListener(index)});

            const viewCountElement = document.createElement('p');
            viewCountElement.textContent = viewCounts[index].toLocaleString() + " views";

            const thumbnailCard = document.createElement('div');
            thumbnailCard.appendChild(titleElement);
            thumbnailCard.appendChild(thumbnail);
            thumbnailCard.appendChild(viewCountElement);
            thumbnailCard.className = "thumbnail-card";
          
            parentElement.appendChild(thumbnailCard);
        }

      });
  
      
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }
  
const data = getTopClips(clientId, authToken)
const heading = document.querySelector('h1');

heading.addEventListener('click', () => {
    window.location.href = "index.html";
});