// Module 7: Developing Event-Driven Serverless Solutions (AWS Lambda)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm7',
  num: 7,
  title: 'Event-Driven Serverless Solutions (Lambda)',
  scope: 'Slides 7–65',
  short: 'AWS Lambda',
  icon: 'λ',
  study: `
<h3>1. Serverless computing</h3>
<table>
<tr><th>Model</th><th>Characteristics</th></tr>
<tr><td>On premises</td><td>Heavy capital expense, guessed capacity, deployed in months, years of maintenance, low innovation</td></tr>
<tr><td>Virtual servers in the cloud</td><td>Hardware independence, elastic resources and scale, faster provisioning, reduced maintenance</td></tr>
<tr><td>Containers</td><td>Platform independence, higher resource utilization, easier/faster deployments, isolation and sandboxing</td></tr>
<tr><td><b>Serverless</b></td><td><b>No OS instances to manage, flexible scaling, pay per usage, built-in fault tolerance, zero maintenance</b></td></tr>
</table>
<ul>
  <li>Higher abstraction → <b>focus on business logic</b>.</li>
  <li>Modern serverless apps: <b>small pieces, loosely joined</b> – serverless compute & event-driven patterns, purpose-built data stores, managed integration services, automation with code (deployment frameworks).</li>
  <li><b>Monolith</b> does everything; a <b>microservice</b> does one thing.</li>
</ul>

<h3>2. AWS Lambda</h3>
<ul>
  <li>Serverless compute: <b>run code without provisioning or managing servers</b>; invokes code <b>in response to events</b>; <b>scales automatically</b>; built-in monitoring/logging with <b>CloudWatch</b>.</li>
  <li>How it works: upload code (or write in the Lambda editor) → set it to run on events (AWS services, HTTP endpoints, in-app activity) → runs only when triggered → <b>pay only for compute time used</b>.</li>
  <li>Features: bring your own code, flexible permissions, integrates with AWS services, built-in availability & fault tolerance, flexible resource & concurrency models, no paying for idle.</li>
  <li>Use cases: <b>web app</b> (S3 front end → API Gateway → Lambda → DynamoDB), <b>real-time stream processing</b> (Kinesis → Lambda → DynamoDB hashtag trends).</li>
  <li>A function = access permissions + initiating events + runtime & deployment package (code, dependencies) + configuration.</li>
  <li>Runs in <b>on-demand, ephemeral environments</b>. <b>Concurrency</b> = number of invocations running at one time. Factors: reserved concurrency (per function), Regional quota (soft), burst quota (can't modify).</li>
</ul>

<h3>3. Invocation models</h3>
<table>
<tr><th>Model</th><th>Details</th><th>Examples</th></tr>
<tr><td><b>Synchronous</b> (push)</td><td>Caller <b>waits for the response</b>. <b>No built-in retry</b> – handle in app. CLI returns StatusCode <b>200</b>.</td><td>API Gateway, ELB, Cognito, Lex, Alexa, CloudFront, Kinesis Data Firehose</td></tr>
<tr><td><b>Asynchronous</b> (push)</td><td>Lambda <b>queues the event</b>; caller gets success right away ("send and forget"). <b>Retries twice</b> automatically; failed events → DLQ/destination. <code>--invocation-type Event</code> → StatusCode <b>202</b>.</td><td>Amazon S3, SNS, SES, CloudWatch Logs/Events, AWS Config</td></tr>
<tr><td><b>Polling</b> (pull / event source mapping)</td><td>Lambda <b>polls</b> a stream or queue and invokes the function with <b>batches</b> of records.</td><td>Streams: DynamoDB Streams, Kinesis Data Streams. Queue: Amazon SQS</td></tr>
</table>
<ul><li>Stream failure: Lambda won't read new records in that shard until the failed batch expires or succeeds. SQS failure: message returns to the queue and is retried until success, retry limit or retention period.</li></ul>

<h3>4. Permissions</h3>
<table>
<tr><th>Invocation permission</th><th>Execution role</th></tr>
<tr><td><b>Resource-based (function) policy</b>: lets an event source (e.g. S3, SNS) perform <code>lambda:InvokeFunction</code>. Used for <b>synchronous/asynchronous</b> event sources. Add with <code>aws lambda add-permission</code>.</td><td>IAM role specifying <b>what the function may do</b> (e.g. write logs, write to DynamoDB). Has an <b>IAM policy</b> (allowed actions) + a <b>trust policy</b> (lets <code>lambda.amazonaws.com</code> <code>sts:AssumeRole</code>). Needed for <b>polling</b> sources to read the queue/stream. Requires <code>iam:PassRole</code>.</td></tr>
</table>

<h3>5. Authoring & configuring</h3>
<ul>
  <li><b>Handler (event, context)</b> = entry point. <b>Event object</b>: event data (predefined formats for AWS sources, or custom test objects). <b>Context object</b>: runtime info – <code>awsRequestId</code>, <code>getRemainingTimeInMillis()</code>, <code>logStreamName</code>.</li>
  <li>Test from the console: create a test event, review results.</li>
</ul>
<table>
<tr><th>Configuration</th><th>Key facts</th></tr>
<tr><td>Memory</td><td><b>128 MB – 10,240 MB</b>; CPU allocated <b>proportionally (linearly)</b> to memory</td></tr>
<tr><td>Timeout</td><td><b>1 second – 15 minutes</b></td></tr>
<tr><td>Concurrency</td><td>Default <b>1,000 concurrent invocations per Region</b> per account (soft limit); per-function reserved limit</td></tr>
<tr><td>Provisioned concurrency</td><td>Number of environments kept <b>warm</b> → avoids cold-start latency</td></tr>
<tr><td>Monitoring</td><td>X-Ray active tracing, CloudWatch Lambda Insights</td></tr>
<tr><td>Triggers / Permissions</td><td>Event sources / who can invoke & what the function can do</td></tr>
<tr><td>Destinations</td><td>SNS, SQS, Lambda or EventBridge for <b>on success / on failure</b> records</td></tr>
<tr><td>Asynchronous invocation</td><td>Retry attempts <b>0–2</b>, max event age <b>up to 6 hours</b>, dead-letter queue</td></tr>
<tr><td>VPC</td><td>Access resources in a custom VPC (DBs, caches, internal services)</td></tr>
<tr><td>State machines / DB proxies / File systems</td><td>Step Functions; RDS proxy for connection pooling; Amazon EFS</td></tr>
<tr><td>Runtime / Env variables / Tags / Code signing</td><td>Language or custom runtime; key-value config without code changes; key + optional value labels for search & cost; ensure code signed & unaltered</td></tr>
</table>
<h4>Best practices</h4>
<ul>
  <li>Environment: treat functions as <b>stateless</b>, include only what you need, <b>reuse the temporary runtime environment</b>.</li>
  <li>Code: separate business logic from the handler, modular functions, logging, include results info, use environment variables, <b>avoid recursive code</b>, <b>don't call one function from another</b>.</li>
  <li>Tuning: more memory = higher cost per ms but can reduce duration and concurrency – find the balance (AWS Lambda Power Tuning).</li>
</ul>

<h3>6. Deploying</h3>
<table>
<tr><th>.zip archive</th><th>Container image</th></tr>
<tr><td>Choose runtime at creation; zip code + dependencies and upload (console editor, from IDE, or via S3). Limits: <b>50 MB zipped</b> direct upload, <b>250 MB unzipped</b> incl. layers, <b>3 MB</b> console editor.</td><td>Choose runtime and Linux distribution; package code & dependencies as an image; push to <b>Amazon ECR</b>; Lambda pulls and optimizes it.</td></tr>
</table>
<ul>
  <li><b>Versions</b>: <b>immutable</b> snapshots of code + config. Edit <b>$LATEST</b>; <b>Publish</b> creates version 1, 2, … each with its own ARN (<code>function:helloworld:1</code>).</li>
  <li><b>Aliases</b>: <b>mutable pointers</b> to versions with their own ARN (<code>function:helloworld:test</code>). Point S3 notifications at the PROD alias so you only move the alias on new releases.</li>
  <li><b>Custom runtimes</b>: use other languages; Lambda runtime interface; <b>bootstrap</b> file is the entry point; deploy with the function or in a layer.</li>
  <li><b>Layers</b>: share code/data across functions, smaller packages, faster deploys. Limits: <b>up to 5 layers</b>, <b>250 MB</b>.</li>
</ul>

<h3>7. Monitoring and debugging</h3>
<ul>
  <li>Modern app challenges: short-lived resources, more devices/services/data, faster release velocity, user experience.</li>
  <li><b>Amazon CloudWatch</b>: logs, metrics, events; unified view; <b>Logs Insights</b> for interactive queries; alarms that trigger actions.</li>
  <li>Lambda log group: <code>/aws/lambda/&lt;function name&gt;</code> (one per function); log streams; each request has a <b>RequestID</b> and START, END, <b>REPORT</b> (duration, billed duration, memory) events.</li>
  <li><b>AWS X-Ray</b>: traces requests through the app and shows a <b>service map</b>; one-click enable for Lambda; X-Ray SDK; latency distribution; filter by error type.</li>
</ul>
<table>
<tr><th>X-Ray element</th><th>Meaning</th></tr>
<tr><td>Segments</td><td>Work done by compute resources (resource name, request details)</td></tr>
<tr><td>Subsegments</td><td>More granular timing and downstream call details</td></tr>
<tr><td>Annotations</td><td>Key-value pairs that are <b>indexed</b> → use with filter expressions</td></tr>
<tr><td>Metadata</td><td>Key-value pairs of any type, <b>not indexed</b>, not used for searching</td></tr>
</table>
<div class="tip"><b>Exam tip:</b> 15 min max timeout, 10,240 MB max memory, 1,000 default concurrency, async = 2 retries, 5 layers. Versions immutable, aliases mutable.</div>
`,
  questions: [
    { t: 'match', i: 1, c: 'Deployment models', q: 'Match each deployment model with its characteristic.', p: [['On premises', 'Heavy capital expense and guessed capacity'], ['Virtual servers in the cloud', 'Hardware independence and faster provisioning'], ['Containers', 'Platform independence and isolation/sandboxing'], ['Serverless', 'No OS instances to manage and pay per usage']], e: 'Levels of abstraction.' },
    { t: 'mcq', i: 1, c: 'Serverless', q: 'Which is a characteristic of serverless computing?', o: ['No OS instances to manage and built-in fault tolerance', 'Guessed capacity and years of maintenance', 'Heavy capital expense', 'You must patch the operating system'], e: 'Serverless: no OS, flexible scaling, pay per usage, fault tolerance, zero maintenance.' },
    { t: 'tf', c: 'Serverless', q: 'A higher level of abstraction lets developers focus more on business logic.', a: true, e: 'Serverless = focus on business logic.' },

    { t: 'mcq', i: 1, c: 'Lambda', q: 'What is AWS Lambda?', o: ['A serverless compute service that runs code without provisioning or managing servers', 'A managed container registry', 'A relational database', 'A CDN'], e: 'Lambda runs code in response to events and scales automatically.' },
    { t: 'tf', i: 1, c: 'Lambda', q: 'With Lambda, you pay only for the compute time you use.', a: true, e: 'You don\'t pay for idle resources.' },
    { t: 'mcq', i: 1, c: 'Concurrency', q: 'In Lambda, what is concurrency?', o: ['The number of function invocations running at one time', 'The memory size of a function', 'The number of versions published', 'The number of layers attached'], e: 'Concurrency = simultaneous invocations.' },

    { t: 'match', i: 1, c: 'Invocation models', q: 'Match each invocation model to its behavior.', p: [['Synchronous', 'Caller waits for the function response'], ['Asynchronous', 'Lambda queues the event and the caller moves on'], ['Polling (event source mapping)', 'Lambda reads batches from a stream or queue']], e: 'Three invocation models.' },
    { t: 'dnd', i: 1, c: 'Invocation models', q: 'Drag each event source to its invocation model.', p: [['Amazon API Gateway', 'Synchronous'], ['Amazon S3', 'Asynchronous'], ['Amazon SNS', 'Asynchronous'], ['Amazon SQS', 'Polling'], ['DynamoDB Streams', 'Polling']], e: 'API Gateway sync; S3/SNS async; SQS/Kinesis/DynamoDB Streams poll.' },
    { t: 'mcq', i: 1, c: 'Invocation models', q: 'How many times does Lambda automatically retry a failed asynchronous invocation by default?', o: ['2', '0', '5', 'Unlimited'], e: 'Async invocations are retried twice; failed events can go to a DLQ.' },
    { t: 'tf', i: 1, c: 'Invocation models', q: 'Synchronous invocations have built-in retries handled by Lambda.', a: false, e: 'There is no built-in retry for sync; manage retries in your app.' },
    { t: 'mcq', c: 'Invocation models', q: 'Which are stream-based polling sources?', o: ['DynamoDB Streams and Kinesis Data Streams', 'Amazon S3 and SNS', 'API Gateway and ELB', 'CloudFront and Cognito'], e: 'Streams: DynamoDB Streams and Kinesis. Queue: SQS.' },
    { t: 'tf', c: 'Invocation models', q: 'When an SQS-triggered invocation fails, the message returns to the queue and is retried.', a: true, e: 'Retried until success, retry limit or retention period.' },
    { t: 'tf', c: 'Invocation models', q: 'In the polling model, the event source pushes events to Lambda and waits for a response.', a: false, e: 'In the polling model, Lambda polls the stream or queue itself.' },

    { t: 'match', i: 1, c: 'Permissions', q: 'Match each Lambda permission type with what it controls.', p: [['Resource-based (function) policy', 'Which event sources may invoke the function'], ['Execution role', 'What the function may do with other AWS services'], ['Trust policy', 'Lets the Lambda service assume the execution role']], e: 'Invocation permissions vs execution role.' },
    { t: 'mcq', i: 1, c: 'Permissions', q: 'A Lambda function must write items to DynamoDB. Where do you grant that permission?', o: ['In the function\'s execution role', 'In the function\'s resource-based policy', 'In the S3 bucket policy', 'In the API Gateway stage'], e: 'The execution role defines what the function may do.' },
    { t: 'tf', c: 'Permissions', q: 'Polling event sources need the execution role to give the function permission to read from the queue or stream.', a: true, e: 'For polling, Lambda reads using the execution role.' },

    { t: 'mcq', i: 1, c: 'Handler', q: 'What is the entry point of a Lambda function?', o: ['The handler method (event, context)', 'The bootstrap of every runtime', 'The alias', 'The layer'], e: 'The function handler is the entry point.' },
    { t: 'match', i: 1, c: 'Handler', q: 'Match each handler object with what it passes.', p: [['Event object', 'Event data that triggered the function'], ['Context object', 'Runtime information such as awsRequestId']], e: 'Event vs context.' },

    { t: 'match', i: 1, c: 'Configuration limits', q: 'Match each Lambda setting with its range or default.', p: [['Memory', '128 MB to 10,240 MB'], ['Timeout', '1 second to 15 minutes'], ['Default concurrency per Region', '1,000 (soft limit)'], ['Async retry attempts', '0 to 2']], e: 'Key configuration numbers.' },
    { t: 'mcq', i: 1, c: 'Configuration limits', q: 'What is the maximum timeout for a Lambda function?', o: ['15 minutes', '5 minutes', '1 hour', '24 hours'], e: 'Timeout: 1 second up to 15 minutes.' },
    { t: 'tf', i: 1, c: 'Configuration limits', q: 'Lambda allocates CPU power linearly in proportion to the memory you configure.', a: true, e: 'More memory = more CPU.' },
    { t: 'mcq', i: 1, c: 'Configuration', q: 'Which setting keeps Lambda environments warm to reduce startup latency?', o: ['Provisioned concurrency', 'Reserved concurrency', 'Timeout', 'Environment variables'], e: 'Provisioned concurrency = environments kept warm.' },
    { t: 'match', i: 1, c: 'Configuration', q: 'Match each configuration with its description.', p: [['Destinations', 'Receive records on success or failure (SNS, SQS, Lambda, EventBridge)'], ['Environment variables', 'Key-value settings available to code without changing it'], ['Code signing', 'Ensure code is signed by an approved source and unaltered'], ['Database proxies', 'Connection pooling for Amazon RDS'], ['File systems', 'Connect Amazon EFS at runtime']], e: 'Resource and code configurations.' },
    { t: 'mcq', c: 'Configuration', q: 'How long can an asynchronous event wait to be invoked at most?', o: ['Up to 6 hours', 'Up to 15 minutes', 'Up to 24 hours', 'Up to 35 days'], e: 'Max event age up to 6 hours.' },
    { t: 'tf', c: 'Configuration', q: 'You can configure a Lambda function to access resources in a custom VPC.', a: true, e: 'VPC configuration.' },

    { t: 'mcq', i: 1, c: 'Best practices', q: 'Which is a Lambda best practice?', o: ['Treat functions as stateless', 'Call one Lambda function from another', 'Use recursive code', 'Put all business logic inside the handler'], e: 'Stateless, include only what you need, reuse the environment, separate logic from handler.' },
    { t: 'tf', c: 'Best practices', q: 'You should avoid recursive code and avoid calling one Lambda function from another.', a: true, e: 'Best practices for writing code.' },
    { t: 'tf', c: 'Best practices', q: 'Lambda functions should store state in memory between invocations because each environment lives forever.', a: false, e: 'Treat functions as stateless; environments are ephemeral.' },
    { t: 'tf', c: 'Tuning', q: 'Higher memory always increases the total cost of a Lambda function.', a: false, e: 'Higher memory costs more per ms but may decrease duration, making CPU-intensive functions cheaper and faster.' },

    { t: 'match', i: 1, c: 'Deployment', q: 'Match each deployment option with its description.', p: [['.zip archive', 'Compress code and dependencies and upload them'], ['Container image', 'Package code as an image and push it to Amazon ECR']], e: 'Two deployment package types.' },
    { t: 'mcq', c: 'Deployment', q: 'Where must a container image be stored for Lambda to use it?', o: ['Amazon ECR', 'Amazon S3 Glacier', 'Docker Hub only', 'AWS CodeCommit'], e: 'Push the image to Amazon ECR.' },
    { t: 'match', i: 1, c: 'Versions & aliases', q: 'Match each term with its description.', p: [['Version', 'Immutable snapshot of code and configuration'], ['$LATEST', 'The editable, unpublished version'], ['Alias', 'Mutable pointer to a version']], e: 'Versions are immutable; aliases are mutable pointers.' },
    { t: 'tf', i: 1, c: 'Versions & aliases', q: 'You can edit the code of a published Lambda version such as version 1.', a: false, e: 'Published versions are immutable; you edit $LATEST and publish a new version.' },
    { t: 'tf', i: 1, c: 'Versions & aliases', q: 'An alias always points to $LATEST and cannot be changed.', a: false, e: 'Aliases are mutable pointers to any version.' },
    { t: 'mcq', i: 1, c: 'Versions & aliases', q: 'S3 invokes your function. How do you avoid updating the S3 notification each time you publish a new version?', o: ['Point the notification at an alias (e.g. PROD) and move the alias', 'Always use version 1', 'Delete old versions', 'Use a layer'], e: 'Use an alias ARN and update the alias.' },
    { t: 'mcq', i: 1, c: 'Custom runtimes', q: 'What is the entry point of a Lambda custom runtime?', o: ['The bootstrap file', 'The handler alias', 'The layer ARN', 'The Dockerfile'], e: 'The bootstrap file is the runtime\'s entry point.' },
    { t: 'match', i: 1, c: 'Layers', q: 'Match each Lambda layer fact.', p: [['Maximum layers per function', '5'], ['Total unzipped size limit', '250 MB'], ['Main benefit', 'Share code and data across functions']], e: 'Layers: up to 5, 250 MB.' },
    { t: 'tf', c: 'Layers', q: 'A Lambda function can use up to 10 layers.', a: false, e: 'The limit is up to five layers (250 MB).' },

    { t: 'mcq', i: 1, c: 'CloudWatch', q: 'Where does Lambda write its logs?', o: ['A CloudWatch log group named /aws/lambda/<function name>', 'An S3 bucket named after the function', 'AWS CloudTrail only', 'The X-Ray console only'], e: 'One log group per function.' },
    { t: 'mcq', i: 1, c: 'X-Ray', q: 'Which service traces requests through your application and shows a map of its components?', o: ['AWS X-Ray', 'Amazon CloudWatch Logs', 'AWS Config', 'Amazon ECR'], e: 'X-Ray traces requests and builds a service map.' },
    { t: 'match', i: 1, c: 'X-Ray', q: 'Match each X-Ray trace element with its description.', p: [['Segment', 'Work done by a compute resource'], ['Subsegment', 'More granular timing and downstream calls'], ['Annotation', 'Indexed key-value pairs used in filter expressions'], ['Metadata', 'Non-indexed key-value data not used for searching']], e: 'Parts of an X-Ray trace.' },
    { t: 'tf', c: 'X-Ray', q: 'X-Ray metadata is indexed so you can filter traces by it.', a: false, e: 'Annotations are indexed; metadata is not.' },
    { t: 'mcq', i: 1, c: 'Configuration limits', q: 'A data-processing job takes about 40 minutes to run. Is Lambda a good fit as-is?', o: ['No, because the maximum Lambda timeout is 15 minutes', 'Yes, Lambda can run for up to 24 hours', 'Yes, if you add more layers', 'Yes, if you enable provisioned concurrency'], e: 'Lambda functions can run for at most 15 minutes.' },
    { t: 'mcq', i: 1, c: 'Configuration', q: 'A Lambda function needs a database endpoint that differs between dev and prod without changing code. What should you use?', o: ['Environment variables', 'Layers', 'A larger memory setting', 'Code signing'], e: 'Environment variables store configuration without code changes.' },
    { t: 'mcq', i: 1, c: 'X-Ray', q: 'Users report that an API backed by Lambda is slow, and you need to find which downstream call causes the latency. Which tool helps most?', o: ['AWS X-Ray', 'AWS Config', 'Amazon ECR', 'IAM Access Analyzer'], e: 'X-Ray traces requests end to end and shows latency per segment.' },
    { t: 'order', i: 1, c: 'Deployment models', q: 'Order the deployment models from least to most abstraction.', s: ['On premises', 'Virtual servers in the cloud', 'Containers', 'Serverless'], e: 'Higher abstraction lets you focus on business logic.' },
    { t: 'dnd', i: 1, c: 'Permissions', q: 'Drag each permission to where it is defined.', p: [['S3 is allowed to invoke the function', 'Resource-based (function) policy'], ['SNS is allowed to invoke the function', 'Resource-based (function) policy'], ['Function can write to DynamoDB', 'Execution role'], ['Function can write logs to CloudWatch', 'Execution role']], e: 'Who can invoke = function policy. What the function can do = execution role.' }
  ]
});
