#### EKS Cross-accout Access To ECR

![Author Nashwan](https://img.shields.io/badge/Author-Nashwan%20Mustafa-orange.svg?style=flat-square)

To enable an Amazon EKS cluster to access an Amazon ECR repository across multiple AWS accounts in a multi-tenant environment, you can follow these steps:

1. **Create IAM Roles**:
   In the target account (where the ECR repository is located), create an IAM role that grants the necessary permissions to access the ECR repository.
   In the EKS account, create an IAM role that can assume the role in the target account.

2. **Update Trust Relationships**:
   Update the trust relationship of the IAM role in the target account to allow the IAM role from the EKS account to assume it.

3. **Configure ECR Repository Policy**:
   In the target account, update the ECR repository policy to allow access from the IAM role in the EKS account.

4. **Use IAM Roles for Service Accounts (IRSA)**:
   Enable IRSA in your EKS cluster to associate IAM roles with Kubernetes service accounts. This allows fine-grained permissions at the pod level.

5. **Assume Role in EKS Pods**:
   Configure your EKS pods to assume the IAM role from the target account using the service account with the associated IAM role.

Here is a high-level example of the steps:

### Step-by-Step Example

1. **Create IAM Role in Target Account**:
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

2. **Update ECR Repository Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::<EKS_ACCOUNT_ID>:role/<EKS_ROLE_NAME>"
         },
         "Action": [
           "ecr:GetDownloadUrlForLayer",
           "ecr:BatchGetImage",
           "ecr:BatchCheckLayerAvailability"
         ]
       }
     ]
   }
   ```

3. **Enable IAM Roles for Service Accounts (IRSA) in EKS

 Step1: **Create an OIDC Identity Provider for Your EKS Cluster**:
   - First, determine the OIDC issuer URL for your EKS cluster. You can find this in the EKS console under the cluster details.
   - Create an OIDC identity provider in the AWS Management Console or using the AWS CLI.

   ```sh
   aws eks describe-cluster --name <cluster_name> --query "cluster.identity.oidc.issuer" --output text
   ```

   Use the output URL to create the identity provider.

   ```sh
   aws iam create-open-id-connect-provider \
       --url https://oidc.eks.<region>.amazonaws.com/id/<eks_cluster_id> \
       --client-id-list sts.amazonaws.com \
       --thumbprint-list <thumbprint>
   ```

Step2: **Create an IAM Role for the Service Account**:
   - Create an IAM role with a trust policy that allows the EKS OIDC provider to assume the role.

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
   aws iam attach-role-policy --role-name <role_name> --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly
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

### Step 4: Configure Pods to Assume the IAM Role

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
   Check the logs of your pod to ensure it has the necessary permissions to access the ECR repository.

   ```sh
   kubectl logs <pod_name>
   ```

By following these steps, your EKS pods should be able to assume the IAM role and access the ECR repository in the target account.


For detailed instructions, you can refer to the AWS documentation on [enabling cross-account access to Amazon EKS cluster resources](https://aws.amazon.com/blogs/containers/enabling-cross-account-access-to-amazon-eks-cluster-resources/)¹ and [sharing Amazon ECR repositories with multiple accounts](https://aws.amazon.com/blogs/containers/sharing-amazon-ecr-repositories-with-multiple-accounts-using-aws-organizations/)².


Source:
(1) Enabling cross-account access to Amazon EKS cluster resources. https://aws.amazon.com/blogs/containers/enabling-cross-account-access-to-amazon-eks-cluster-resources/.
(2) Sharing Amazon ECR repositories with multiple accounts using AWS .... https://aws.amazon.com/blogs/containers/sharing-amazon-ecr-repositories-with-multiple-accounts-using-aws-organizations/.
(3) Enabling cross-account access to Amazon EKS cluster resources. https://bing.com/search?q=how+to+enable+eks+cluster+to+access+cross+account+ecr+for+multi-tenant+environments.
(4) ECR Cross Account Access | Security Best Practice - Intelligent Discovery. https://intelligentdiscovery.io/controls/ecr/ecr-cross-account-access.
(5) Adding cross-account access to EKS - DEV Community. https://dev.to/hayderimran7/adding-cross-account-access-to-eks-5ebh.
(6) Guidance on setting up cross account access to ECR for multi account .... https://github.com/aws/aws-cdk/issues/15822.
(7) undefined. https://aws.amazon.com/premiumsupport/knowledge-center/secondary-account-access-ecr/.
(8) undefined. https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ecr-readme.html.