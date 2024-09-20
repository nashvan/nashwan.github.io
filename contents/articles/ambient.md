# Istio Ambient Mode
Istio ambient mode is an alternative deployment architecture within Istio that eliminates the need for sidecar proxies. Instead of injecting sidecar proxies into each application pod to manage network traffic, ambient mode uses a “split proxy” model. Traffic is handled by dedicated Layer 4 (Ztunnel) and Layer 7 (Waypoints) proxies that are deployed outside of the application pods. This decoupling of proxies from the application reduces resource consumption, simplifies deployment, and improves operational efficiency by eliminating the need to inject, maintain, and troubleshoot sidecars.

However, ambient mode comes with tradeoffs. One of the key tradeoffs is granularity and flexibility. In traditional sidecar-based Istio, sidecars can be fine-tuned at a per-pod level, offering high control over traffic management and security policies. ambient mode, while reducing overhead, moves traffic management to the infrastructure layer, which may limit the fine-grained control that sidecar proxies provide. Another tradeoff is feature maturity. Ambient mode is a newer architecture, so some features that are fully developed and battle-tested in the sidecar model may still be evolving or less mature in ambient mode.

Overall, Istio ambient mode is beneficial for reducing resource overhead, simplifying management, and scaling service meshes more efficiently. However, the tradeoff comes in the form of potentially reduced fine-grained control and the need to work within a newer, evolving architecture.

Istio's Ambient Mode reduces cloud costs by simplifying the architecture and removing some of the resource-heavy components typically associated with Istio's standard sidecar-based service mesh. Here's how Ambient Mode achieves cloud cost reduction:

### How Does Ambient Mesh Work?
- A shared agent (ztunnel) is present on each node in the Kubernetes cluster, responsible for secure connections within the mesh.

<img width="50%" align="centre" alt="Github" src="./contents/articles/images/ambient-2.gif" />

- Ztunnel processes only L4 traffic, separating Istio’s data plane from application concerns.
- A zero-trust overlay (with mTLS, telemetry, authentication, and L4 authorization) is established when the ambient mode is activated for a namespace.
- For L7 features, a namespace can deploy one or more Envoy-based waypoint proxies. These proxies can be auto-scaled according to real-time traffic demand.

<img width="50%" align="centre" alt="Github" src="./contents/articles/images/ambient-2.gif" />

### Security Considerations
Ambient Mesh prioritizes security:

- Ztunnel: Although a shared resource, the ztunnel limits its keys to workloads on its node, keeping a low-risk profile.
- Waypoint Proxies: These shared resources are confined to one service account, reducing potential damage from a compromised proxy.
- Envoy’s Role: With its robust, battle-tested nature, Envoy is considered more secure than many applications it pairs with.

### Performance and Resource Implications
- Resource Efficiency: Ambient Mesh’s ztunnel reduces the per-workload reservations. Dynamic scaling of waypoint proxies also ensures resource optimization.
- Latency Concerns: While there’s a perception that waypoint proxies might introduce latency, Istio believes this is balanced out by reduced L7 processing compared to the traditional sidecar model.

### How Does Istio Ambient Mode Reduce Cloud Cost

Istio Ambient Mode reduces cloud costs in several ways, specifically by eliminating the need for sidecar proxies in its architecture. When it comes to processing logs, particularly sidecar logs being sent to services like AWS CloudWatch, the impact can be significant. Here's how it works and why it matters:

#### 1. **Eliminating Sidecar Proxies**
   - **Traditional Istio with Sidecar Proxies**: In traditional Istio, each pod has its own sidecar proxy (typically Envoy) attached to it. These proxies handle networking tasks such as traffic routing, security, and observability for each service. This means each sidecar generates logs for network traffic, security policies, and more, all of which need to be processed and potentially sent to an external logging service like CloudWatch.
   - **Impact on Costs**: Processing these logs increases cloud costs due to:
     - **Increased CPU/Memory Usage**: The sidecars consume compute resources, driving up the cost of running your Kubernetes clusters.
     - **High Volume of Logs**: Each sidecar generates a significant volume of logs, which can lead to higher costs for storage and log ingestion in services like AWS CloudWatch.
     - **Log Shipping**: Moving these logs from the sidecars to cloud logging services involves network bandwidth and additional resources for log agents like Fluentd or Fluent Bit.

   - **Ambient Mode without Sidecar Proxies**: In Istio Ambient Mode, the sidecars are removed entirely. Instead of each pod having its own proxy, the traffic management and security functions are handled at the node or network level (using a combination of node-level proxies and a Ztunnel component for security). This means there are no sidecar logs to process and send to CloudWatch, reducing both resource usage and log volume.

#### 2. **Reduced Log Volume**
   - **Traditional Mode**: In a large mesh with many services, the logs from all these sidecar proxies can add up quickly. Each log contains information about every request, response, security policy, and more. Processing this data, especially for high-traffic environments, can be expensive.
   - **Ambient Mode**: Since there are no sidecar proxies, there's a significant reduction in the number of logs being generated. The traffic logging now happens at a higher level (i.e., in the ztunnel or node proxy), and there are fewer components generating logs.

#### 3. **Lower Compute Costs**
   - **Traditional Mode**: Each sidecar proxy consumes compute and memory resources in every pod. These resources scale with the number of services in your mesh, increasing overall compute costs in cloud environments like AWS.
   - **Ambient Mode**: By eliminating sidecar proxies, you reduce the overhead on each pod, lowering the overall compute and memory requirements in your cluster. This, in turn, reduces the cost of running your workloads on cloud infrastructure.

#### 4. **Reduced Log Processing Overhead**
   - **Log Shipping Agents**: In traditional Istio, log shipping agents (e.g., Fluent Bit, Fluentd) have to collect logs from every sidecar. This adds to the CPU and memory overhead on nodes, as the agents process, filter, and send these logs to services like CloudWatch.
   - **Ambient Mode**: With no sidecars, there is less log data to process, reducing the resource demand on log shipping agents and further lowering costs.

#### 5. **Smaller CloudWatch Bills**
   - **Log Ingestion Costs**: CloudWatch charges based on the volume of logs ingested and the storage of these logs. With fewer logs being generated (due to the absence of sidecar proxies), there is less data to ingest, store, and process. This leads to a direct reduction in CloudWatch costs.
   - **Long-term Storage**: Logs often need to be stored for auditing or compliance purposes. Fewer logs mean smaller storage requirements, reducing long-term storage costs in services like CloudWatch Logs or S3.

#### Summary of Cost Reduction Benefits
- **Lower CPU and Memory Usage**: By removing sidecars, Ambient Mode significantly reduces the compute resources required per pod, which leads to lower cloud infrastructure costs.
- **Reduced Log Volume**: Without sidecars, there are fewer logs to process and store, directly reducing costs for logging services like CloudWatch.
- **Simplified Log Management**: Since there are fewer components generating logs, the complexity and overhead associated with log management are reduced.
- **Lower Network Traffic for Logs**: Fewer logs mean less network bandwidth is consumed when shipping logs to external services.

In essence, **Istio Ambient Mode** optimizes performance and costs by reducing the overhead and log volume generated by sidecar proxies, leading to lower cloud costs, especially when logging to services like AWS CloudWatch.

