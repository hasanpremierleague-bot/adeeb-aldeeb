// Module 6: Developing REST APIs (Amazon API Gateway)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm6',
  num: 6,
  title: 'Developing REST APIs (API Gateway)',
  short: 'API Gateway',
  icon: '🚪',
  study: `
<h3>1. APIs and REST</h3>
<ul>
  <li>An <b>API</b> simplifies development by <b>abstracting implementation details</b>, <b>exposing only the objects/actions a developer needs</b>, and <b>establishing how provider and user communicate</b>.</li>
  <li>Typical app: Client → API → Web server → Database. Requests use a standard protocol (SOAP, WebSockets, HTTP, HTTPS); responses include <b>data and status codes</b> (e.g. GET /products → 200).</li>
  <li><b>REST</b> = Representational State Transfer, an <b>architectural style</b> / standard way to structure requests. A <b>RESTful API</b> adheres to REST principles.</li>
</ul>

<h3>2. API Gateway overview</h3>
<ul>
  <li>An <b>API gateway is a proxy</b> between client and server. It can: discard invalid requests, route geo-specific requests (US/EU DB), <b>limit the request rate</b>, allow/disallow by source, <b>validate the developer key</b>, abstract common functionality, reduce requests reaching the server.</li>
  <li><b>Amazon API Gateway</b>: fully managed, serverless service to <b>create, publish, maintain, monitor and secure APIs at any scale</b>; "front door" to backends. Pay for API calls received + data transferred out.</li>
  <li>Backends: Lambda, EC2 public endpoints, VPC endpoints, any AWS service, on-premises via Direct Connect, any public HTTP endpoint. Includes API Gateway cache and CloudWatch.</li>
</ul>
<table>
<tr><th>RESTful (REST & HTTP APIs)</th><th>WebSocket APIs</th></tr>
<tr><td>Request/response, HTTP methods (GET, POST), <b>short-lived, stateless</b></td><td><b>Two-way (bidirectional)</b> channel, <b>long-lived, stateful</b>; real-time; more efficient for <b>chatty</b> apps (no envelope bloat per message)</td></tr>
</table>
<table>
<tr><th>REST API</th><th>HTTP API</th></tr>
<tr><td><b>Full control</b> over requests and responses; supports features not yet in HTTP APIs (edge-optimized & private endpoints, caching, usage plans, resource policies, client SDK generation, mock integrations, WAF).</td><td>Only API <b>proxy</b> functionality; designed for <b>lowest cost and lowest latency</b>.</td></tr>
</table>
<ul>
  <li><b>Develop</b> with: Console, AWS CLI, <b>OpenAPI (Swagger)</b>. <b>Deploy</b> with: <b>AWS SAM, CloudFormation, AWS CDK</b>.</li>
</ul>

<h3>3. Creating an API</h3>
<ul>
  <li>Create via AWS CLI, console, or <b>import an OpenAPI/Swagger definition</b> (JSON or YAML; can export too).</li>
  <li>Base URL: <code>https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/</code></li>
  <li><b>Routes</b> = method + path: <code>GET /products</code>, <code>GET /products/{product_id}</code>, <code>PUT /products/34</code>.</li>
  <li><b>Greedy path variable</b> <code>{proxy+}</code> catches all sub-paths (e.g. <code>GET /products/{proxy+}</code>).</li>
  <li>Best practice: use <b>different paths for different actions</b> connected to different backend integrations.</li>
</ul>

<h3>4. Integrating</h3>
<table>
<tr><th>Endpoint type</th><th>Details</th></tr>
<tr><td><b>Edge-optimized</b> (REST only)</td><td>Uses an API Gateway-managed <b>CloudFront distribution</b>; for <b>globally distributed clients</b>; built-in DDoS protection.</td></tr>
<tr><td><b>Regional</b> (REST, HTTP, WebSocket)</td><td>For clients in the <b>same Region</b>; recommended for general use; best practice to put your own CloudFront in front.</td></tr>
<tr><td><b>Private</b> (REST only)</td><td>Accessible <b>only from within your VPC</b> via a VPC interface endpoint.</td></tr>
</table>
<ul>
  <li><b>Client-side SDKs</b>: API Gateway can generate SDKs (Android, iOS, JavaScript, Ruby, Java) – <b>only for REST APIs</b>.</li>
  <li>Integration flow: <b>Method request</b> (modeling, validation, transformation) → <b>Integration request</b> → backend → <b>Integration response</b> (transformation, custom errors) → <b>Method response</b>.</li>
  <li><b>Mock</b> integration (REST): return default data without a backend – great for prototyping front ends (used in the lab).</li>
</ul>
<table>
<tr><th>Lambda non-proxy (custom)</th><th>Lambda proxy</th></tr>
<tr><td>API Gateway <b>wraps</b> the Lambda response (adds statusCode 200, headers). Can modify requests/responses with <b>mapping templates</b> written in <b>VTL (Apache Velocity Template Language)</b>; handle custom errors.</td><td>Response is <b>passed through</b> without a wrapper; the Lambda function must return the correct format (statusCode, headers, body, isBase64Encoded, cookies). Simpler to set up.</td></tr>
</table>
<ul>
  <li><b>First-class integrations</b> (HTTP APIs): connect a route directly to an AWS service API, e.g. <b>SQS-SendMessage</b>, <b>StepFunctions-StartExecution</b>; you provide the parameter mapping.</li>
  <li><b>HTTP proxy integration</b>: forward a route to an HTTP endpoint on the internet; useful to <b>migrate a monolith</b> route by route to Lambda.</li>
  <li><b>Private integrations</b>: reach resources in a VPC (EC2, ECS, EKS, Fargate) through a <b>VPC link</b> to an <b>ALB/NLB</b> (or Cloud Map).</li>
  <li><b>Parameter mapping</b> (HTTP APIs) modifies requests/responses; can't map reserved headers.</li>
</ul>

<h3>5. Deploying</h3>
<ul>
  <li>Deployments are associated with a <b>stage</b> = a <b>snapshot</b> of the API, named as you like, identified by API ID + stage name, <b>included in the invoke URL</b> (…/dev/products vs …/prod/products). Stages are <b>required</b> to deploy.</li>
  <li>Use stages to: separate environments (dev, prod), connect stages to different backends with <b>stage variables</b>, enable caching/throttling per stage.</li>
  <li><b>Stage variables</b>: e.g. <code>lambdaAlias = dev / beta / prod</code> → one API invokes different Lambda aliases per stage (least configuration).</li>
  <li><b>Canary deployment</b>: send a <b>percentage of traffic</b> to the new version on the same stage; increase <code>canarySettings/percentTraffic</code> as it proves healthy, then <b>promote</b>.</li>
</ul>

<h3>6. Controlling access</h3>
<p><b>Protection from unwanted traffic</b>: resource policies, client certificates, AWS WAF, CORS, throttling.</p>
<ul>
  <li><b>IAM resource policies</b> (REST only): allow other accounts, or restrict by <b>IP address</b> (e.g. office network) without WAF.</li>
  <li><b>Custom domains</b>: SSL certs via <b>ACM</b>; supports <b>wildcard</b> (*) domains and multiple APIs via <b>base path mapping</b>.</li>
  <li><b>Client certificates</b>: API Gateway generates a client-side SSL cert; the backend verifies requests using the <b>public key</b>; expires after <b>365 days</b>.</li>
  <li><b>AWS WAF</b>: blocks common exploits like <b>SQL injection and XSS</b>; matches strings/regex; blocks by IP range, country/region, user agents, bad bots, scrapers.</li>
  <li><b>CORS</b>: a <b>browser</b> security feature restricting cross-origin requests. Cross-origin = different domain, subdomain, port or protocol. Browser sends an <b>OPTIONS preflight</b>. API Gateway can handle preflight (REST uses a <b>mock endpoint</b> for OPTIONS).</li>
</ul>
<h4>Throttling</h4>
<ul>
  <li>Account-level: all APIs in an account share a Region-wide quota of <b>10,000 requests per second</b> (soft limit).</li>
  <li>Per stage, per method (REST) or route (HTTP) – <b>cannot exceed</b> the account rate.</li>
  <li>Per client with a <b>usage plan</b> (REST), including per client + method.</li>
  <li>Applied from <b>most granular to least granular</b>: client+method → client → method/stage → stage → account.</li>
  <li>Throttled requests get <b>429 Too Many Requests</b>.</li>
</ul>
<h4>Authorization options</h4>
<table>
<tr><th>Option</th><th>How</th></tr>
<tr><td>None</td><td>Open access</td></tr>
<tr><td>IAM</td><td>Use IAM / AWS credentials (signed requests via SDK)</td></tr>
<tr><td>JWT-based</td><td><b>Amazon Cognito user pools</b> (REST) or another JWT authorizer (HTTP); OIDC/OAuth 2.0</td></tr>
<tr><td>Lambda authorizer</td><td>Lambda validates a <b>bearer token</b> (OAuth, SAML) or request parameters; returns <code>isAuthorized: true/false</code></td></tr>
</table>

<h3>7. Monitoring</h3>
<ul>
  <li>CloudWatch metrics (every minute, kept 15 months): <b>Count</b> (API calls), <b>Latency</b> (round trip from request to response), <b>IntegrationLatency</b> (backend responsiveness), <b>4XXError</b> (client), <b>5XXError</b> (server).</li>
  <li>CloudWatch Logs: <b>error logs</b> and <b>access logs</b>, configured per stage.</li>
  <li><b>AWS X-Ray</b>: trace requests end to end. <b>AWS Config</b>: assess/audit configuration changes. <b>AWS CloudTrail</b>: record of actions by users, roles or services on API Gateway.</li>
</ul>

<h3>8. Optimizing</h3>
<ul>
  <li><b>Caching</b> (REST): faster responses, less backend load; cache keys from path, headers, query strings; per stage or method; TTL; optional encryption; billed hourly. Metrics: <b>CacheHitCount</b> (served from cache), <b>CacheMissCount</b> (served from backend).</li>
  <li><b>Payload compression</b>: content codings <b>deflate, gzip, identity</b>; <b>minimumCompressionSize</b> (0 = compress all); client sends Content-Encoding header.</li>
</ul>
<div class="tip"><b>Exam tip:</b> dev & prod with Lambda aliases, least configuration → <b>one API, two stages, stage variable</b> holding the alias. Only REST APIs: edge-optimized, private endpoints, caching, usage plans, resource policies, client SDKs.</div>
`,
  questions: [
    { t: 'mcq', i: 1, c: 'APIs', q: 'Which is NOT one of the ways an API simplifies development?', o: ['Exposing the full database schema to every client', 'Abstracting implementation details', 'Exposing only the objects or actions a developer needs', 'Establishing how an information provider and user communicate'], e: 'APIs abstract details and expose only what is needed.' },
    { t: 'mcq', i: 1, c: 'REST', q: 'What does REST stand for?', o: ['Representational State Transfer', 'Remote Execution Service Transport', 'Resource Endpoint Secure Transfer', 'Regional Elastic Service Tier'], e: 'REST = Representational State Transfer, an architectural style.' },
    { t: 'tf', c: 'REST', q: 'REST is an architectural style that provides a standard way to structure requests from a client to a server.', a: true, e: 'Definition of REST.' },
    { t: 'tf', c: 'APIs', q: 'A RESTful API in API Gateway keeps a long-lived, stateful connection with each client.', a: false, e: 'RESTful APIs are stateless and short-lived; WebSocket APIs are stateful and long-lived.' },
    { t: 'mcq', c: 'APIs', q: 'Which protocols can an API request use according to the module?', o: ['SOAP, WebSockets, HTTP, HTTPS', 'SMTP and FTP only', 'SSH only', 'TCP sockets without HTTP only'], e: 'Requests use a standard protocol: SOAP, WebSockets, HTTP, HTTPS.' },

    { t: 'mcq', i: 1, c: 'API gateway', q: 'Which task can an API gateway proxy handle so the server doesn\'t have to?', o: ['Limit the request rate and validate developer keys', 'Compile application code', 'Store relational data', 'Patch the server OS'], e: 'Proxy tasks: rate limiting, key validation, discarding invalid requests, geo-routing, source filtering.' },
    { t: 'tf', c: 'API gateway', q: 'An API gateway reduces the number of requests that reach the server.', a: true, e: 'It discards invalid requests and abstracts common functionality.' },
    { t: 'mcq', i: 1, c: 'API Gateway', q: 'What is Amazon API Gateway?', o: ['A fully managed service to create, publish, maintain, monitor and secure APIs at any scale', 'A container registry', 'A NoSQL database', 'A virtual private server'], e: 'API Gateway is fully managed and serverless.' },
    { t: 'tf', c: 'API Gateway', q: 'With API Gateway you pay only for the API calls you receive and the data transferred out.', a: true, e: 'Pricing model from the speaker notes.' },
    { t: 'match', i: 1, c: 'Protocols', q: 'Match each characteristic to RESTful or WebSocket APIs.', p: [['Stateless, short-lived request/response', 'RESTful'], ['Stateful, long-lived two-way channel', 'WebSocket'], ['Uses HTTP methods like GET and POST', 'RESTful'], ['More efficient for chatty, real-time applications', 'WebSocket']], e: 'REST = stateless short-lived; WebSocket = stateful bidirectional.' },
    { t: 'mcq', i: 1, c: 'Protocols', q: 'A real-time chat application needs bidirectional communication. Which API type should you create?', o: ['WebSocket API', 'REST API', 'HTTP API', 'Mock API'], e: 'WebSockets provide real-time, two-way communication.' },
    { t: 'tf', c: 'Protocols', q: 'WebSockets add an HTTP envelope to every message, so they are less efficient for chatty apps.', a: false, e: 'After the connection is established, WebSockets send just the data, avoiding envelope bloat.' },
    { t: 'match', i: 1, c: 'REST vs HTTP API', q: 'Match each API type with its description.', p: [['REST API', 'Full control over requests and responses, more features'], ['HTTP API', 'Only proxy functionality, lowest cost and latency']], e: 'REST API vs HTTP API.' },
    { t: 'mcq', i: 1, c: 'REST vs HTTP API', q: 'You need a simple API that proxies requests to Lambda at the lowest cost and latency. Which type?', o: ['HTTP API', 'REST API', 'WebSocket API', 'Private REST API'], e: 'HTTP APIs are designed for lowest cost and latency.' },
    { t: 'match', c: 'Management', q: 'Match each tool with how it is used for API Gateway.', p: [['OpenAPI (Swagger)', 'Develop: define the API'], ['AWS SAM', 'Deploy: serverless application model'], ['AWS CloudFormation', 'Deploy: infrastructure as code templates'], ['AWS CDK', 'Deploy: define infrastructure in code']], e: 'Develop with console/CLI/OpenAPI; deploy with SAM, CloudFormation, CDK.' },

    { t: 'mcq', i: 1, c: 'Creating APIs', q: 'What is the base URL structure of a REST or HTTP API?', o: ['https://{restapi_id}.execute-api.{region}.amazonaws.com/{stage_name}/', 'https://apigateway.{region}.aws/{api_name}', 'https://{stage_name}.{restapi_id}.amazonaws.com', 'https://{region}.execute-api.com/{restapi_id}'], e: 'API ID, Region, then stage name.' },
    { t: 'mcq', c: 'Creating APIs', q: 'Which three ways can you create an API in API Gateway?', o: ['AWS CLI, API Gateway console, importing an OpenAPI definition', 'Docker, Boto3, CloudShell only', 'Only the console', 'SQL scripts, IAM, S3'], e: 'Section 4 takeaway.' },
    { t: 'mcq', i: 1, c: 'Routes', q: 'What does the greedy path variable {proxy+} do in a route like GET /products/{proxy+}?', o: ['Catches all sub-paths under /products and sends them to one integration', 'Encrypts the request', 'Adds a canary stage', 'Limits the request rate'], e: '{proxy+} matches any path below the resource.' },
    { t: 'mcq', c: 'Routes', q: 'Which route key updates (replaces) a specific product?', o: ['PUT /products/{product_id}', 'GET /products', 'GET /products/{product_id}', 'DELETE /products'], e: 'PUT replaces a product by ID.' },
    { t: 'tf', c: 'Routes', q: 'As a best practice, use different paths to perform different actions and connect to different backend integrations.', a: true, e: 'Section 4 takeaway.' },
    { t: 'tf', c: 'Importing', q: 'You can import an API from an OpenAPI 3 or Swagger definition in JSON or YAML.', a: true, e: 'API Gateway supports import/export of Swagger and OpenAPI 3.' },

    { t: 'match', i: 1, c: 'Endpoint types', q: 'Match each endpoint type with its description.', p: [['Edge-optimized', 'Uses a managed CloudFront distribution for global clients'], ['Regional', 'For clients in the same AWS Region'], ['Private', 'Accessible only from within your VPC']], e: 'Edge-optimized and private are REST only.' },
    { t: 'mcq', i: 1, c: 'Endpoint types', q: 'Which endpoint type is supported by REST, HTTP and WebSocket APIs?', o: ['Regional', 'Edge-optimized', 'Private', 'Global'], e: 'All API types support Regional endpoints.' },
    { t: 'mcq', i: 1, c: 'Endpoint types', q: 'Your API clients are distributed globally and you want built-in DDoS protection without managing CloudFront. Which endpoint?', o: ['Edge-optimized endpoint', 'Regional endpoint', 'Private endpoint', 'WebSocket endpoint'], e: 'Edge-optimized uses an API Gateway-managed CloudFront distribution.' },
    { t: 'tf', c: 'Endpoint types', q: 'Private endpoints are available for HTTP APIs.', a: false, e: 'Edge-optimized and private endpoints are REST only.' },
    { t: 'tf', c: 'Client SDKs', q: 'API Gateway generates client SDKs for HTTP and WebSocket APIs.', a: false, e: 'Client SDKs are generated only for REST APIs.' },
    { t: 'mcq', i: 1, c: 'Integration flow', q: 'What is the correct order of the API Gateway integration flow?', o: ['Method request → Integration request → Backend → Integration response → Method response', 'Integration request → Method request → Method response → Integration response', 'Method response → Method request → Backend', 'Backend → Method request → Integration response'], e: 'Client → method request → integration request → backend → integration response → method response.' },
    { t: 'tf', c: 'Integration flow', q: 'A mock integration returns default data without calling a backend, which is useful for prototyping front ends.', a: true, e: 'The lab used mock endpoints before connecting Lambda.' },
    { t: 'match', i: 1, c: 'Lambda integrations', q: 'Match each Lambda integration type with its behavior.', p: [['Proxy integration', 'Response passed through; Lambda must format it'], ['Non-proxy (custom) integration', 'API Gateway wraps the response and can transform it with VTL']], e: 'Proxy = pass-through; non-proxy = wrapped and mappable.' },
    { t: 'mcq', i: 1, c: 'Lambda integrations', q: 'In which language are API Gateway mapping templates written?', o: ['Velocity Template Language (VTL)', 'YAML', 'Python', 'SQL'], e: 'Mapping templates use Apache VTL.' },
    { t: 'mcq', c: 'Lambda integrations', q: 'With a Lambda proxy integration returning a 403 error, who must build the statusCode, headers and body?', o: ['The Lambda function', 'API Gateway mapping templates', 'The client SDK', 'CloudFront'], e: 'In proxy integration the response is passed through as-is.' },
    { t: 'tf', c: 'Lambda integrations', q: 'In a Lambda proxy integration, API Gateway transforms the response with VTL mapping templates.', a: false, e: 'Mapping templates are used in non-proxy integrations; proxy integrations pass the response through.' },
    { t: 'match', i: 1, c: 'Integration types', q: 'Match each integration type to its use.', p: [['First-class integration', 'Route directly to an AWS service API like SQS-SendMessage'], ['HTTP proxy integration', 'Forward a route to an internet HTTP endpoint, e.g. a monolith'], ['Private integration', 'Reach VPC resources through a VPC link and load balancer'], ['Mock integration', 'Return fixed data with no backend']], e: 'Integration options.' },
    { t: 'mcq', c: 'Integration types', q: 'Which are examples of first-class integrations?', o: ['SQS-SendMessage and StepFunctions-StartExecution', 'S3 GetObject and DynamoDB Scan', 'EC2 RunInstances and IAM CreateUser', 'Lambda Invoke and ECR Push'], e: 'Examples shown: SQS-SendMessage, StepFunctions-StartExecution.' },
    { t: 'mcq', i: 1, c: 'Integration types', q: 'You are migrating a monolith on EC2 to Lambda one route at a time. Which integration helps most?', o: ['HTTP proxy integration', 'Mock integration', 'WebSocket integration', 'Client certificate'], e: 'Map all routes to the monolith with HTTP proxy, then remap routes to Lambda one by one.' },
    { t: 'mcq', c: 'Integration types', q: 'What connects API Gateway to private resources (EC2, ECS, EKS) inside a VPC?', o: ['A VPC link with a load balancer', 'An edge-optimized endpoint', 'A usage plan', 'A canary deployment'], e: 'Private integrations use a VPC link (ALB/NLB).' },
    { t: 'tf', c: 'Parameter mapping', q: 'You can use parameter mapping to modify reserved headers.', a: false, e: 'You cannot configure mappings for reserved headers.' },

    { t: 'mcq', i: 1, c: 'Stages', q: 'What is an API Gateway stage?', o: ['A named snapshot of an API deployment that is part of the invoke URL', 'A Lambda alias', 'A type of authorizer', 'A CloudWatch metric'], e: 'Stages are snapshots, identified by API ID + stage name, included in the URL.' },
    { t: 'tf', i: 1, c: 'Stages', q: 'A stage name is not part of the URL used to invoke the API.', a: false, e: 'Stages are included in the invoke URL, e.g. .../dev/products and .../prod/products.' },
    { t: 'mcq', i: 1, c: 'Stage variables', q: 'A developer needs dev and prod environments; the backend Lambda function has dev and prod aliases. What requires the LEAST configuration?', o: ['One REST API using a stage variable for the alias, deployed to dev and prod stages', 'Two separate REST APIs, one per alias', 'One API on dev with a canary for prod', 'One API on prod with a canary for dev'], e: 'Sample exam question: answer B.' },
    { t: 'tf', c: 'Stage variables', q: 'Stage variables let each stage point to a different backend, such as a different Lambda alias.', a: true, e: 'e.g. lambdaAlias = dev / beta / prod.' },
    { t: 'mcq', i: 1, c: 'Canary', q: 'What is a canary deployment in API Gateway?', o: ['Sending a percentage of a stage\'s traffic to a new version for testing', 'Deploying to a second Region', 'Blocking SQL injection', 'Caching responses for one hour'], e: 'Canary: split traffic between production and canary releases.' },
    { t: 'mcq', c: 'Canary', q: 'After a successful canary test, what do you eventually do?', o: ['Increase the canary percentage and then promote it to production', 'Delete the stage', 'Disable caching', 'Switch to a WebSocket API'], e: 'Update percentTraffic until ready, then promote.' },

    { t: 'mcq', i: 1, c: 'Access control', q: 'Which is NOT one of the API Gateway protections from unwanted traffic?', o: ['DynamoDB Streams', 'Resource policies', 'AWS WAF', 'Throttling'], e: 'Protections: resource policies, client certificates, AWS WAF, CORS, throttling.' },
    { t: 'mcq', i: 1, c: 'Resource policies', q: 'You want to limit access to a REST API\'s dev stage to your office IP range without using WAF. What do you use?', o: ['An IAM resource policy', 'A usage plan', 'A canary', 'Payload compression'], e: 'REST API resource policies can restrict by source IP or account.' },
    { t: 'tf', c: 'Resource policies', q: 'HTTP APIs support IAM resource policies the same way REST APIs do.', a: false, e: 'HTTP APIs currently cannot use resource policies this way.' },
    { t: 'mcq', c: 'Custom domains', q: 'Which service manages the SSL certificates for API Gateway custom domains?', o: ['AWS Certificate Manager (ACM)', 'AWS KMS', 'IAM', 'Amazon Cognito'], e: 'ACM manages certificates; wildcard domains and base path mapping are supported.' },
    { t: 'mcq', c: 'Client certificates', q: 'How long is an API Gateway-generated client certificate valid?', o: ['365 days', '30 days', '7 days', 'Forever'], e: 'Client certificates expire after 365 days.' },
    { t: 'tf', c: 'Client certificates', q: 'With client certificates, the backend verifies that requests come from API Gateway by using a public key.', a: true, e: 'That is how client certificates work.' },
    { t: 'mcq', i: 1, c: 'AWS WAF', q: 'Which service protects APIs from SQL injection and cross-site scripting (XSS)?', o: ['AWS WAF', 'AWS X-Ray', 'Amazon Cognito', 'AWS Config'], e: 'AWS WAF protects against common web exploits.' },
    { t: 'tf', c: 'AWS WAF', q: 'AWS WAF can block requests by IP range, country, user agent, bad bots and scrapers.', a: true, e: 'Listed WAF features.' },
    { t: 'mcq', i: 1, c: 'CORS', q: 'Which request is NOT cross-origin relative to https://example.com?', o: ['https://example.com/products', 'https://petstore.example.com', 'https://example.com:10777', 'http://example.com'], e: 'Cross-origin = different domain, subdomain, port or protocol.' },
    { t: 'mcq', c: 'CORS', q: 'Before a non-simple cross-origin request, what does the browser send?', o: ['An OPTIONS preflight request', 'A HEAD request to CloudFront', 'A WebSocket handshake', 'A DELETE request'], e: 'The browser sends an OPTIONS preflight.' },
    { t: 'tf', i: 1, c: 'CORS', q: 'CORS is enforced by the browser, so it matters only when your clients are browsers.', a: true, e: 'CORS is a browser security feature.' },
    { t: 'tf', c: 'CORS', q: 'When you enable CORS on a REST API, API Gateway sets up a mock endpoint to handle the OPTIONS method.', a: true, e: 'From the speaker notes.' },
    { t: 'mcq', i: 1, c: 'Throttling', q: 'What is the default Region-wide throttling quota shared by all APIs in an account?', o: ['10,000 requests per second', '1,000 requests per second', '100 requests per second', '5,000 requests per minute'], e: '10,000 rps, a soft limit.' },
    { t: 'mcq', i: 1, c: 'Throttling', q: 'Which HTTP status code means a request was throttled by API Gateway?', o: ['429 Too Many Requests', '403 Forbidden', '500 Internal Server Error', '404 Not Found'], e: '429 indicates throttling.' },
    { t: 'mcq', i: 1, c: 'Throttling', q: 'In what order does API Gateway apply throttling settings?', o: ['From most granular (client + method) to least granular (account)', 'From account to client', 'Randomly', 'Only the account limit is ever applied'], e: 'Most to least granular.' },
    { t: 'mcq', c: 'Throttling', q: 'How do you throttle individual API clients (such as partners) on a REST API?', o: ['With a usage plan', 'With a stage variable', 'With a VTL template', 'With a client certificate'], e: 'Usage plans throttle by client (and client + method).' },
    { t: 'tf', c: 'Throttling', q: 'Stage or method throttling rates can be set higher than the account-level rate.', a: false, e: 'They cannot be higher than the account-level rate.' },
    { t: 'match', i: 1, c: 'Authorizers', q: 'Match each authorization option with how it works.', p: [['None', 'Leaves access open'], ['IAM', 'Uses IAM and AWS credentials (signed requests)'], ['JWT-based', 'Amazon Cognito user pools or another JWT provider'], ['Lambda authorizer', 'Function validates a bearer token or request parameters']], e: 'Four authorization options.' },
    { t: 'mcq', c: 'Authorizers', q: 'Which identity provider can REST APIs use as their JWT authorizer?', o: ['Amazon Cognito user pools', 'AWS WAF', 'Amazon ECR', 'AWS Config'], e: 'REST APIs use Cognito; HTTP APIs can use third-party JWT providers.' },

    { t: 'match', i: 1, c: 'Monitoring', q: 'Match each CloudWatch metric to what it measures.', p: [['Latency', 'Time from when API Gateway receives a request to when it responds'], ['IntegrationLatency', 'Backend request/response time'], ['Count', 'Number of API calls in a period'], ['4XXError / 5XXError', 'Client-side and server-side errors']], e: 'Default API Gateway metrics.' },
    { t: 'match', i: 1, c: 'Monitoring', q: 'Match each monitoring tool with its purpose.', p: [['AWS X-Ray', 'Trace and analyze requests end to end'], ['AWS Config', 'Assess, audit and evaluate configuration changes'], ['AWS CloudTrail', 'Record actions taken by users, roles or services on API Gateway'], ['CloudWatch access logs', 'Log who accessed the API and how, per stage']], e: 'Monitoring tools.' },
    { t: 'tf', c: 'Monitoring', q: 'The IntegrationLatency metric measures the full round trip from client request to API Gateway response.', a: false, e: 'That is Latency. IntegrationLatency measures the backend request/response time.' },
    { t: 'match', i: 1, c: 'Caching', q: 'Match each cache metric with its meaning.', p: [['CacheHitCount', 'Requests served from the API cache'], ['CacheMissCount', 'Requests served from the backend']], e: 'Cache metrics.' },
    { t: 'tf', i: 1, c: 'Caching', q: 'API Gateway caching reduces calls to your backend and improves latency, and can be set up per stage or method.', a: true, e: 'Caching benefits.' },
    { t: 'tf', c: 'Caching', q: 'API Gateway caching is free when the cache is not used.', a: false, e: 'Caching is priced hourly whether the cache is used or not.' },
    { t: 'mcq', c: 'Compression', q: 'Which content codings does API Gateway payload compression support?', o: ['deflate, gzip, identity', 'zip, rar, 7z', 'base64 only', 'brotli only'], e: 'Supported: deflate, gzip, identity.' },
  ]
});
