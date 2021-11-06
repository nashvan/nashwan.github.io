
Here are the five pillars of an AWS Well-Architected Framework:

# 1. Operational Excellence
The Operational Excellence pillar includes the ability to support development and run workloads effectively, gain insight into their operation, and continuously improve supporting processes and procedures to delivery business value. You can find prescriptive guidance on implementation in the Operational Excellence Pillar whitepaper.

**Tools**
- Infra and Operation as Code - Terraform
- SSM Inventory, SSM Patch Manager
- SNS(publisher and subscriber)
    - SNS can **notify someone** or **trigger an automation remediation**
- CloudWatch (logs, Alarms, metrics)
    - metrics: 
        - Application Metrics(number of requests, error codes, ets)
            - lambda function get invoked after every data write using the S3 PutObject API call
            - for lambda we usually monitor invocation and error 
        - Infra Metrics (CPU, memory, disk usage)
    - Alarm:
        - Can be used to Auto initiate an action on your behalf. Action can be either **SNS-topic** or **Auto-Scaling Policy**. 


**Design Principles**
There are five design principles for operational excellence in the cloud:

- **Operations as Code** – Automate the creation of different infrastructure using tools like CloudFormation
- **Automated Documentation from Annotations** – We should document how different components of the system interact with each other. Whenever there are some changes in the systems, the documentation should also update automatically. This will prevent integrations from breaking apart upon some changes
- **Make frequent and reversible changes** – It is a good idea to make small and reversible changes to the production environment, rather than big time changes. This helps to quickly restore to a version in case there are some issues with the changes
- **Anticipate Failure** – Always design your system to anticipate and accept failures, test them to make your system more robust
- **Learn from Operational Failures** – Whenever there is a failure, make a note of the root cause and take lessons

**Best Practices**
Operations teams need to understand their business and customer needs so they can support business outcomes. Ops creates and uses procedures to respond to operational events, and validates their effectiveness to support business needs. Ops also collects metrics that are used to measure the achievement of desired business outcomes.

Everything continues to change—your business context, business priorities, customer needs, etc. It’s important to design operations to support evolution over time in response to change and to incorporate lessons learned through their performance.


# 2. Security
The Security pillar includes the ability to protect data, systems, and assets to take advantage of cloud technologies to improve your security. You can find prescriptive guidance on implementation in the Security Pillar whitepaper.

**-Design Principles**
There are seven design principles for security in the cloud:

- **Strong Identity Foundation** – Follow key principles like granting least privilege, separation of duties, appropriate authorization level, etc.
- **Enable Traceability** – Audit any change or action to any environment and by whom. This enables us to maintain transparency within the organization. Monitor logs and takes action when an anomaly is detected
- **Security at all Layers** – Apply security at multiple layers, like VPC, Load Balancers, Security Groups, EC2 instances, etc.
- **Automate Security Best Practices** – Implement security as code and version control all security measures for future use
- **Protect Data in Transit and at Rest** – Data should be protected using encryption, authorization tokens and Access Control Mechanisms
- **Keep people away from data** – As far as possible, data should be kept away from handling by many people by implementing proper policies and access control
- **Prepare for security events**

**Best Practices**
Before you architect any workload, you need to put in place practices that influence security. You’ll want to control who can do what. In addition, you want to be able to identify security incidents, protect your systems and services, and maintain the confidentiality and integrity of data through data protection.

You should have a well-defined and practiced process for responding to security incidents. These tools and techniques are important because they support objectives such as preventing financial loss or complying with regulatory obligations.

The AWS Shared Responsibility Model enables organizations that adopt the cloud to achieve their security and compliance goals. Because AWS physically secures the infrastructure that supports our cloud services, as an AWS customer you can focus on using services to accomplish your goals. The AWS Cloud also provides greater access to security data and an automated approach to responding to security events.

# 3. Reliability
The Reliability pillar encompasses the ability of a workload to perform its intended function correctly and consistently when it’s expected to. This includes the ability to operate and test the workload through its total lifecycle. You can find prescriptive guidance on implementation in the Reliability Pillar whitepaper.

**Design Principles**
There are five design principles for reliability in the cloud:

