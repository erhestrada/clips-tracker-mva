async function displayClip(clientId, authToken) {
    try {
      const response = await fetch("https://api.twitch.tv/helix/clips?game_id=509658&started_at=2024-10-03T16:36:58Z&ended_at=2024-10-04T16:36:58Z&is_featured=true", {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();

      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get('index');
      console.log(paramValue);
      
      //const embedUrls = clipsData.data.map((datum) => datum.embed_url)
      const embedUrls = JSON.parse(localStorage.getItem("embedUrls"));
      console.log(embedUrls);
      const embedUrl = embedUrls[paramValue];

      const iframe = document.createElement('iframe');
      iframe.src = embedUrl + "&parent=localhost&autoplay=true";
      iframe.height = 360;
      iframe.width = 640;
      iframe.frameBorder = 0;
      iframe.allowFullscreen = true;
    
      document.body.appendChild(iframe);
            
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }
  
  const data = displayClip(clientId, authToken)
  