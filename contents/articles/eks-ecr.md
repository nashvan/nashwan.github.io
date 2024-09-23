#### EKS Cross-accout Access To ECR

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

3. **Enable IRSA in EKS**:
   - Create an OIDC identity provider for your EKS cluster.
   - Associate the IAM role with a Kubernetes service account.

4. **Configure Pods to Assume Role**:
   - Annotate the Kubernetes service account with the IAM role ARN.
   - Deploy your pods using this service account.

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