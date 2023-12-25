

const content_dir = 'contents/'
const config_file = 'config.yml'
// const section_names = ['home', 'publications', 'awards', 'exams']
const section_names = ['ckad/ckad_core_concepts', 'ckad/configuration', 'ckad/multi_container_pod', 'ckad/observability', 'ckad/pod_design', 'ckad/services_and_networking', 'ckad/state_persistence']


window.addEventListener('DOMContentLoaded', event => {
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
    marked.use({ mangle: false, headerIds: false });
    section_names.forEach((name, idx) => {
        const [section, subSection] = name.split('/');

        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                const targetElement = subSection ? document.getElementById(subSection + '-md') : document.getElementById(section + '-md');
                if (targetElement) {
                    targetElement.innerHTML = html;
                } else {
                    console.log("Unknown id: " + name);
                }
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    });

}); 
