(function() {
    // Chatbot Loader Script
    // This script can be added to any HTML page to embed the Next.js Chatbot Widget
    
    const CHATBOT_URL = 'http://localhost:3000/widget'; // Change this to your Vercel URL after deployment
    
    // Create iframe container
    const container = document.createElement('div');
    container.id = 'ai-chatbot-widget-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '999999';
    container.style.width = '100px';
    container.style.height = '100px';
    container.style.overflow = 'hidden';
    container.style.pointerEvents = 'none'; // Initially only the button is clickable inside
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = CHATBOT_URL;
    iframe.id = 'ai-chatbot-iframe';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.background = 'transparent';
    iframe.style.pointerEvents = 'auto'; // allow clicks inside iframe
    
    container.appendChild(iframe);
    document.body.appendChild(container);

    // Listen for messages from the iframe (for resizing)
    window.addEventListener('message', function(event) {
        if (event.origin !== 'http://localhost:3000') return;
        
        if (event.data.type === 'resize') {
            const width = event.data.isOpen ? '400px' : '100px';
            const height = event.data.isOpen ? '600px' : '100px';
            
            container.style.width = width;
            container.style.height = height;

            if (window.innerWidth < 640 && event.data.isOpen) {
               container.style.width = '100vw';
               container.style.height = '100vh';
               container.style.bottom = '0';
               container.style.right = '0';
            } else {
               container.style.width = width;
               container.style.height = height;
               container.style.bottom = '20px';
               container.style.right = '20px';
            }
        }
    });
})();
