/**
 * Loads the footer dynamically into the page.
 * @param {string} basePath - The relative path to the Footer directory from the current file.
 */
function loadFooter(basePath) {
    // Determine the container to inject the footer into
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) {
        console.error('Footer container not found. Please add <div id="footer-container"></div> to your HTML.');
        return;
    }

    // Load Bootstrap CSS if not already present (needed for footer styles)
    if (!document.querySelector('link[href*="bootstrap.min.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css';
        document.head.appendChild(link);
    }

    // Load Bootstrap Icons if not already present
    if (!document.querySelector('link[href*="bootstrap-icons.css"]')) {
        const iconLink = document.createElement('link');
        iconLink.rel = 'stylesheet';
        iconLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
        document.head.appendChild(iconLink);
    }

    // Load custom Footer CSS
    const cssPath = `${basePath}/footer.css`;
    if (!document.querySelector(`link[href="${cssPath}"]`)) {
        const customLink = document.createElement('link');
        customLink.rel = 'stylesheet';
        customLink.href = cssPath;
        document.head.appendChild(customLink);
    }

    // Fetch the footer HTML
    fetch(`${basePath}/footer.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load footer: ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            // Extract content inside <body> tags if present, otherwise use full HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const bodyContent = doc.body.innerHTML;

            // If body is empty (maybe it was a fragment), use just the response text
            // But since we saw the file has <html><body>... structure, extracting body innerHTML is correct.

            footerContainer.innerHTML = bodyContent;
        })
        .catch(error => console.error('Error loading footer:', error));
}
