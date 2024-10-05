function displayClip(clientId, authToken) {
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get('index');
      console.log(paramValue);
      
      //const embedUrls = clipsData.data.map((datum) => datum.embed_url)
      const embedUrls = JSON.parse(localStorage.getItem("embedUrls"));
      console.log(embedUrls);
      const embedUrl = embedUrls[paramValue];

      const iframe = document.createElement('iframe');
      iframe.src = embedUrl + "&parent=localhost&autoplay=false";
      iframe.height = 360;
      iframe.width = 640;
      iframe.frameBorder = 0;
      iframe.allowFullscreen = true;
    
      document.body.appendChild(iframe); 
  }
  
const data = displayClip(clientId, authToken)

const heading = document.querySelector('h1');

heading.addEventListener('click', () => {
    window.location.href = "index.html";
});
