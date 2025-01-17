# Configuration (18%)

## ConfigMaps

kubernetes.io > Documentation > Tasks > Configure Pods and Containers > [Configure a Pod to Use a ConfigMap](https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/)

### Create a configmap named config with values foo=lala,foo2=lolo
```bash
kubectl create configmap config --from-literal=foo=lala --from-literal=foo2=lolo
```

### Display its values
```bash
kubectl get cm config -o yaml
# or
kubectl describe cm config
```

### Create and display a configmap from a file
Create the file with

```bash
echo -e "foo3=lili\nfoo4=lele" > config.txt
```

```bash
kubectl create cm configmap2 --from-file=config.txt
kubectl get cm configmap2 -o yaml
```

### Create and display a configmap from a .env file
Create the file with the command

```bash
echo -e "var1=val1\n# this is a comment\n\nvar2=val2\n#anothercomment" > config.env
```

```bash
kubectl create cm configmap3 --from-env-file=config.env
kubectl get cm configmap3 -o yaml
```

### Create and display a configmap from a file, giving the key 'special'
Create the file with

```bash
echo -e "var3=val3\nvar4=val4" > config4.txt
```

```bash
kubectl create cm configmap4 --from-file=special=config4.txt
kubectl describe cm configmap4
kubectl get cm configmap4 -o yaml
```

### Create a configMap called 'options' with the value var5=val5. Create a new nginx pod that loads the value from variable 'var5' in an env variable called 'option'
```bash
kubectl create cm options --from-literal=var5=val5
kubectl run nginx --image=nginx --restart=Never --dry-run=client -o yaml > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
    env:
    - name: option # name of the env variable
      valueFrom:
        configMapKeyRef:
          name: options # name of config map
          key: var5 # name of the entity in config map
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

```bash
kubectl create -f pod.yaml
kubectl exec -it nginx -- env | grep option # will show 'option=val5'
```

### Create a configMap 'anotherone' with values 'var6=val6', 'var7=val7'. Load this configMap as env variables into a new nginx pod
```bash
kubectl create configmap anotherone --from-literal=var6=val6 --from-literal=var7=val7
kubectl run --restart=Never nginx --image=nginx -o yaml --dry-run=client > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
    envFrom: # different than previous one, that was 'env'
    - configMapRef: # different from the previous one, was 'configMapKeyRef'
        name: anotherone # the name of the config map
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

```bash
kubectl create -f pod.yaml
kubectl exec -it nginx -- env 
```

### Create a configMap 'cmvolume' with values 'var8=val8', 'var9=val9'. Load this as a volume inside an nginx pod on path '/etc/lala'. Create the pod and 'ls' into the '/etc/lala' directory.
```bash
kubectl create configmap cmvolume --from-literal=var8=val8 --from-literal=var9=val9
kubectl run nginx --image=nginx --restart=Never -o yaml --dry-run=client > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  volumes: # add a volumes list
  - name: myvolume # just a name, you'll reference this in the pods
    configMap:
      name: cmvolume # name of your configmap
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
    volumeMounts: # your volume mounts are listed here
    - name: myvolume # the name that you specified in pod.spec.volumes.name
      mountPath: /etc/lala # the path inside your container
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

```bash
kubectl create -f pod.yaml
kubectl exec -it nginx -- /bin/sh
cd /etc/lala
ls # will show var8 var9
cat var8 # will show val8
```

## SecurityContext
kubernetes.io > Documentation > Tasks > Configure Pods and Containers > [Configure a Security Context for a Pod or Container](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)

### Create the YAML for an nginx pod that runs with the user ID 101. No need to create the pod
```bash
kubectl run nginx --image=nginx --restart=Never --dry-run=client -o yaml > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  securityContext: # insert this line
    runAsUser: 101 # UID for the user
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