- **Test Recovery Procedures** – Inject or simulate failures to your system and test how it recovers from the failure
- **Automatically Recover from Failure** – Ensure that recoveries from failures are always automated, monitor metrics on CloudWatch, and take proper actions whenever any thresholds are reached. Automated notifications to humans should also be set up as a best practice
- **Scale horizontally** – Avoid using monolithic architectures and use smaller resources to keeps multiple systems isolated from one another
- **Stop guessing capacity** – Since the cloud allows dynamic capacity management, you should never guess your capacity beforehand. Let the system automatically scale up and down based on the demand

**Best Practices**
To achieve reliability, you must start with the foundations—an environment where service quotas and network topology accommodate the workload. The workload architecture of the distributed system must be designed to prevent and mitigate failures. The workload must handle changes in demand or requirements, and it must be designed to detect failure and automatically heal itself.

Before architecting any system, foundational requirements that influence reliability should be in place. For example, you must have sufficient network bandwidth to your data center. These requirements are sometimes neglected (because they are beyond a single project’s scope).

This neglect can have a significant impact on the ability to deliver a reliable system. In an on-premises environment, these requirements can cause long lead times due to dependencies and therefore must be incorporated during initial planning.

With AWS, most of these foundational requirements are already incorporated or may be addressed as needed. The cloud is designed to be essentially limitless, so it is the responsibility of AWS to satisfy the requirement for sufficient networking and compute capacity, while you are free to change resource size and allocation, such as the size of storage devices, on demand.

# 4. Performance Efficiency
The Performance Efficiency pillar includes the ability to use computing resources efficiently to meet system requirements, and to maintain that efficiency as demand changes and technologies evolve. You can find prescriptive guidance on implementation in the Performance Efficiency Pillar whitepaper.

**Design Principles**
There are five design principles for performance efficiency in the cloud:

- **Consume advanced technologies as a service** – Use more managed services as they reduce efforts on provisioning, configuring, scaling, backing up, etc.
- **Go global in minutes** – Since AWS is globally deployed across multiple regions, you can leverage this and deploy your application to multiple regions to help lower the latency of your application
- **Use serverless architectures** – Using serverless architectures helps you to run your code directly without managing any other services. For example, use S3 to host a static website instead of running it on an EC2 instance
- **Experiment more often** – Experimenting your solution across several metrics helps you identify performance bottlenecks and take appropriate actions
- **Consider mechanical sympathy**


**Best Practices**
Take a data-driven approach to building a high-performance architecture. Gather data on all aspects of the architecture, from the high-level design to the selection and configuration of resource types.

Reviewing your choices on a regular basis ensures you are taking advantage of the continually evolving AWS Cloud. Monitoring ensures you are aware of any deviance from expected performance. Make trade-offs in your architecture to improve performance, such as using compression or caching, or relaxing consistency requirements

The optimal solution for a particular workload varies, and solutions often combine multiple approaches. Well-Architected workloads use multiple solutions and enable different features to improve performance

# 5. Cost Optimization
The Cost Optimization pillar includes the ability to run systems to deliver business value at the lowest price point. You can find prescriptive guidance on implementation in the Cost Optimization Pillar whitepaper.

**Design Principles**
There are five design principles for cost optimization in the cloud:

- **Adopt a consumption model** – Pay only for those resources which are actually in use and scale your resources up or down as per the demand. No need to pay static payment charges as per the demand forecasted
- **Measure overall efficiency** – Keep measuring your costs over a time period to understand and keep track of the trends. Optimize wherever and whenever possible
- **Avoid spending money on operations** – Leave all your operational expenditure on AWS and focus on your customers and business logic
- **Analyze and attribute expenditure** – Attribute your own resources, analyze and monitor the expenditure for each individual department or team. Implement resource tagging and resource groups to analyze expenditure more efficiently
- **Use managed and app-level services to reduce TCO** – Using managed apps helps to save overall costs of maintaining the services

**Best Practices**
As with the other pillars, there are trade-offs to consider. For example, do you want to optimize for speed to market or for cost? In some cases, it’s best to optimize for speed—going to market quickly, shipping new features, or simply meeting a deadline—rather than investing in up-front cost optimization.

Design decisions are sometimes directed by haste rather than data, and as the temptation always exists to overcompensate rather than spend time benchmarking for the most cost-optimal deployment. This might lead to over-provisioned and under-optimized deployments.

Using the appropriate services, resources, and configurations for your workloads is key to cost savings



# References:
https://www.wellarchitectedlabs.com/
