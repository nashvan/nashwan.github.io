#### EKS Enabling Cross-account Access to Secrets Stored in AWS Secret Manager

![Author Nashwan Mustafa](https://img.shields.io/badge/Author-Nashwan-brightgreen.svg?style=flat-square)

![Author Nashwan Mustafa](https://img.shields.io/badge/Author-Nashwan%20Mustafa-orange.svg?style=flat-square)

To enable cross-account access to AWS Secrets Manager secrets from an Amazon EKS cluster, you can follow these steps:

### Step-by-Step Guide

#### Step 1: Create an IAM Role in the Target Account (Secrets Manager Account)

1. **Create an IAM Role**:
   In the account where the secrets are stored, create an IAM role that allows the EKS cluster to assume it.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::<EKS_ACCOUNT_ID>:role/<EKS_ROLE_NAME>"
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```

2. **Attach a Policy to Access Secrets Manager**:
   Attach a policy to this role that grants permissions to access the secrets.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "secretsmanager:GetSecretValue",
           "secretsmanager:DescribeSecret"
         ],
         "Resource": "arn:aws:secretsmanager:<region>:<account_id>:secret:<secret_name>"
       }
     ]
   }
   ```

#### Step 2: Enable IAM Roles for Service Accounts (IRSA) in EKS

1. **Create an OIDC Identity Provider**:
   Determine the OIDC issuer URL for your EKS cluster and create an OIDC identity provider.

   ```sh
   aws eks describe-cluster --name <cluster_name> --query "cluster.identity.oidc.issuer" --output text
   ```

   - Use the output URL to create the identity provider.

   ```sh
   aws iam create-open-id-connect-provider \
       --url https://oidc.eks.<region>.amazonaws.com/id/<eks_cluster_id> \
       --client-id-list sts.amazonaws.com \
       --thumbprint-list <thumbprint>
   ```

2. **Create an IAM Role for the Service Account**:
   Create an IAM role with a trust policy that allows the EKS OIDC provider to assume the role.

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::<account_id>:oidc-provider/oidc.eks.<region>.amazonaws.com/id/<eks_cluster_id>"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "oidc.eks.<region>.amazonaws.com/id/<eks_cluster_id>:sub": "system:serviceaccount:<namespace>:<service_account_name>"
           }
         }
       }
     ]
   }
   ```

   Attach the necessary policies to this role.

   ```sh
   aws iam create-role --role-name <role_name> --assume-role-policy-document file://trust-policy.json
   aws iam attach-role-policy --role-name <role_name> --policy-arn arn:aws:iam::aws:policy/AmazonSecretsManagerReadOnly
   ```

3. **Associate the IAM Role with a Kubernetes Service Account**:
   Create a Kubernetes service account and annotate it with the IAM role ARN.

   ```yaml
   apiVersion: v1
   kind: ServiceAccount
   metadata:
     name: <service_account_name>
     namespace: <namespace>
     annotations:
       eks.amazonaws.com/role-arn: arn:aws:iam::<account_id>:role/<role_name>
   ```

   Apply this configuration to your EKS cluster.

   ```sh
   kubectl apply -f service-account.yaml
   ```

#### Step 3: Configure Pods to Assume the IAM Role

1. **Deploy Pods Using the Service Account**:
   Ensure your pod specification uses the service account created in the previous step.

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: <deployment_name>
     namespace: <namespace>
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: <app_label>
     template:
       metadata:
         labels:
           app: <app_label>
       spec:
         serviceAccountName: <service_account_name>
         containers:
         - name: <container_name>
           image: <image_uri>
           ports:
           - containerPort: 80
   ```

   Apply the deployment to your EKS cluster.

   ```sh
   kubectl apply -f deployment.yaml
   ```

2. **Verify the Pod Assumes the IAM Role**:
   Check the logs of your pod to ensure it has the necessary permissions to access the secrets.

   ```sh
   kubectl logs <pod_name>
   ```

By following these steps, your EKS pods should be able to assume the IAM role and access the secrets in the target account. For more detailed information, you can refer to the AWS documentation on [cross-account access with IRSA](https://docs.aws.amazon.com/eks/latest/userguide/cross-account-access.html)² and [integrating AWS Secrets Manager with EKS](https://community.aws/content/2eKLFwELDylv0Sfuj3JLd6Out9W/navigating-amazon-eks-eks-integrate-secrets-manager)³.

Sources:
(1) Authenticate to another account with IRSA - Amazon EKS. https://docs.aws.amazon.com/eks/latest/userguide/cross-account-access.html.
(2) Easily Consume AWS Secrets Manager Secrets From Your Amazon EKS Workloads. https://community.aws/content/2eKLFwELDylv0Sfuj3JLd6Out9W/navigating-amazon-eks-eks-integrate-secrets-manager.
(3) Enabling cross-account access to Amazon EKS cluster resources. https://aws.amazon.com/blogs/containers/enabling-cross-account-access-to-amazon-eks-cluster-resources/.
(4) Provide access to other IAM users and roles after cluster creation in .... https://repost.aws/knowledge-center/amazon-eks-cluster-access.
(5) Accessing AWS Secret Manager in Kubernetes Service Cluster - Xebia. https://xebia.com/blog/how-to-access-your-aws-secret-manager-secrets-in-an-elastic-kubernetes-service-cluster/.