### Create the YAML for an nginx pod that has the capabilities "NET_ADMIN", "SYS_TIME" added on its single container
```bash
kubectl run nginx --image=nginx --restart=Never --dry-run=client -o yaml > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    securityContext: # insert this line
      capabilities: # and this
        add: ["NET_ADMIN", "SYS_TIME"] # this as well
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

## Resource requests and limits

kubernetes.io > Documentation > Tasks > Configure Pods and Containers > [Assign CPU Resources to Containers and Pods](https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Create an nginx pod with requests cpu=100m,memory=256Mi and limits cpu=200m,memory=512Mi
```bash
kubectl run nginx --image=nginx --restart=Never --requests='cpu=100m,memory=256Mi' --limits='cpu=200m,memory=512Mi'
```

Note: Use of `--requests` and `--limits` flags in the imperative `run` command is deprecated as of 1.21 K8s version and will be removed in the future. Instead, use `kubectl set resources` command in combination with `kubectl run --dry-run=client -o yaml ...` as shown below.

Alternative using `set resources` in combination with imperative `run` command:

```bash
kubectl run nginx --image=nginx --restart=Never --dry-run=client -o yaml | kubectl set resources -f - --requests=cpu=100m,memory=256Mi --limits=cpu=200m,memory=512Mi --local -o yaml > nginx-pod.yml
```

```bash
kubectl create -f nginx-pod.yml
```

## Resource Quotas
kubernetes.io > Documentation > Concepts > Policies > Resource Quotas (https://kubernetes.io/docs/concepts/policy/resource-quotas/)

### Create ResourceQuota in namespace `one` with hard requests `cpu=1`, `memory=1Gi` and hard limits `cpu=2`, `memory=2Gi`.

Create the namespace:
```bash
kubectl create ns one
```

Create the ResourceQuota
```bash
vi rq-one.yaml
```

```YAML
apiVersion: v1
kind: ResourceQuota
metadata:
  name: my-rq
  namespace: one
spec:
  hard:
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
```

```bash
kubectl apply -f rq-one.yaml
```

### Attempt to create a pod with resource requests `cpu=2`, `memory=3Gi` and limits `cpu=3`, `memory=4Gi` in namespace `one`

```bash
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
  namespace: one
spec:
  containers:
  - image: nginx
    name: nginx
    resources:
      requests:
        memory: "3Gi"
        cpu: "2"
      limits:
        memory: "4Gi"
        cpu: "3"
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

```bash
kubectl create -f pod.yaml
```

Expected error message:
```bash
Error from server (Forbidden): error when creating "pod.yaml": pods "nginx" is forbidden: exceeded quota: my-rq, requested: limits.cpu=3,limits.memory=4Gi,requests.cpu=2,requests.memory=3Gi, used: limits.cpu=0,limits.memory=0,requests.cpu=0,requests.memory=0, limited: limits.cpu=2,limits.memory=2Gi,requests.cpu=1,requests.memory=1Gi
```

### Create a pod with resource requests `cpu=0.5`, `memory=1Gi` and limits `cpu=1`, `memory=2Gi` in namespace `one`

```bash
vi pod2.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
  namespace: one
spec:
  containers:
  - image: nginx
    name: nginx
    resources:
      requests:
        memory: "1Gi"
        cpu: "0.5"
      limits:
        memory: "2Gi"
        cpu: "1"
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

```bash
kubectl create -f pod2.yaml
```

or
```bash
kubectl create quota my-rq --namespace=one --hard=requests.cpu=1,requests.memory=1Gi,limits.cpu=2,limits.memory=2Gi
```

Show the ResourceQuota usage in namespace `one`
```bash
kubectl get resourcequota -n one
```

```
NAME    AGE   REQUEST                                          LIMIT
my-rq   10m   requests.cpu: 500m/1, requests.memory: 3Mi/1Gi   limits.cpu: 1/2, limits.memory: 4Mi/2Gi
```


## Secrets
kubernetes.io > Documentation > Concepts > Configuration > [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)

kubernetes.io > Documentation > Tasks > Inject Data Into Applications > [Distribute Credentials Securely Using Secrets](https://kubernetes.io/docs/tasks/inject-data-application/distribute-credentials-secure/)

### Create a secret called mysecret with the values password=mypass
```bash
kubectl create secret generic mysecret --from-literal=password=mypass
```

### Create a secret called mysecret2 that gets key/value from a file
Create a file called username with the value admin:

```bash
echo -n admin > username
```

```bash
kubectl create secret generic mysecret2 --from-file=username
```

### Get the value of mysecret2
```bash
kubectl get secret mysecret2 -o yaml
echo -n YWRtaW4= | base64 -d # on MAC it is -D, which decodes the value and shows 'admin'
```

Alternative using `--jsonpath`:

```bash
kubectl get secret mysecret2 -o jsonpath='{.data.username}' | base64 -d  # on MAC it is -D
```

Alternative using `--template`:

```bash
kubectl get secret mysecret2 --template '{{.data.username}}' | base64 -d  # on MAC it is -D
```

### Create an nginx pod that mounts the secret mysecret2 in a volume on path /etc/foo
```bash
kubectl run nginx --image=nginx --restart=Never -o yaml --dry-run=client > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  volumes: # specify the volumes
  - name: foo # this name will be used for reference inside the container
    secret: # we want a secret
      secretName: mysecret2 # name of the secret - this must already exist on pod creation
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
    volumeMounts: # our volume mounts
    - name: foo # name on pod.spec.volumes
      mountPath: /etc/foo #our mount path
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

