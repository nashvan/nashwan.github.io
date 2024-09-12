import { marked } from 'marked';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');

    if (file) {
        console.log(`Loading file: ${file}`);
        fetch(`/contents/articles/${file}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(markdown => {
            if (typeof marked !== 'undefined') {
                const articleTitle = file.replace('.md', '').replace(/-/g, ' ');
                document.getElementById('article-title').innerText = articleTitle;
                const htmlContent = marked(markdown);
                document.getElementById('article-content').innerHTML = htmlContent;
            } else {
                throw new Error('marked.js is not loaded.');
            }
        })
        .catch(error => {
            document.getElementById('article-content').innerHTML = `Failed to load the article: ${error.message}`;
            console.error('Fetch operation failed:', error);
        });
    } else {
        document.getElementById('article-content').innerHTML = 'No article specified.';
    }
});
