
// create an iframe element for every embedUrl

function thumbnailClickListener() {
    console.log("thumbnail clicked")
}

async function getTopClips(clientId, authToken) {
    try {
      const response = await fetch("https://api.twitch.tv/helix/clips?game_id=509658&started_at=2024-10-03T16:36:58Z&ended_at=2024-10-04T16:36:58Z&is_featured=true", {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();
      
      const embedUrls = clipsData.data.map((datum) => datum.embed_url)
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
            titleElement.addEventListener('click', thumbnailClickListener);

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
  