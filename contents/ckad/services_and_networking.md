# Services and Networking (13%)

### Create a pod with image nginx called nginx and expose its port 80
```bash
kubectl run nginx --image=nginx --restart=Never --port=80 --expose
# observe that a pod as well as a service are created
```

### Confirm that ClusterIP has been created. Also check endpoints
```bash
kubectl get svc nginx # services
kubectl get ep # endpoints
```

### Get service's ClusterIP, create a temp busybox pod and 'hit' that IP with wget
```bash
kubectl get svc nginx # get the IP (something like 10.108.93.130)
kubectl run busybox --rm --image=busybox -it --restart=Never --
wget -O- [PUT THE POD'S IP ADDRESS HERE]:80
exit
```
or

```bash
IP=$(kubectl get svc nginx --template={{.spec.clusterIP}}) # get the IP (something like 10.108.93.130)
kubectl run busybox --rm --image=busybox -it --restart=Never --env="IP=$IP" -- wget -O- $IP:80 --timeout 2
# Tip: --timeout is optional, but it helps to get answer more quickly when connection fails (in seconds vs minutes)
```


### Convert the ClusterIP to NodePort for the same service and find the NodePort port. Hit service using Node's IP. Delete the service and the pod at the end.
```bash
kubectl edit svc nginx
```

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: 2018-06-25T07:55:16Z
  name: nginx
  namespace: default
  resourceVersion: "93442"
  selfLink: /api/v1/namespaces/default/services/nginx
  uid: 191e3dac-784d-11e8-86b1-00155d9f663c
spec:
  clusterIP: 10.97.242.220
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    run: nginx
  sessionAffinity: None
  type: NodePort # change cluster IP to nodeport
status:
  loadBalancer: {}
```

or

```bash
kubectl patch svc nginx -p '{"spec":{"type":"NodePort"}}' 
```

```bash
kubectl get svc
```

```
# result:
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
kubernetes   ClusterIP   10.96.0.1        <none>        443/TCP        1d
nginx        NodePort    10.107.253.138   <none>        80:31931/TCP   3m
```

```bash
wget -O- NODE_IP:31931 # if you're using Kubernetes with Docker for Windows/Mac, try 127.0.0.1
#if you're using minikube, try minikube ip, then get the node ip such as 192.168.99.117
```

```bash
kubectl delete svc nginx # Deletes the service
kubectl delete pod nginx # Deletes the pod
```


### Create a deployment called foo using image 'dgkanatsios/simpleapp' (a simple server that returns hostname) and 3 replicas. Label it as 'app=foo'. Declare that containers in this pod will accept traffic on port 8080 (do NOT create a service yet)
```bash
kubectl create deploy foo --image=dgkanatsios/simpleapp --port=8080 --replicas=3
kubectl label deployment foo --overwrite app=foo
```


### Get the pod IPs. Create a temp busybox pod and try hitting them on port 8080
```bash
kubectl get pods -l app=foo -o wide # 'wide' will show pod IPs
kubectl run busybox --image=busybox --restart=Never -it --rm -- sh
wget -O- POD_IP:8080 # do not try with pod name, will not work
# try hitting all IPs to confirm that hostname is different
exit
# or
kubectl get po -o wide -l app=foo | awk '{print $6}' | grep -v IP | xargs -L1 -I '{}' kubectl run --rm -ti tmp --restart=Never --image=busybox -- wget -O- http://\{\}:8080
```


### Create a service that exposes the deployment on port 6262. Verify its existence, check the endpoints
```bash
kubectl expose deploy foo --port=6262 --target-port=8080
kubectl get service foo # you will see ClusterIP as well as port 6262
kubectl get endpoints foo # you will see the IPs of the three replica nodes, listening on port 8080
```


### Create a temp busybox pod and connect via wget to foo service. Verify that each time there's a different hostname returned. Delete deployment and services to cleanup the cluster
```bash
kubectl get svc # get the foo service ClusterIP
kubectl run busybox --image=busybox -it --rm --restart=Never -- sh
wget -O- foo:6262 # DNS works! run it many times, you'll see different pods responding
wget -O- SERVICE_CLUSTER_IP:6262 # ClusterIP works as well
# you can also kubectl logs on deployment pods to see the container logs
kubectl delete svc foo
kubectl delete deploy foo
```


### Create an nginx deployment of 2 replicas, expose it via a ClusterIP service on port 80. Create a NetworkPolicy so that only pods with labels 'access: granted' can access the deployment and apply it
kubernetes.io > Documentation > Concepts > Services, Load Balancing, and Networking > [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/)
```bash
kubectl create deployment nginx --image=nginx --replicas=2
kubectl expose deployment nginx --port=80

kubectl describe svc nginx # see the 'app=nginx' selector for the pods
# or
kubectl get svc nginx -o yaml

vi policy.yaml
```

```YAML
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: access-nginx # pick a name
spec:
  podSelector:
    matchLabels:
      app: nginx # selector for the pods
  ingress: # allow ingress traffic
  - from:
    - podSelector: # from pods
        matchLabels: # with this label
          access: granted
```

```bash
# Create the NetworkPolicy
kubectl create -f policy.yaml

# Check if the Network Policy has been created correctly
# make sure that your cluster's network provider supports Network Policy (https://kubernetes.io/docs/tasks/administer-cluster/declare-network-policy/#before-you-begin)
kubectl run busybox --image=busybox --rm -it --restart=Never -- wget -O- http://nginx:80 --timeout 2                          # This should not work. --timeout is optional here. But it helps to get answer more quickly (in seconds vs minutes)
kubectl run busybox --image=busybox --rm -it --restart=Never --labels=access=granted -- wget -O- http://nginx:80 --timeout 2  # This should be fine
```

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