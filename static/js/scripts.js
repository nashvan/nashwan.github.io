

const content_dir = 'contents/'
const config_file = 'config.yml'
// const section_names = ['home', 'publications', 'awards', 'exams']
const section_names = ['home', 'publications', 'awards', 'exams', 'ckad/ckad_core_concepts', 'ckad/configuration', 'ckad/multi_container_pod', 'ckad/observability', 'ckad/pod_design', 'ckad/services_and_networking', 'ckad/state_persistence']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

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


    // Yaml
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

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })
    
    // // Marked
    // marked.use({ mangle: false, headerIds: false });
    // section_names.forEach((name, idx) => {
    //     const [section, subSection] = name.split('/');

    //     fetch(content_dir + name + '.md')
    //         .then(response => response.text())
    //         .then(markdown => {
    //             const html = marked.parse(markdown);
    //             const targetElement = subSection ? document.getElementById(subSection + '-md') : document.getElementById(section + '-md');
    //             if (targetElement) {
    //                 targetElement.innerHTML = html;
    //             } else {
    //                 console.log("Unknown id: " + name);
    //             }
    //         }).then(() => {
    //             // MathJax
    //             MathJax.typeset();
    //         })
    //         .catch(error => console.log(error));
    // });

}); 
