// Helper function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the 'file' parameter from the URL
const file = getQueryParam('file');

if (file) {
    fetch(`../contents/articles/${file}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(markdown => {
            // Convert Markdown to HTML
            const htmlContent = marked.parse(markdown);
            // Insert the HTML into the page
            document.getElementById('content').innerHTML = htmlContent;
        })
        .catch(error => {
            console.error('Error fetching the Markdown file:', error);
            document.getElementById('content').innerHTML = '<p>Sorry, the article could not be loaded.</p>';
        });
} else {
    document.getElementById('content').innerHTML = '<p>No article specified.</p>';
}
