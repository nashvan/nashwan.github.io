document.addEventListener('DOMContentLoaded', function () {
    // Get the filename from the query string
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');

    if (file) {
        fetch(`contents/articles/${file}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }
                return response.text();
            })
            .then(markdown => {
                const articleTitle = file.replace('.md', '').replace(/-/g, ' ');
                document.getElementById('article-title').innerText = articleTitle;

                // Convert markdown to HTML
                const htmlContent = marked(markdown);
                document.getElementById('article-content').innerHTML = htmlContent;
            })
            .catch(error => {
                document.getElementById('article-content').innerHTML = 'Failed to load the article.';
                console.error('There was a problem with the fetch operation:', error);
            });
    } else {
        document.getElementById('article-content').innerHTML = 'No article specified.';
    }
});
