<img width="100%" align="centre" alt="Github" src="../../static/assets/img/pages.png" />
[![Author Nashwan](https://img.shields.io/badge/Author-Nashwan-brightgreen.svg?style=flat-square)](https://github.com/nbmustafa)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Shell Script](https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

# Extend the Kubernetes API with CRD (CustomResourceDefinition)

- Note: CRD is part of the new CKAD syllabus. Here are a few examples of installing custom resource into the Kubernetes API by creating a CRD.

## CRD in K8s

### Create a CustomResourceDefinition manifest file for an Operator with the following specifications :
* *Name* : `operators.stable.example.com`
* *Group* : `stable.example.com`
* *Schema*: `<email: string><name: string><age: integer>`
* *Scope*: `Namespaced`
* *Names*: `<plural: operators><singular: operator><shortNames: op>`
* *Kind*: `Operator`


```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: operators.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      # One and only one version must be marked as the storage version.
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                email:
                  type: string
                name:
                  type: string
                age:
                  type: integer
  scope: Namespaced
  names:
    plural: operators
    singular: operator
    # kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: Operator
    shortNames:
    - op
```

### Create the CRD resource in the K8S API
```bash
kubectl apply -f operator-crd.yml
```

### Create custom object from the CRD

* *Name* : `operator-sample`
* *Kind*: `Operator`
* Spec:
  * email: `operator-sample@stable.example.com`
  * name: `operator sample`
  * age: `30`

```yaml
apiVersion: stable.example.com/v1
kind: Operator
metadata:
  name: operator-sample
spec:
  email: operator-sample@stable.example.com
  name: "operator sample"
  age: 30
```

```bash
kubectl apply -f operator.yml
```

### Listing operator
Use singular, plural and short forms

```bash
kubectl get operators
or
kubectl get operator
or
kubectl get op
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