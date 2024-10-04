
// create an iframe element for every embedUrl

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
      //console.log(clipsData.data);
      console.log(embedUrls);
      //console.log(embedUrls[0])
      const parentElement = document.body;

      embedUrls.forEach((url) => {
        const iframe = document.createElement('iframe');
        iframe.src = url + "&parent=localhost";
        iframe.height = 360;
        iframe.width = 640;
        iframe.frameBorder = 0;
        iframe.allow = 'autoplay *; encrypted-media *;';
        iframe.loading = 'lazy';
        iframe.allowFullscreen = true;
      
        parentElement.appendChild(iframe);
      });
  
      
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }
  
  const data = getTopClips(clientId, authToken)
  