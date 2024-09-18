// // import { marked } from '/static/js/node_modules/marked';

// document.addEventListener('DOMContentLoaded', function () {
//     const urlParams = new URLSearchParams(window.location.search);
//     const file = urlParams.get('file');

//     if (file) {
//         console.log(`Loading file: ${file}`);
//         fetch(`contents/articles/${file}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Network response was not ok: ${response.statusText}`);
//             }
//             return response.text();
//         })
//         .then(markdown => {
//             if (typeof marked !== 'undefined') {
//                 const articleTitle = file.replace('.md', '').replace(/-/g, ' ');
//                 document.getElementById('article-title').innerText = articleTitle;
//                 const htmlContent = marked(markdown);
//                 document.getElementById('article-content').innerHTML = htmlContent;
//             } else {
//                 throw new Error('marked.js is not loaded.');
//             }
//         })
//         .catch(error => {
//             document.getElementById('article-content').innerHTML = `Failed to load the article: ${error.message}`;
//             console.error('Fetch operation failed:', error);
//         });
//     } else {
//         document.getElementById('article-content').innerHTML = 'No article specified.';
//     }
// });


// Function to get URL query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// JavaScript code to load Markdown file
function loadMarkdown(file) {
    fetch(file)
    .then(response => response.text())
    .then(text => {
        // Use marked.js to convert markdown to HTML
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
