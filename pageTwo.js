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
      
      const embedUrls = clipsData.data.map((datum) => datum.embed_url)
      
      const parentElement = document.body;
      const paragraph = document.createElement('p');
      paragraph.textContent = "DOES THIS WORK???";
      document.body.appendChild(paragraph);
      
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }
  
  const data = displayClip(clientId, authToken)
  