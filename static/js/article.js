// import { marked } from '/static/js/node_modules/marked';
// import { marked } from 'marked';
import marked from 'marked';

// const marked = require('marked');

// Function to get URL query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// JavaScript code to load Markdown file
function loadMarkdown(file) {
    fetch(file)
    .then(response => {
        console.log('Response status:', response.status);
        return response.text();
    })
    .then(text => {
        console.log('Markdown content:', text);
        document.getElementById("article-content").innerHTML = marked(text);
    })
    .catch(error => console.error('Error loading markdown:', error));
}


// Get the article name from the URL query parameter
const article = getQueryParam('file');

// If an article is provided, load the corresponding markdown file
if (article) {
    loadMarkdown(`contents/articles/${article}`);
} else {
    document.getElementById("article-content").innerHTML = "<p>No article specified. Please provide an article in the URL.</p>";
}
