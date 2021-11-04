## Deploy NodeJs App to Kubernetes with helm

in this Article we will try to instruct you how to build, publish nodejs app to docker registery and then deploy the built image of nodejs app to minikube with helm. 

Accordingly to the official website — Helm is a package manager for Kubernetes. It helps deploy complex application by bundling necessary resources into Charts, which contains all information to run application on a cluster.

Please make sure you have the following installed for your environment to be ready for applincation deployemnt with helm. In my demo I’m using:
- Docker
- locally installed Kubernetes cluster — minikube
- Kubernetes command line tool — kubectl
- Helm (v3).

There are couple approaches how to work with Helm. One of them is to download publicly available charts from the Helm Hub. They are prepared by community and are free to use.

For instance, if we would like to run Nginx-ingress on a cluster, it’s described on this page — https://artifacthub.io/packages/helm/nginx/nginx-ingress — with the following commands:

```bash
helm repo add nginx-stable https://helm.nginx.com/stable

helm repo update

helm install my-release nginx-stable/nginx-ingress

# For NGINX Plus: (assuming you have pushed the Ingress controller image nginx-plus-ingress to your private registry myregistry.example.com)
helm install my-release nginx-stable/nginx-ingress --set controller.image.repository=myregistry.example.com/nginx-plus-ingress --set controller.nginxplus=true

```


It contains some default configuration, but can be easily overridden with YAML file and passed during installation. The detailed example I’ll show in a minute.
But Helm is not only providing some predefined blueprints, you can create your own charts!
It’s very easy and can be done by a single command helm create <chart-name> , which creates a folder with a basic structure:

```bash
helm create example
Creating example
```

In the templates/ folder there are Helm templates that with combination of values.yaml will result in set of Kubernetes objects.

```bash
ls -l myapp/
total 16
-rw-r--r--  1 nashwan  staff   903B  4 Nov 17:22 Chart.yaml
drwxr-xr-x  2 nashwan  staff    64B  4 Nov 17:22 charts/
drwxr-xr-x  9 nashwan  staff   288B  4 Nov 17:22 templates/
-rw-r--r--  1 nashwan  staff   1.5K  4 Nov 17:22 values.yaml


s -l myapp/templates/
total 48
-rw-r--r--  1 nashwan  staff   1.5K  4 Nov 17:22 NOTES.txt
-rw-r--r--  1 nashwan  staff   1.8K  4 Nov 17:22 _helpers.tpl
-rw-r--r--  1 nashwan  staff   1.6K  4 Nov 17:22 deployment.yaml
-rw-r--r--  1 nashwan  staff   1.0K  4 Nov 17:22 ingress.yaml
-rw-r--r--  1 nashwan  staff   355B  4 Nov 17:22 service.yaml
-rw-r--r--  1 nashwan  staff   203B  4 Nov 17:22 serviceaccount.yaml
drwxr-xr-x  3 nashwan  staff    96B  4 Nov 17:22 tests/

```

When everything is installed you can start up the minikube cluster and enable ingress addon:
Check your minikube status, 
```bash
minikube status
❗  Executing "docker container inspect minikube --format={{.State.Status}}" took an unusually long time: 2.292283407s
💡  Restarting the docker service may improve performance.
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

if not running started
```bash
minikube start
😄  minikube v1.8.1 on Mac
✨  Automatically selected the docker driver
🔥  Creating Kubernetes in docker container with (CPUs=2) (8 available), Memory=2200MB (7826MB available) ...
🐳  Preparing Kubernetes v1.17.3 on Docker 19.03.2 ...
▪ kubeadm.pod-network-cidr=192.168.49.0/24
❌  Unable to load cached images: loading cached images: stat /home/nashwan/.minikube/cache/images/k8s.gcr.io/kube-proxy_v1.17.3: no such file or directory
🚀  Launching Kubernetes ...
🌟  Enabling addons: default-storageclass, storage-provisioner
⌛  Waiting for cluster to come online ...
🏄  Done! kubectl is now configured to use "minikube"
$ minikube addons enable ingress
🌟  The 'ingress' addon is enabled
```

To check the IP of your minikube:
```bash
minikube ip
192.168.49.2
```

Now we can create first Helm chart:
```bash
helm create myapp
Creating myapp
```



### Markdown


```markdown
Syntax highlighted code block
- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```


For more articles see [My Github Page](https://nashvan.github.io).