```bash
kubectl create -f pod.yaml
kubectl exec -it nginx /bin/bash
ls /etc/foo  # shows username
cat /etc/foo/username # shows admin
```

### Delete the pod you just created and mount the variable 'username' from secret mysecret2 onto a new nginx pod in env variable called 'USERNAME'
```bash
kubectl delete po nginx
kubectl run nginx --image=nginx --restart=Never -o yaml --dry-run=client > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
    env: # our env variables
    - name: USERNAME # asked name
      valueFrom:
        secretKeyRef: # secret reference
          name: mysecret2 # our secret's name
          key: username # the key of the data in the secret
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

```bash
kubectl create -f pod.yaml
kubectl exec -it nginx -- env | grep USERNAME | cut -d '=' -f 2 # will show 'admin'
```

### Create a Secret named 'ext-service-secret' in the namespace 'secret-ops'. Then, provide the key-value pair API_KEY=LmLHbYhsgWZwNifiqaRorH8T as literal.

```bash
export ns="-n secret-ops"
k create secret generic ext-service-secret -n secret-ops --from-literal=API_KEY=LmLHbYhsgWZwNifiqaRorH8T $do > sc.yaml
k apply -f sc.yaml
```

### Consuming the Secret. Create a Pod named 'consumer' with the image 'nginx' in the namespace 'secret-ops' and consume the Secret as an environment variable. Then, open an interactive shell to the Pod, and print all environment variables.

```bash
export ns="-n secret-ops"
export do="--dry-run=client -oyaml"
k run consumer --image=nginx $ns $do > nginx.yaml
vi nginx.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: consumer
  name: consumer
  namespace: secret-ops
spec:
  containers:
  - image: nginx
    name: consumer
    resources: {}
    env:
    - name: API_KEY
      valueFrom:
        secretKeyRef:
          name: ext-service-secret
          key: API_KEY
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

```bash
k exec -it $ns consumer -- /bin/sh
#env
```

### Create a Secret named 'my-secret' of type 'kubernetes.io/ssh-auth' in the namespace 'secret-ops'. Define a single key named 'ssh-privatekey', and point it to the file 'id_rsa' in this directory.

```bash
#Tips, export to variable
export do="--dry-run=client -oyaml"
export ns="-n secret-ops"

#if id_rsa file didn't exist.
ssh-keygen

k create secret generic my-secret $ns --type="kubernetes.io/ssh-auth" --from-file=ssh-privatekey=id_rsa $do > sc.yaml
k apply -f sc.yaml
```

### Create a Pod named 'consumer' with the image 'nginx' in the namespace 'secret-ops', and consume the Secret as Volume. Mount the Secret as Volume to the path /var/app with read-only access. Open an interactive shell to the Pod, and render the contents of the file.

```bash
#Tips, export to variable
export ns="-n secret-ops"
export do="--dry-run=client -oyaml"
k run consumer --image=nginx $ns $do > nginx.yaml
vi nginx.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: consumer
  name: consumer
  namespace: secret-ops
spec:
  containers:
    - image: nginx
      name: consumer
      resources: {}
      volumeMounts:
        - name: foo
          mountPath: "/var/app"
          readOnly: true
  volumes:
    - name: foo
      secret:
        secretName: my-secret
        optional: true
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}
```

```bash
k exec -it $ns consumer -- /bin/sh
# cat /var/app/ssh-privatekey
# exit
```


## ServiceAccounts
kubernetes.io > Documentation > Tasks > Configure Pods and Containers > [Configure Service Accounts for Pods](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)

### See all the service accounts of the cluster in all namespaces
```bash
kubectl get sa --all-namespaces
```
Alternatively 

```bash
kubectl get sa -A
```

### Create a new serviceaccount called 'myuser'
```bash
kubectl create sa myuser
```

Alternatively:

```bash
# let's get a template easily
kubectl get sa default -o yaml > sa.yaml
vim sa.yaml
```

```YAML
apiVersion: v1
kind: ServiceAccount
metadata:
  name: myuser
```

```bash
kubectl create -f sa.yaml
```

### Create an nginx pod that uses 'myuser' as a service account
```bash
kubectl run nginx --image=nginx --restart=Never --serviceaccount=myuser -o yaml --dry-run=client > pod.yaml
kubectl apply -f pod.yaml
```

or you can add manually:

