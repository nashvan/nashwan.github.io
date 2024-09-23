### How to Protect Organisations AWS Environments from Accessing to Leaky Public s3 Buckets

![Author Nashwan](https://img.shields.io/badge/Author-Nashwan%20Mustafa-orange.svg?style=flat-square)

To protect organization’s AWS environment from accessing leaky, external, or malware-infected public S3 buckets, you can implement a combination of technical controls, monitoring, and security best practices. Here’s a comprehensive approach to mitigate the risks:

1. Restrict Access to External Public S3 Buckets

Service Control Policies (SCP):

If using AWS Organizations, apply SCPs to restrict access to external or public S3 buckets. You can write policies that prevent any account from accessing buckets that are not explicitly trusted.

Example SCP policy condition: s3:RequestDestinationBucket to limit which buckets can be accessed.


IAM Policies with Conditions:

Use IAM policies with Condition keys like aws:SourceVpce (for VPC endpoints) or aws:PrincipalOrgID to ensure S3 access is restricted only to trusted internal buckets. This prevents accidental access to external public buckets.

Example condition to deny access to public buckets:

```json
{
  "Effect": "Deny",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::*",
  "Condition": {
    "StringEquals": {
      "s3:ResourceTag/PublicAccess": "True"
    }
  }
}
```

2. Use VPC Endpoints for S3

Restrict S3 Traffic within VPC: Configure S3 VPC Endpoints to ensure that S3 access only occurs through specific endpoints in your VPC, preventing internet traffic from reaching malicious external S3 buckets.

VPC Endpoint Policy: Apply a restrictive VPC Endpoint Policy that allows access only to your organization's S3 buckets and denies access to external buckets. Example policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-secure-bucket",
        "arn:aws:s3:::my-secure-bucket/*"
      ]
    }
  ]
}
```

3. Network Layer Protections

AWS WAF and Firewall Rules: Use AWS Web Application Firewall (WAF), or external firewall solutions, to block access to known malicious domains or IP ranges that may host leaky or compromised S3 buckets.

DNS Filtering: Implement DNS filtering using services like Route 53 Resolver DNS Firewall or third-party solutions to block access to known malicious S3 URLs or domains.


4. S3 Bucket Access Monitoring and Threat Detection

Amazon GuardDuty for S3:

Enable Amazon GuardDuty S3 Protection to detect suspicious activities, such as access from known malicious IP addresses or unusual access patterns involving external public buckets.


S3 Access Logs and CloudTrail:

Enable CloudTrail and S3 Access Logs to capture all bucket-level API activity. Regularly review logs and set up alerts for any unauthorized or unusual access patterns involving external public buckets.



5. Automate Security Checks

AWS Config Rules:

Use AWS Config to automatically check for any public S3 access from your environment. Config rules like s3-bucket-public-read-prohibited or s3-bucket-public-write-prohibited can enforce security policies.

Set up custom Config rules to block access to any external public buckets based on specific bucket conditions (e.g., no specific ACLs).



6. Use S3 Object Lock and Encryption

S3 Object Lock: For critical buckets, enable S3 Object Lock with a legal hold or retention policy to ensure data integrity and prevent tampering from external or public access.

Encryption Policies: Enforce encryption for all data leaving or entering your S3 environment using server-side encryption (SSE) with AWS KMS to ensure secure data handling.


7. Endpoint and Malware Protection

Antivirus/Malware Scanning: Integrate antivirus and malware scanning tools for any data downloaded from external S3 buckets to endpoints within your organization. This can help prevent malware from spreading through compromised public S3 buckets.

Security Groups and ACLs: Ensure that Security Groups and Network ACLs are properly configured to block outbound access to known malicious IPs or regions that may host suspicious public buckets.


8. Threat Intelligence Feeds and Automated Blocklists

Threat Intelligence Services: Subscribe to threat intelligence feeds (e.g., AWS Shield, CrowdStrike, or Palo Alto) that can automatically update your firewall or endpoint protection to block access to known malicious public S3 buckets.

Automated Blocklists: Use automated systems to dynamically update blocklists for malicious S3 domains or URLs based on real-time threat data.


9. User Awareness and Training

Educate your teams on the dangers of accessing unverified public S3 buckets and enforce strict policies on verifying bucket sources before downloading any data.


By implementing a multi-layered approach combining access restrictions, monitoring, network protection, and real-time threat detection, you can effectively safeguard your AWS environment from accessing malicious or leaky public S3 buckets.


