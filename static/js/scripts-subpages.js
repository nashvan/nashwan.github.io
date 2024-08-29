const content_dir = 'contents/';
const config_file = 'config.yml';

window.addEventListener('DOMContentLoaded', event => {
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Load config
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            });
        })
        .catch(error => console.log(error));

    // Determine current section based on URL
    const pathname = window.location.pathname;
    let section = pathname.split("/").pop().replace('.html', '');

    if (!section || section === 'index') {
        section = 'home'; // default to 'home' if no specific section is found
    }

    // Load content based on the section
    fetch(content_dir + section + '.md')
        .then(response => response.text())
        .then(markdown => {
            const html = marked.parse(markdown);
            document.getElementById('content').innerHTML = html;
        }).then(() => {
            // MathJax typesetting
            MathJax.typeset();
        })
        .catch(error => console.log(error));
});