```bash
kubectl run nginx --image=nginx --restart=Never -o yaml --dry-run=client > pod.yaml
vi pod.yaml
```

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  serviceAccountName: myuser # we use pod.spec.serviceAccountName
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

or

```YAML
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: nginx
  name: nginx
spec:
  serviceAccount: myuser # we use pod.spec.serviceAccount
  containers:
  - image: nginx
    imagePullPolicy: IfNotPresent
    name: nginx
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Never
status: {}
```

```bash
kubectl create -f pod.yaml
kubectl describe pod nginx # will see that a new secret called myuser-token-***** has been mounted
```

## Role Based Access Control (RBAC)

### Create a Role named `developer` with permissions to create, delete, get, list, and watch pod resources

Use the imperative command:

```bash
kubectl create role developer --verb=create,delete,get,list,watch --resource=pods
```

Or, create the YAML file:

```bash
vi role.yaml
```

```YAML
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: developer
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["create", "delete", "list", "get", "watch"]
```

```bash
kubectl create -f role.yaml
```

Show the Role resource:

```bash
kubectl describe role developer
```

### Create a RoleBinding for user `alice` in namespace `green`. The RoleBinding should use the role created in the previous task, `developer`
Create the namespace:
```bash
kubectl create ns green
```

Use the imperative command:

```bash
kubectl create rolebinding alice-role --user alice --role developer --namespace green
```

Or, create the yaml file:

```bash
vi rolebinding.yaml
```

```YAML
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: alice-role
  namespace: green
subjects:
- kind: User
  name: alice
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: developer
  apiGroup: rbac.authorization.k8s.io
```

```bash
kubectl create -f rolebinding.yaml
```

Show the RoleBinding resource:

```bash
kubectl describe rolebinding alice-role -n green
```

This role allows the user `alice` to perform actions on pods in the `green` namespace.


### Create a ClusterRole named `admin` with permissions to create, delete, get, list, and watch `pod` and `job` resources

Use the imperative command:

```bash
kubectl create clusterrole admin-app --verb=create,delete,get,list,watch --resource=pods --resource=jobs
```

Or, create the yaml file:

```bash
vi clusterrole.yaml
```

```YAML
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: admin-app
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["create", "delete", "list", "get", "watch"]
- apiGroups: ["batch"]
  resources: ["jobs"]
  verbs: ["create", "delete", "list", "get", "watch"]
```

```bash
kubectl create -f clusterrole.yaml
```

Show the ClusterRole resource:

```bash
kubectl describe clusterrole admin-app
```

### Create a ClusterRoleBinding for service account `app-service` which exists in the `default` namespace. The ClusterRoleBinding should use the ClusterRole created in the previous task, `admin-app`
Use the imperative command:

```bash
kubectl create clusterrolebinding app-service-role --clusterrole admin-app --serviceaccount default:app-service
```

Or, create the yaml file:

```bash
vi crb.yaml
```

```YAML
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: app-service-role
subjects:
- kind: ServiceAccount
  name: app-service
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: admin-app
```

```bash
kubectl create -f crb.yaml
```

Show the ClusterRoleBinding resource:

```bash
kubectl describe clusterrolebinding app-service-role
```

### What is the main difference between Role/RoleBinding and ClusterRole/ClusterRoleBinding?
ClusterRoleBindings do not have a `namespace` defined. When used with a ClusterRole, they grant permissions across the whole cluster.
RoleBindings, when used with Roles, grant permissions _within a namespace_.

However, a RoleBinding may reference a ClusterRole -- the permissions granted by the ClusterRole will be limited to the namespace defined in the RoleBinding.


#### Contents

- [Core Concepts - 13%](https://nbmustafa.github.io/contents/ckad/ckad_core_concepts)
- [Multi-container pods - 10%](https://nbmustafa.github.io/contents/ckad/multi_container_pod)
- [Pod design - 20%](https://nbmustafa.github.io/contents/ckad/pod_design)
- [Configuration - 18%](https://nbmustafa.github.io/contents/ckad/configuration)
- [Observability - 18%](https://nbmustafa.github.io/contents/ckad/observability)
- [Services and networking - 13%](https://nbmustafa.github.io/contents/ckad/services_and_networking)
- [State persistence - 8%](https://nbmustafa.github.io/contents/ckad/state_persistence)
- [helm](https://nbmustafa.github.io/contents/ckad/helm)
- [crd](https://nbmustafa.github.io/contents/ckad/crd)
- [podman](https://nbmustafa.github.io/contents/ckad/podman)
- [Home Page](https://nbmustafa.github.io)
