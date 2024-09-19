// Configuration for Marked.js to disable mangling and header IDs
marked.use({ mangle: false, headerIds: false });

// Function to get a URL query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch and parse markdown files
function loadMarkdownFiles(fileNames) {
    fileNames.forEach(name => {
        fetch(`contents/articles/${name}`)  // Use backticks for template literals
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${name}.md: ${response.statusText}`);  // Backticks for error message
                }
                return response.text();
            })
            .then(markdown => {
                // Convert markdown to HTML using marked.js
                const html = marked.parse(markdown);
                // Dynamically create a div to display the markdown content
                const markdownDiv = document.createElement('div');
                markdownDiv.id = `${name}-md`;  // Backticks for setting the id
                markdownDiv.innerHTML = html;
                document.getElementById('article-content').appendChild(markdownDiv);
            })
            .then(() => {
                // Process MathJax if needed
                if (typeof MathJax !== 'undefined') {
                    MathJax.typeset();
                }
            })
            .catch(error => console.error('Error loading markdown:', error));
    });
}

// Get the article file name from the URL query parameter
const fileName = getQueryParam('file');

// Load and parse the markdown file(s) if the file name is provided
if (fileName) {
    // Split file names by comma if multiple files are given
    const sectionNames = fileName.split(',').map(name => name.trim());
    loadMarkdownFiles(sectionNames);
} else {
    document.getElementById('article-content').innerHTML = "<p>No article specified. Please provide an article in the URL.</p>";
}
