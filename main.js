
function thumbnailClickListener(index) {
    window.location.href = "test.html?" + "index=" + index;
}

function makeGetUrl() {
  const currentDateTime = getCurrentDateTime();
  const yesterdayDateTime = getPastDateTime(1);
  return "https://api.twitch.tv/helix/clips?game_id=509658&started_at=" + yesterdayDateTime + "&ended_at=" + currentDateTime + "&is_featured=true";

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
      console.log(clipsData.data);
      //console.log(embedUrls);
      //console.log(titles);
      //console.log(embedUrls[0])
      const parentElement = document.body;

      thumbnailUrls.forEach((url, index) => {
        if(languages[index] === 'en') {
            const iframe = document.createElement('iframe');
            iframe.src = url + "&parent=localhost";
            iframe.height = 360;
            iframe.width = 640;
            iframe.frameBorder = 0;
            iframe.allow = 'autoplay *; encrypted-media *;';
            iframe.loading = 'lazy';
            iframe.allowFullscreen = true;
            //iframe.onclick = () => {console.log("clicked")};
            //iframe.addEventListener('click', thumbnailClickListener);
    
            const titleElement = document.createElement('p');
            titleElement.textContent = titles[index];
            //titleElement.addEventListener('click', () => console.log("clicked"));
            titleElement.addEventListener('click', () => {thumbnailClickListener(index)});

            const imageContainer = document.createElement('div');
            imageContainer.appendChild(iframe);
            imageContainer.appendChild(titleElement);
          
            parentElement.appendChild(imageContainer);
        }

      });
  
      
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }
  
  const data = getTopClips(clientId, authToken)
  