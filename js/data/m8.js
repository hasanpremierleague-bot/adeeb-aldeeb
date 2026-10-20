// Module 8: Introducing Containers and Container Services (slides 1-48 only)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm8',
  num: 8,
  title: 'Containers and Container Services',
  scope: 'Slides 6–49',
  short: 'Containers',
  icon: '📦',
  note: 'Midterm scope: slides 6–49 (Elastic Beanstalk overview on slide 49 included).',
  study: `
<h3>1. Introducing containers</h3>
<ul>
  <li><b>Shipping container analogy</b>: before standard containers, goods shipped in vessels of every shape/size → slow, inefficient, costly. Uniform containers simplified loading, storing and transfer; <b>abstraction</b> improved efficiency and reduced cost.</li>
  <li>A <b>container is a standardized unit of software</b> containing everything the app needs to run: <b>application code, runtime engine, system tools, system libraries</b>.</li>
  <li>Containers make apps deploy <b>quickly, reliably and consistently regardless of environment</b>.</li>
</ul>
<h4>Evolution of deployment models</h4>
<table>
<tr><th>Bare-metal servers</th><th>Virtual machines</th><th>Containers</th></tr>
<tr><td>Apps <b>compete for server resources</b>; library versions <b>shared</b> across apps; <b>inflexible hardware costs</b> (same cost at 0% or 100% use).</td>
<td><b>Isolated apps and libraries</b>; better resource utilization; but <b>more OS maintenance</b> and <b>more server space for OS</b> (each VM has a full OS – heavy).</td>
<td><b>Lightweight, efficient, fast</b>; <b>highly portable</b> (run identically across environments); shared or isolated libraries; <b>shared OS kernel</b>; better resource utilization.</td></tr>
</table>

<h3>2. Docker</h3>
<ul>
  <li>Docker = lightweight <b>container virtualization platform</b>; tools to create, store, manage and run containers; integrates with automated build/test/deploy pipelines.</li>
  <li><b>Benefits</b>: portable runtime environment; app + dependencies in a <b>single, immutable artifact</b>; run different app versions with different dependencies <b>simultaneously</b>; faster dev & deployment cycles; better resource utilization.</li>
</ul>
<table>
<tr><th>Component</th><th>Definition</th></tr>
<tr><td><b>Dockerfile</b></td><td>Plain text file with instructions to <b>create a container image</b></td></tr>
<tr><td><b>Container image</b></td><td><b>Read-only template</b> used to create writable containers</td></tr>
<tr><td><b>Container registry</b></td><td>Repository of private or public images you can base other images on</td></tr>
<tr><td><b>Container layer</b></td><td><b>Thin read/write layer</b> used to make changes to the running container</td></tr>
<tr><td><b>Container</b></td><td><b>Runnable instance of an image</b></td></tr>
</table>
<h4>Dockerfile layers</h4>
<ul><li><b>Each line of a Dockerfile adds a (read-only) layer</b> to the image.</li></ul>

<h3>3. Microservices and containers</h3>
<ul>
  <li><b>Monolithic</b>: one app with storefront UI, account, cart, shipping, data-access services and one database. <b>Microservices</b>: each service separate, each in the language that suits it (Node.js, Python, Java...).</li>
</ul>
<table>
<tr><th>Microservices design</th><th>Container characteristic</th></tr>
<tr><td>Decentralized, evolutionary design; smart endpoints, dumb pipes</td><td>Each container uses the best language/technology; components isolated and evolve separately</td></tr>
<tr><td>Independent products, not projects</td><td>Package all dependencies into a single, immutable object</td></tr>
<tr><td>Designed for failure; disposable</td><td>Gracefully shut down and replace; start fast, fail fast; circuit-breaker-like</td></tr>
<tr><td>Development and production parity</td><td>Consistent dev, test, prod environments → facilitates DevOps</td></tr>
</table>

<h3>4. AWS container services</h3>
<ul>
  <li><b>Challenges at scale</b>: state of containers, scheduling starts/stops, resources on each server, maximizing availability/resilience/performance.</li>
  <li><b>Orchestration platforms</b> handle <b>scheduling, placement, service integration</b> (networking, storage, security, monitoring, logging). Examples: Docker Swarm, Kubernetes, Amazon ECS.</li>
</ul>
<table>
<tr><th>Service</th><th>What it is</th></tr>
<tr><td><b>Amazon ECS</b></td><td>Fully managed <b>container orchestration</b>; scales to thousands of containers; schedules placement across clusters; integrates with third-party schedulers & AWS services. Launch types: <b>Fargate</b> or <b>EC2</b>. Containers run as short-running <b>tasks</b> or long-running <b>services</b>.</td></tr>
<tr><td><b>Amazon ECR</b></td><td>Fully managed <b>container registry</b> to store, run and manage images; scalable, highly available; integrated with ECS and Docker CLI; secure (encryption at rest, IAM).</td></tr>
<tr><td><b>Amazon EKS</b></td><td>Managed service to run <b>Kubernetes</b> on AWS; built with the Kubernetes community; conformant & compatible; secure by default. Worker nodes on EC2 or Fargate.</td></tr>
<tr><td><b>AWS Fargate</b></td><td>Serverless compute launch type for containers (no instances to manage).</td></tr>
</table>
<table>
<tr><th>Choose Fargate for</th><th>Choose EC2 for</th></tr>
<tr><td>Wide swings in demand; large workloads optimized for <b>low overhead</b>; <b>small test environments</b>; <b>batch workloads on a schedule</b></td><td><b>Predictable</b> resource needs or <b>reserved instances</b>; large workloads optimized for <b>price</b>; <b>compliance</b> with organizational security requirements; <b>excess EC2 capacity</b></td></tr>
</table>
<h4>Push an image to ECR</h4>
<p>Order: <b>create repo → build → tag → authenticate (login) → push</b>. (Login can be skipped with amazon-ecr-credential-helper.)</p>

<h3>5. AWS Elastic Beanstalk (slide 49)</h3>
<ul>
  <li>Service for <b>deploying and scaling web applications and services</b>.</li>
  <li>Automatically handles deployment details: <b>capacity provisioning, load balancing, automatic scaling, application health monitoring</b>.</li>
  <li>Provides a <b>variety of platforms</b> to build applications on.</li>
  <li>Manages all the resources that run your application as an <b>environment</b>.</li>
</ul>
<div class="tip"><b>Exam tip:</b> image = read-only template, container = runnable instance with a writable layer. ECS = orchestration, ECR = registry, EKS = Kubernetes, Fargate = serverless launch type.</div>
`,
  questions: [
    { t: 'mcq', i: 1, c: 'Containers', q: 'What is a container?', o: ['A standardized unit of software that contains everything an application needs to run', 'A full virtual machine with its own OS kernel', 'A physical server', 'An S3 bucket for code'], e: 'Containers package code, runtime, system tools and libraries.' },
    { t: 'tf', i: 1, c: 'Containers', q: 'Containers help applications deploy quickly, reliably and consistently regardless of the deployment environment.', a: true, e: 'Section 2 takeaway.' },
    { t: 'match', i: 1, c: 'Deployment models', q: 'Match each deployment model with its characteristic.', p: [['Bare-metal servers', 'Applications compete for resources and share library versions'], ['Virtual machines', 'Isolated apps but more OS maintenance and space'], ['Containers', 'Lightweight, portable, share the host OS kernel']], e: 'Evolution: bare metal → VMs → containers.' },
    { t: 'mcq', i: 1, c: 'Deployment models', q: 'What do containers share with each other on the same host?', o: ['The host OS kernel', 'A full guest OS each', 'A hypervisor per container', 'Nothing at all'], e: 'Containers share the OS kernel.' },
    { t: 'mcq', c: 'Deployment models', q: 'What is a downside of virtual machines compared to containers?', o: ['More OS maintenance and more server space used by each guest OS', 'Applications are not isolated', 'Libraries must always be shared', 'They cannot run on cloud hardware'], e: 'Each VM has its own OS: more patching and space.' },

    { t: 'mcq', i: 1, c: 'Docker benefits', q: 'Which is a Docker container benefit?', o: ['Application and dependencies are packaged in a single, immutable artifact', 'Every container needs its own OS license', 'Only one app version can run at a time', 'Slower deployment cycles'], e: 'Benefits: portable, immutable artifact, run versions side by side, faster cycles, better utilization.' },
    { t: 'tf', c: 'Docker benefits', q: 'Docker lets you run different application versions with different dependencies simultaneously.', a: true, e: 'Listed benefit.' },
    { t: 'match', i: 1, c: 'Docker components', q: 'Match each Docker component with its definition.', p: [['Dockerfile', 'Text file with instructions to create an image'], ['Container image', 'Read-only template used to create containers'], ['Container registry', 'Repository of images'], ['Container layer', 'Thin read/write layer for changes in a running container'], ['Container', 'Runnable instance of an image']], e: 'Docker components.' },
    { t: 'tf', i: 1, c: 'Docker components', q: 'A container image is a writable template that is modified while the container runs.', a: false, e: 'Images are read-only; changes go to the thin writable container layer.' },
    { t: 'mcq', i: 1, c: 'Docker components', q: 'Where do changes made inside a running container go?', o: ['The thin read/write container layer', 'The read-only image layers', 'The Dockerfile', 'The registry'], e: 'The container layer is read/write.' },
    { t: 'tf', i: 1, c: 'Dockerfile', q: 'A Dockerfile is a binary file that contains the running container.', a: false, e: 'A Dockerfile is a plain text file with instructions to create an image.' },

    { t: 'tf', c: 'Docker', q: 'A container is a read-only template, and an image is a runnable instance of a container.', a: false, e: 'It is the other way round: an image is the read-only template, a container is its runnable instance.' },

    { t: 'mcq', i: 1, c: 'Microservices', q: 'In a microservices architecture, how are services built?', o: ['Each service is separate and can use the language best suited to it', 'All services share one codebase and one language', 'Services must all be written in Java', 'Services cannot be containerized'], e: 'e.g. Storefront in Node.js, cart in Python, shipping in Java.' },
    { t: 'match', i: 1, c: 'Microservices', q: 'Match each microservices design principle with the matching container characteristic.', p: [['Decentralized, evolutionary design', 'Each component is isolated and evolves separately'], ['Independent products, not projects', 'Dependencies packaged into a single immutable object'], ['Designed for failure, disposable', 'Gracefully shut down and replace a container'], ['Development and production parity', 'Consistent dev, test and prod environments']], e: 'Microservices and containers.' },
    { t: 'tf', c: 'Microservices', q: 'Containers make development, testing and production environments consistent, which facilitates DevOps.', a: true, e: 'Dev/prod parity.' },
    { t: 'tf', c: 'Microservices', q: 'In a monolithic architecture, each service (account, cart, shipping) can use its own programming language and be deployed independently.', a: false, e: 'That describes microservices.' },

    { t: 'mcq', i: 1, c: 'Orchestration', q: 'What do container orchestration platforms handle?', o: ['Scheduling, placement and service integration', 'Writing application code', 'Physical hardware maintenance', 'Billing'], e: 'Orchestration: scheduling, placement, service integration.' },
    { t: 'match', i: 1, c: 'AWS container services', q: 'Match each AWS service with its description.', p: [['Amazon ECS', 'Fully managed container orchestration service'], ['Amazon ECR', 'Fully managed container registry'], ['Amazon EKS', 'Managed service to run Kubernetes on AWS'], ['AWS Fargate', 'Serverless launch type for containers']], e: 'AWS container services.' },
    { t: 'mcq', i: 1, c: 'Amazon ECS', q: 'Which two launch types can Amazon ECS use?', o: ['AWS Fargate and Amazon EC2', 'AWS Lambda and Amazon S3', 'Kubernetes and Docker Swarm', 'Amazon ECR and Amazon EKS'], e: 'ECS launches containers on Fargate or EC2 instances.' },
    { t: 'tf', c: 'Amazon ECS', q: 'In Amazon ECS you can define containers as short-running tasks or long-running services.', a: true, e: 'From the ECS solution architecture notes.' },
    { t: 'mcq', i: 1, c: 'Amazon ECR', q: 'Which feature describes Amazon ECR security?', o: ['Encryption at rest and integration with IAM', 'No encryption, public by default', 'Only password authentication', 'It requires a VPN'], e: 'ECR: encryption at rest, IAM integration.' },
    { t: 'tf', c: 'Amazon ECR', q: 'Amazon ECR is a container orchestration service that schedules containers across clusters.', a: false, e: 'ECR is a registry; ECS is the orchestration service.' },
    { t: 'dnd', i: 1, c: 'Fargate vs EC2', q: 'Drag each workload to the better ECS launch type.', p: [['Wide swings in demand', 'Fargate'], ['Small test environments', 'Fargate'], ['Use reserved instances to reduce cost', 'EC2'], ['Comply with organizational security requirements', 'EC2']], e: 'Fargate: variable, low overhead, small tests, scheduled batch. EC2: predictable, price-optimized, compliance, excess capacity.' },
    { t: 'mcq', i: 1, c: 'Fargate vs EC2', q: 'You have batch workloads that run on a schedule and want low operational overhead. Which ECS launch type?', o: ['AWS Fargate', 'Amazon EC2', 'Amazon EKS on bare metal', 'AWS Lambda layers'], e: 'Fargate suits scheduled batch workloads and low overhead.' },
    { t: 'mcq', c: 'Fargate vs EC2', q: 'You already have excess EC2 capacity. Which ECS launch type makes sense?', o: ['Amazon EC2', 'AWS Fargate', 'Amazon ECR', 'Elastic Beanstalk'], e: 'Excess EC2 capacity → EC2 launch type.' },
    { t: 'mcq', i: 1, c: 'ECR push', q: 'What is the correct order to push an image to Amazon ECR?', o: ['Create repository → build → tag → authenticate Docker → push', 'Push → build → tag → create repository', 'Tag → push → build → login', 'Login → push → create repository → build'], e: 'Create repo, build, tag with the ECR URI, login, push.' },
    { t: 'mcq', i: 1, c: 'Amazon EKS', q: 'What is Amazon EKS?', o: ['A managed service to run Kubernetes on AWS', 'A container image registry', 'A Docker build tool', 'A serverless function service'], e: 'EKS runs Kubernetes; conformant, compatible, secure by default.' },
    { t: 'tf', c: 'Amazon EKS', q: 'Amazon EKS is AWS\'s own proprietary orchestrator that is not compatible with Kubernetes.', a: false, e: 'EKS runs Kubernetes and is conformant and compatible with it.' },
    { t: 'mcq', i: 1, c: 'Amazon ECR', q: 'A team needs a private, managed place on AWS to store their Docker images for Amazon ECS. Which service?', o: ['Amazon ECR', 'Amazon EKS', 'AWS Fargate', 'Amazon S3 Glacier'], e: 'ECR is the fully managed container registry.' },
    { t: 'mcq', i: 1, c: 'AWS container services', q: 'A company already uses Kubernetes on premises and wants a managed Kubernetes service on AWS. Which should they choose?', o: ['Amazon EKS', 'Amazon ECS', 'Amazon ECR', 'AWS Lambda'], e: 'EKS runs conformant Kubernetes.' },
    { t: 'order', i: 1, c: 'Deployment models', q: 'Order the evolution of deployment models.', s: ['Bare-metal servers', 'Virtual machines', 'Containers'], e: 'Bare metal → VMs → containers, each improving utilization and portability.' },
    { t: 'order', i: 1, c: 'ECR push', q: 'Order the steps to push an image to Amazon ECR.', s: ['Create the ECR repository', 'Build the image', 'Tag the image with the repository URI', 'Authenticate Docker to the registry', 'Push the image'], e: 'Create repo → build → tag → login → push.' },
    { t: 'mcq', i: 1, c: 'Elastic Beanstalk', q: 'What is AWS Elastic Beanstalk?', o: ['A service for deploying and scaling web applications and services', 'A container image registry', 'A managed Kubernetes service', 'A NoSQL database'], e: 'Elastic Beanstalk deploys and scales web apps and manages their resources as an environment.' },
    { t: 'tf', i: 1, c: 'Elastic Beanstalk', q: 'Elastic Beanstalk automatically handles capacity provisioning, load balancing, automatic scaling and application health monitoring.', a: true, e: 'It handles these deployment details for you.' },
    { t: 'tf', c: 'Elastic Beanstalk', q: 'With Elastic Beanstalk you must manually provision and wire together every load balancer and instance yourself.', a: false, e: 'Elastic Beanstalk manages all the resources that run your application as an environment.' },
    { t: 'mcq', c: 'Elastic Beanstalk', q: 'In Elastic Beanstalk, all the resources that run your application are managed as a(n):', o: ['Environment', 'Bucket', 'Stage', 'Layer'], e: 'Elastic Beanstalk manages your app resources as an environment, on a choice of platforms.' }
  ]
});
