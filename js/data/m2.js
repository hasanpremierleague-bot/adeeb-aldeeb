// Module 2: Introduction to Developing on AWS
// Question format: t = type (mcq | tf | match), i = important flag, c = topic,
// mcq: o = options with the correct answer FIRST (shuffled at runtime), tf: a = true/false,
// match: p = [left, right] pairs, e = explanation.
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm2',
  num: 2,
  title: 'Introduction to Developing on AWS',
  short: 'Dev on AWS',
  icon: '💻',
  study: `
<h3>1. Systems development lifecycle (SDLC)</h3>
<ul>
  <li>The SDLC is a conceptual model used in project management that describes the stages of an information system project, from feasibility study to maintenance.</li>
  <li>General SDLC steps: <b>Plan → Define → Design → Develop → Deploy → Maintain</b>.</li>
  <li>In the <b>Develop</b> phase: develop the new system, install new components and programs, train users, test performance, make adjustments.</li>
  <li>The challenge of software delivery: deliver software <b>quickly, securely and reliably</b> with zero tolerance for outages (bridge stability of operations and rapid feature development).</li>
</ul>
<h4>SDLC methodologies</h4>
<table>
<tr><th>Waterfall (traditional)</th><th>Agile</th></tr>
<tr><td>Sequential; each phase must be completed before the next begins. Customers may not give feedback for months.</td><td>Fast-paced and iterative; push work to customers quickly to gather feedback. Work happens in <b>sprints</b> (typically 1–4 weeks). Concepts: MVP, release candidate, velocity. Examples: Scrum, Crystal, DSDM.</td></tr>
</table>
<h4>Major phases of software development</h4>
<table>
<tr><th>Phase</th><th>Activities</th></tr>
<tr><td>Code</td><td>Check in source code (e.g. .java files), peer-review new code</td></tr>
<tr><td>Build</td><td>Compile code, run unit tests, run style checkers, gather code metrics, create container images</td></tr>
<tr><td>Test</td><td>Integration tests with other systems, load tests, UI tests, penetration tests</td></tr>
<tr><td>Deploy</td><td>Deploy code to production environments</td></tr>
<tr><td>Maintain</td><td>Monitor code in production to quickly detect unusual activity or errors</td></tr>
</table>

<h3>2. Getting started developing on AWS (4 steps)</h3>
<ol>
  <li><b>Create an AWS account</b> (aws.amazon.com).</li>
  <li><b>Set up AWS permissions</b> with IAM. Identity = <i>authentication</i> (who can use your resources). Access management = <i>authorization</i> (what they can use and how).</li>
  <li><b>Install the development environment</b> – IDEs + AWS IDE Toolkits: Eclipse, IntelliJ IDEA, PyCharm, Rider (JetBrains), Visual Studio, VS Code, Azure DevOps.</li>
  <li><b>Interact with AWS services</b> – AWS Management Console, or programmatically via AWS CLI, AWS SDKs, or service APIs.</li>
</ol>
<h4>IAM example (John Doe)</h4>
<ul>
  <li><b>User</b> – John Doe (has AWS credentials)</li>
  <li><b>Group</b> – John's IAM user belongs to the Developer group</li>
  <li><b>Role</b> – trusted AWS entity with the Developer permissions policies</li>
  <li><b>Policy</b> – associated with the role, gives access to specific services and operations</li>
</ul>

<h3>3. Interacting with AWS services</h3>
<ul>
  <li>All AWS services are managed through a common, <b>REST-like API</b>. Four ways: call the API directly, AWS Management Console (web GUI; new features may not be in the console at launch), AWS CLI (open source command-line tool), AWS SDKs (language packages).</li>
  <li>Access modes are interchangeable (e.g. create an EC2 instance with SDK, describe it with the CLI, terminate it from the console).</li>
  <li><b>Command line tools</b>: AWS CLI (Windows, macOS, Linux/Unix), AWS Tools for PowerShell, AWS SAM Local, AWS Amplify.</li>
</ul>
<h4>AWS CloudShell</h4>
<ul>
  <li>Browser-based CLI access, available from the AWS Management Console.</li>
  <li><b>Pre-authenticated</b> session, pre-installed with AWS CLI, SDKs and other tools.</li>
  <li><b>No cost</b>; <b>1 GB of storage per Region</b>.</li>
</ul>

<h3>4. AWS SDKs</h3>
<ul>
  <li>AWS SDK for: C++, Go, Java, JavaScript (browser & Node.js), .NET/Xamarin, PHP, <b>Python (Boto3)</b>, Ruby.</li>
  <li>AWS Mobile SDK: Android, iOS, .NET/Xamarin, Unity. AWS IoT Device SDK: Arduino Yún, C++, Embedded C, Java, JavaScript, Python.</li>
  <li><b>Endpoint</b> = URL that is the entry point for a web service.</li>
  <li>Flow: app uses SDK → SDK builds an HTTP(S) request → sent to the service endpoint → service responds → SDK processes the response and passes it back to the app.</li>
</ul>
<table>
<tr><th>Client API (low-level)</th><th>Resource API (high-level)</th></tr>
<tr><td>One <b>method per service operation</b>; objects for request and result data. <code>boto3.client('s3')</code> → <code>list_objects_v2(Bucket=...)</code> returns a dict; more calls may be needed.</td><td>One <b>class per conceptual resource</b>; object-oriented, higher-level abstraction. <code>boto3.resource('s3')</code> → <code>Bucket(...).objects.all()</code>.</td></tr>
</table>
<h4>Regions</h4>
<ul>
  <li>Specify the Region when you instantiate the client: <code>boto3.client('dynamodb', region_name='us-east-1')</code>.</li>
  <li>Default Region comes from AWS config file <code>~/.aws/config</code> (<code>[default] region=us-west-2 output=json</code>).</li>
</ul>
<h4>Handling exceptions</h4>
<ul>
  <li><b>HTTP 400-series = client error</b> → handle the error in your application.</li>
  <li><b>HTTP 500-series = server error</b> → retry the operation.</li>
  <li>Error response elements: <b>Error</b> (container), <b>Code</b> (uniquely identifies the error, e.g. NoSuchKey), <b>Message</b> (generic English description), <b>Resource</b> (resource involved), <b>RequestId</b> (ID of the request).</li>
  <li>SDK exceptions: Java & .NET → <code>AmazonServiceException</code> (or subclass) and <code>AmazonClientException</code>; Python → <code>botocore.exceptions.ClientError</code>; JavaScript → asynchronous callback <code>function(error, data){...}</code>.</li>
</ul>

<h3>5. Amazon Q Developer</h3>
<ul>
  <li><b>Generative AI-powered coding assistant</b> for developers and IT professionals.</li>
  <li>Generates code; helps understand, build, extend and operate AWS apps; <b>scans code for security vulnerabilities</b>; secure and private by design.</li>
</ul>
<table>
<tr><th>SDLC stage</th><th>How Q Developer helps</th></tr>
<tr><td>Plan</td><td>Ask questions, contextual guidance, explain code (conversational coding)</td></tr>
<tr><td>Create</td><td>In-line code recommendations, implement features from comments/prompts, chat in the IDE</td></tr>
<tr><td>Test & secure</td><td>Generate unit tests, scan code for vulnerabilities with remediation suggestions</td></tr>
<tr><td>Operate</td><td>Troubleshoot errors, troubleshoot network connectivity with <b>VPC Reachability Analyzer</b></td></tr>
<tr><td>Maintain & modernize</td><td>Modernize code with <b>Amazon Q Developer Agent for code transformation</b></td></tr>
</table>
<p>Feature workflow (<code>/dev</code>): choose Q icon → send prompt → receive plan → Generate code → review changes → Insert code → run validation.</p>
<div class="tip"><b>Exam tip:</b> "Inexperienced developer needs a code assistant" → <b>Amazon Q Developer</b>. "Browser-based, pre-authenticated CLI" → <b>CloudShell</b>. 4xx → fix in app, 5xx → retry.</div>
`,
  questions: [
    // SDLC
    { t: 'mcq', i: 1, c: 'SDLC', q: 'What is the correct order of the general SDLC steps?', o: ['Plan, Define, Design, Develop, Deploy, Maintain', 'Define, Plan, Develop, Design, Maintain, Deploy', 'Design, Plan, Define, Develop, Deploy, Maintain', 'Plan, Design, Define, Deploy, Develop, Maintain'], e: 'SDLC: plan → define → design → develop → deploy → maintain.' },
    { t: 'mcq', c: 'SDLC', q: 'Which phase of the SDLC does this course mainly focus on?', o: ['Develop', 'Plan', 'Define', 'Maintain'], e: 'The course primarily focuses on the Develop phase and briefly touches on Deploy.' },
    { t: 'mcq', c: 'SDLC', q: 'Which of the following is NOT listed as an activity in the SDLC Develop phase?', o: ['Write the business feasibility study', 'Install new components and programs', 'Train users', 'Test performance'], e: 'Develop phase: develop the new system, install components, train users, test performance, make adjustments.' },
    { t: 'tf', c: 'SDLC', q: 'Enterprises want to deliver software quickly, securely and reliably with zero tolerance for outages.', a: true, e: 'That is the challenge of software delivery: bridge the gap between stability of operations and rapid feature development.' },
    { t: 'mcq', i: 1, c: 'SDLC methodologies', q: 'Which SDLC methodology is sequential, where each phase must be completed before the next begins?', o: ['Waterfall', 'Agile', 'Scrum', 'Sprint'], e: 'Waterfall is the classic, sequential approach.' },
    { t: 'mcq', i: 1, c: 'SDLC methodologies', q: 'In agile development, short iterative time periods of work are called:', o: ['Sprints', 'Stages', 'Phases', 'Waterfalls'], e: 'Agile work is done in sprints that typically last 1–4 weeks.' },
    { t: 'mcq', c: 'SDLC methodologies', q: 'How long does an agile sprint typically last?', o: ['1–4 weeks', '1–2 days', '3–6 months', '1 year'], e: 'Sprints typically last 1 to 4 weeks.' },
    { t: 'tf', c: 'SDLC methodologies', q: 'With the waterfall methodology, product teams receive customer feedback very quickly after each iteration.', a: false, e: 'In waterfall, teams might not hear back from customers for months. Fast feedback is an agile characteristic.' },
    { t: 'tf', c: 'SDLC methodologies', q: 'Minimum viable product (MVP), release candidate and velocity are concepts that come from the agile approach.', a: true, e: 'These concepts are derived from agile.' },
    { t: 'mcq', c: 'SDLC methodologies', q: 'Which of these is an example of an agile methodology?', o: ['Scrum', 'Waterfall', 'Boto3', 'CloudShell'], e: 'Scrum, Crystal methods and DSDM are agile methodologies.' },
    { t: 'match', i: 1, c: 'Software phases', q: 'Match each activity to its software development phase.', p: [['Check in source code and peer-review it', 'Code'], ['Compile code, run unit tests and style checkers', 'Build'], ['Load tests, UI tests, penetration tests', 'Test'], ['Push code to production environments', 'Deploy'], ['Monitor code in production for unusual activity', 'Maintain']], e: 'Code → Build → Test → Deploy → Maintain.' },
    { t: 'mcq', c: 'Software phases', q: 'Creating container images and gathering code metrics happen in which phase?', o: ['Build', 'Code', 'Test', 'Maintain'], e: 'Build: compile, unit tests, style checkers, code metrics, container images.' },
    { t: 'mcq', c: 'Software phases', q: 'Penetration tests and integration tests with other systems belong to which phase?', o: ['Test', 'Build', 'Deploy', 'Code'], e: 'The Test phase includes integration, load, UI and penetration tests.' },
    { t: 'tf', c: 'Software phases', q: 'Unit tests are performed in the Deploy phase.', a: false, e: 'Unit tests run in the Build phase, along with compiling, style checks, metrics and container images.' },

    // Getting started
    { t: 'mcq', i: 1, c: 'Getting started', q: 'What is the correct order of steps to get started developing on AWS?', o: ['Create an AWS account → Set up permissions (IAM) → Install development environment → Interact with AWS services', 'Install development environment → Create AWS account → Interact with services → Set up permissions', 'Set up permissions → Create AWS account → Interact with services → Install IDE', 'Interact with services → Install IDE → Create AWS account → Set up permissions'], e: 'Account → IAM permissions → IDE/toolkits → interact via SDK/CLI.' },
    { t: 'match', i: 1, c: 'Getting started', q: 'Match the IAM concept with what it answers.', p: [['Identity (authentication)', 'Who can use your AWS resources'], ['Access management (authorization)', 'What resources they can use and in what ways']], e: 'Authentication = who; authorization = what and how.' },
    { t: 'match', c: 'Getting started', q: 'Match each item from the IAM example with its description.', p: [['User', 'John Doe, who has AWS credentials'], ['Group', 'Developer group that John belongs to'], ['Role', 'Trusted AWS entity with Developer permissions policies'], ['Policy', 'Gives access to specific services and operations']], e: 'User, group, role and policy from the John Doe example.' },
    { t: 'mcq', c: 'Getting started', q: 'Which of the following is NOT listed as an IDE supported by AWS IDE Toolkits?', o: ['Notepad', 'PyCharm', 'Visual Studio Code', 'IntelliJ IDEA'], e: 'Toolkits: Eclipse, IntelliJ IDEA, PyCharm, Visual Studio, VS Code, Azure DevOps, Rider.' },
    { t: 'tf', c: 'Getting started', q: 'AWS IDE Toolkits are available only for Microsoft Visual Studio Code.', a: false, e: 'Toolkits exist for Eclipse, IntelliJ IDEA, PyCharm, Rider, Visual Studio, VS Code and Azure DevOps.' },
    { t: 'mcq', i: 1, c: 'Interacting with AWS', q: 'Which of the following is a way to interact with AWS services programmatically?', o: ['AWS SDKs', 'AWS Management Console', 'Printed documentation', 'AWS Support tickets'], e: 'Programmatic access: AWS CLI, AWS SDKs, and service APIs. The console is the graphical way.' },
    { t: 'tf', i: 1, c: 'Interacting with AWS', q: 'All AWS services are managed through a common, REST-like API.', a: true, e: 'Console, CLI and SDKs are all built on top of the service APIs.' },
    { t: 'tf', c: 'Interacting with AWS', q: 'New AWS features are always available in the AWS Management Console on the day they launch.', a: false, e: 'Occasionally new features are not available in the console when they initially launch.' },
    { t: 'tf', c: 'Interacting with AWS', q: 'You can create an EC2 instance with an SDK, describe it with the AWS CLI and terminate it from the console.', a: true, e: 'Access modes are interchangeable.' },
    { t: 'mcq', c: 'Command line tools', q: 'Which of these is NOT one of the command line tools listed for AWS?', o: ['Amazon Q Developer', 'AWS Tools for PowerShell', 'AWS SAM Local', 'AWS Amplify'], e: 'Command line tools: AWS CLI, AWS Tools for PowerShell, AWS SAM Local, AWS Amplify.' },
    { t: 'tf', c: 'Command line tools', q: 'The AWS CLI is only available for Windows.', a: false, e: 'The AWS CLI runs on Windows, macOS and Linux or Unix.' },
    { t: 'mcq', i: 1, c: 'CloudShell', q: 'Which service provides pre-authenticated, browser-based CLI access from the AWS Management Console?', o: ['AWS CloudShell', 'AWS Cloud9', 'Amazon Q Developer', 'AWS SAM Local'], e: 'CloudShell: browser CLI, pre-authenticated, pre-installed tools, no cost.' },
    { t: 'mcq', i: 1, c: 'CloudShell', q: 'How much persistent storage does AWS CloudShell provide?', o: ['1 GB per Region', '5 GB per account', '10 GB per Region', 'Unlimited'], e: 'CloudShell gives 1 GB of storage per Region.' },
    { t: 'tf', c: 'CloudShell', q: 'AWS CloudShell has an hourly cost.', a: false, e: 'CloudShell is available at no cost.' },
    { t: 'tf', c: 'CloudShell', q: 'AWS CloudShell comes pre-installed with the AWS CLI and SDKs.', a: true, e: 'It is pre-installed with the AWS CLI, SDKs and other tools.' },

    // SDKs
    { t: 'mcq', i: 1, c: 'AWS SDKs', q: 'What is the name of the AWS SDK for Python?', o: ['Boto3', 'PyAWS', 'Botocore CLI', 'AWS-Py'], e: 'The AWS SDK for Python is Boto3.' },
    { t: 'mcq', c: 'AWS SDKs', q: 'Which SDK family includes support for Android, iOS and Unity?', o: ['AWS Mobile SDK', 'AWS IoT Device SDK', 'AWS SDK for Go', 'AWS Tools for PowerShell'], e: 'Mobile SDK: Android, iOS, .NET/Xamarin, Unity.' },
    { t: 'mcq', c: 'AWS SDKs', q: 'The AWS IoT Device SDK supports which of the following?', o: ['Arduino Yún and Embedded C', 'Unity and iOS', 'Xamarin and Android only', 'PowerShell'], e: 'IoT Device SDK: Arduino Yún, C++, Embedded C, Java, JavaScript, Python.' },
    { t: 'mcq', i: 1, c: 'AWS SDKs', q: 'In AWS development, what is an endpoint?', o: ['A URL that is an entry point for a web service', 'The last line of a program', 'A type of IAM policy', 'A CloudShell storage volume'], e: 'Endpoint: URL that is an entry point for a web service.' },
    { t: 'tf', c: 'AWS SDKs', q: 'The AWS SDK constructs an HTTP(S) request, sends it to the service endpoint, and processes the response for the application.', a: true, e: 'That is the flow of developing with AWS SDKs.' },
    { t: 'match', i: 1, c: 'Client vs Resource API', q: 'Match each SDK API style with its characteristic.', p: [['Client API', 'One method per service operation'], ['Resource API', 'One class per conceptual resource'], ['boto3.client("s3")', 'Low-level calls that return dictionaries'], ['boto3.resource("s3")', 'Higher-level, object-oriented abstraction']], e: 'Client = low-level, method per operation; Resource = high-level, object-oriented.' },
    { t: 'mcq', c: 'Client vs Resource API', q: 'Which statement about the boto3 Resource API is correct?', o: ['It provides a higher-level, object-oriented abstraction than service clients', 'It has exactly one method per service operation', 'It always returns raw dictionaries', 'It cannot be used with Amazon S3'], e: 'Resources represent an object-oriented interface with a higher-level abstraction.' },
    { t: 'mcq', i: 1, c: 'Regions', q: 'Where is the default Region for the AWS SDK/CLI specified on Linux/macOS?', o: ['~/.aws/config', '~/.aws/region.txt', '/etc/aws/default', 'In the IAM policy'], e: 'The default Region is set in the AWS config file ~/.aws/config.' },
    { t: 'mcq', i: 1, c: 'Exceptions', q: 'Your SDK call returns an HTTP 500-series error. What should you do?', o: ['Retry the operation', 'Fix the request in your application code', 'Delete the resource', 'Change the Region'], e: '500-series = server error → retry. 400-series = client error → handle in the app.' },
    { t: 'mcq', i: 1, c: 'Exceptions', q: 'Your SDK call returns an HTTP 400-series error. What does it indicate?', o: ['A client error that should be handled in the application', 'A server error that should be retried', 'A successful request', 'A throttled CloudShell session'], e: '400-series errors are client errors.' },
    { t: 'match', c: 'Exceptions', q: 'Match each error response element with its description.', p: [['Code', 'String that uniquely identifies an error condition'], ['Message', 'Generic description of the error in English'], ['Resource', 'The resource involved in the error'], ['RequestId', 'ID of the request associated with the error'], ['Error', 'Container for all error elements']], e: 'From the S3 NoSuchKey XML error example.' },
    { t: 'tf', c: 'Exceptions', q: 'In an S3 error response, the RequestId element describes the error in plain English.', a: false, e: 'Message is the English description; RequestId is the ID of the request.' },

    // Amazon Q
    { t: 'mcq', i: 1, c: 'Amazon Q Developer', q: 'A developer with little coding and AWS experience needs a code assistant to write a new application. Which tool fits best?', o: ['Amazon Q Developer, using its chat feature when needed', 'The AWS CLI, referencing documentation when needed', 'A GitHub repository of pre-built code', 'The AWS SDK, referencing AWS white papers'], e: 'This is the sample exam question; the answer is Amazon Q Developer (C).' },
    { t: 'mcq', c: 'Amazon Q Developer', q: 'What is Amazon Q Developer?', o: ['A generative AI-powered coding assistant', 'A managed NoSQL database', 'A browser-based shell', 'A container registry'], e: 'Amazon Q Developer is a generative AI coding assistant.' },
    { t: 'match', i: 1, c: 'Amazon Q Developer', q: 'Match each SDLC stage to how Amazon Q Developer supports it.', p: [['Plan', 'Ask questions and get explanations of code'], ['Create', 'In-line code recommendations and chat in the IDE'], ['Test and secure', 'Generate unit tests and scan code for vulnerabilities'], ['Operate', 'Troubleshoot errors and network connectivity with VPC Reachability Analyzer'], ['Maintain and modernize', 'Agent for code transformation']], e: 'Q Developer spans the whole SDLC.' },
    { t: 'tf', c: 'Amazon Q Developer', q: 'Amazon Q Developer can scan project code for security vulnerabilities and suggest remediations.', a: true, e: 'Test & secure: scan code for vulnerabilities with remediation suggestions.' },
    { t: 'mcq', c: 'Amazon Q Developer', q: 'Which tool does Amazon Q Developer use to troubleshoot network connectivity?', o: ['VPC Reachability Analyzer', 'AWS X-Ray', 'Amazon CloudWatch', 'AWS WAF'], e: 'Operate: troubleshoot network connectivity with VPC Reachability Analyzer.' },
    { t: 'mcq', c: 'Amazon Q Developer', q: 'After Amazon Q Developer creates a plan for a new feature, what is the next step in the workflow?', o: ['Choose Generate code', 'Run the unit tests', 'Deploy to production', 'Choose Insert code'], e: 'Prompt → plan → Generate code → review → Insert code → validate.' },
    { t: 'tf', c: 'Amazon Q Developer', q: 'Amazon Q Developer is designed only for business analysts and cannot be used inside an IDE.', a: false, e: 'It is designed for developers and IT professionals and supports chat in the IDE.' }
  ]
});
