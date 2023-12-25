

const content_dir1 = 'contents/ckad'
const config_file1 = 'config.yml'
// const section_names = ['home', 'publications', 'awards', 'exams']
const section_names1 = ['ckad_core_concepts', 'configuration', 'multi_container_pod', 'observability', 'pod_design', 'services_and_networking', 'state_persistence']


window.addEventListener('DOMContentLoaded', event => {

    // Yaml
    fetch(content_dir1 + config_file1)
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
        fetch(content_dir1 + name + '.md')
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

}); 
