// Module 4: Securing Access to Cloud Resources (IAM)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm4',
  num: 4,
  title: 'Securing Access to Cloud Resources (IAM)',
  short: 'IAM & Security',
  icon: '🔐',
  study: `
<h3>1. Shared responsibility model</h3>
<ul>
  <li>Security and compliance are a <b>shared responsibility</b> between AWS and the customer.</li>
  <li><b>AWS = security OF the cloud</b>; <b>Customer = security IN the cloud</b>.</li>
  <li>Objectives: reduce the customer's operational burden; give the customer flexibility and control.</li>
</ul>
<table>
<tr><th>Customer (IN the cloud)</th><th>AWS (OF the cloud)</th></tr>
<tr><td>Customer data<br>Platform, applications, identity & access management<br>Operating system, network & firewall configuration<br>Client-side data encryption, data integrity, authentication<br>Server-side encryption (file system and data)<br>Network traffic protection (encryption, integrity, identity)</td>
<td>Software: compute, storage, databases, networking<br>Hardware / AWS Global Infrastructure<br>Regions, Availability Zones, edge locations</td></tr>
</table>
<p>Customer examples: <b>guest OS configuration</b>, <b>application-level security</b>, <b>security group configuration</b>.</p>

<h3>2. AWS IAM</h3>
<ul>
  <li>Securely controls individual and group access to AWS resources; integrates with other services.</li>
  <li>Supports <b>federated identity</b>, <b>granular permissions</b>, and <b>MFA</b>.</li>
  <li><b>Authentication</b> – who is requesting access? Established with credentials. Requesters (people or apps) are called <b>principals</b>.</li>
  <li><b>Authorization</b> – what are they allowed to do? IAM checks the relevant <b>policies</b> to allow or deny.</li>
</ul>
<table>
<tr><th>Entity</th><th>Description</th></tr>
<tr><td>IAM user</td><td>Represents a person or application; has <b>permanent (long-term) credentials</b> until rotated.</td></tr>
<tr><td>IAM group</td><td>Collection of users; grant the same permissions to many users. Members <b>inherit</b> group permissions.</td></tr>
<tr><td>IAM role</td><td>Identity with permission policies but <b>no long-term credentials</b>; whoever assumes it gets <b>temporary credentials</b>.</td></tr>
<tr><td>IAM policy</td><td>Document that explicitly lists permissions; attach to users, groups, roles.</td></tr>
</table>
<p>Best practice for long-term access: attach policies to <b>groups</b> and put users into groups.</p>

<h3>3. Authenticating with IAM</h3>
<ul>
  <li>Authentication scenarios (photo app): <b>AWS account</b> authentication (developer), <b>application</b> authentication (user signs in), <b>resource</b> authentication (app uploads to S3), <b>database</b> authentication (backend updates RDS).</li>
  <li><b>Console access</b>: user name + password (+ optional MFA).</li>
  <li><b>Programmatic access</b> (CLI, API, SDK): <b>access key ID</b> (e.g. AKIAIOSFODNN7EXAMPLE) + <b>secret access key</b> (+ optional MFA).</li>
  <li><b>MFA</b>: extra layer on top of user name/password; prompts for a code; <b>hardware or virtual</b> device; enable for console users and API users (API users need <b>temporary security credentials</b>).</li>
</ul>
<h4>IAM roles</h4>
<ul>
  <li>Provide <b>temporary</b> security credentials; not uniquely associated with one person; <b>assumable by a person, application or service</b>; often used to <b>delegate access</b>.</li>
  <li>Use cases: <b>apps on EC2</b>, <b>cross-account access</b> for an IAM user, <b>mobile apps</b>.</li>
</ul>
<h4>Credentials in development</h4>
<ul>
  <li>Use AWS Toolkits in your IDE; use AWS-managed temporary credentials for IDEs on EC2.</li>
  <li>Credentials file: Linux/macOS/Unix <code>~/.aws/credentials</code>; Windows <code>C:\\Users\\USERNAME\\.aws\\credentials</code>. Profiles: <code>boto3.Session(profile_name='prod')</code>.</li>
  <li><b>Never store credentials in code</b> or public places; use credential files. Prefer <b>roles with temporary credentials</b> for EC2 and mobile apps.</li>
</ul>

<h3>4. Authorizing with IAM</h3>
<table>
<tr><th>Identity-based policies</th><th>Resource-based policies</th></tr>
<tr><td>Attached to a user/group/role. Answers: <i>what does this identity have access to?</i></td><td>Attached to a resource (e.g. S3 bucket). Answers: <i>who has access to this resource?</i> Can grant <b>cross-account</b> access (e.g. Account A's bucket policy grants Account B).</td></tr>
</table>
<table>
<tr><th>Managed policies</th><th>Inline policies</th></tr>
<tr><td>Standalone identity-based policies; attach to <b>multiple</b> users/groups/roles; reusability, central change management, <b>versioning & rollback</b>, delegated permissions management.</td><td>Embedded in a single principal entity (user, group or role); strict <b>1:1</b> relationship. (The deck labels them as resource-based.)</td></tr>
</table>
<h4>Policy evaluation logic</h4>
<ol>
  <li>By default, all requests are <b>denied</b> (implicit deny).</li>
  <li>An <b>explicit allow</b> overrides the default deny.</li>
  <li>An <b>explicit deny</b> overrides any allow. Always.</li>
  <li>Order of evaluation doesn't matter; all policies are evaluated; result is allow or deny.</li>
</ol>
<p>Policy elements: <code>Version</code> ("2012-10-17"), <code>Statement</code>, <code>Effect</code> (Allow/Deny), <code>Action</code>, <code>Resource</code> / <code>NotResource</code>, <code>Principal</code>, <code>Condition</code>. Wildcard <code>*</code> = all. The Allow + Deny with <code>NotResource</code> example ensures the entity can't act on any DynamoDB table / S3 bucket except those listed.</p>
<h4>Principle of least privilege</h4>
<p>Grant the <b>minimum</b> permissions needed for the job, then add access as needed.</p>
<h4>IAM scenario (Sofía)</h4>
<ul>
  <li>The <b>root user</b> has full access to everything (incl. billing) and its privileges can't be controlled → don't use it for day-to-day tasks; create an IAM user instead and lock away root credentials.</li>
  <li>Admins group; Mateo is in Admins but has an <b>explicit deny</b> on creating groups/attaching policies → the deny wins.</li>
  <li>DBAdmins group gets only DynamoDB (least privilege). Developers group; extra user-level deny where group is too permissive.</li>
  <li>Temporary needs (RDS access for Wei & Ana, contractor) → <b>IAM roles</b> (TempDBRole, TempDevRole).</li>
</ul>
<div class="tip"><b>Exam tip:</b> Access key stored on an AMI/in a file → replace with an <b>IAM role</b> attached to the EC2 instances. Explicit deny always wins.</div>
`,
  questions: [
    { t: 'mcq', i: 1, c: 'Shared responsibility', q: 'Under the shared responsibility model, AWS is responsible for:', o: ['Security OF the cloud', 'Security IN the cloud', 'Customer data', 'Security group configuration'], e: 'AWS: security of the cloud. Customer: security in the cloud.' },
    { t: 'match', i: 1, c: 'Shared responsibility', q: 'Match each item with who is responsible for it.', p: [['Customer data', 'Customer'], ['Regions, Availability Zones and edge locations', 'AWS'], ['Guest OS and firewall configuration', 'Customer'], ['Physical hardware', 'AWS']], e: 'Customer handles data, OS, network config, apps, IAM. AWS handles hardware and global infrastructure.' },
    { t: 'mcq', i: 1, c: 'Shared responsibility', q: 'Which of these is a CUSTOMER responsibility?', o: ['Security group configuration', 'Physical security of data centers', 'Availability Zone infrastructure', 'Edge location hardware'], e: 'Customer examples: guest OS config, application-level security, security group config.' },
    { t: 'tf', i: 1, c: 'Shared responsibility', q: 'Server-side encryption of file systems and data is the customer\'s responsibility.', a: true, e: 'It appears on the customer (security IN the cloud) side.' },
    { t: 'tf', c: 'Shared responsibility', q: 'Identity and access management configuration is AWS\'s responsibility.', a: false, e: 'Platform, applications and identity & access management are customer responsibilities.' },
    { t: 'mcq', c: 'Shared responsibility', q: 'What are the objectives of the shared responsibility model?', o: ['Reduce the customer\'s operational burden and give the customer flexibility and control', 'Make AWS responsible for all customer data', 'Remove the need for IAM', 'Make customers manage physical hardware'], e: 'Two objectives listed on the slide.' },
    { t: 'tf', c: 'Shared responsibility', q: 'Networking traffic protection (encryption, integrity, identity) is the customer\'s responsibility.', a: true, e: 'It is listed on the customer side.' },

    // IAM intro
    { t: 'mcq', c: 'IAM', q: 'Which of these is NOT a listed feature of IAM?', o: ['Automatic code generation', 'Federated identity management', 'Granular permissions', 'Multi-factor authentication'], e: 'IAM: integrates with services, federated identity, granular permissions, MFA.' },
    { t: 'match', i: 1, c: 'Security fundamentals', q: 'Match the security concept to its question.', p: [['Authentication', 'Who is requesting access?'], ['Authorization', 'What should they be allowed to do?'], ['Principal', 'A person or application making a request']], e: 'Authentication establishes identity; authorization uses policies; requesters are principals.' },
    { t: 'tf', c: 'Security fundamentals', q: 'Authentication decides what actions a principal is allowed to perform.', a: false, e: 'Authentication establishes who; authorization decides what they can do.' },
    { t: 'match', i: 1, c: 'IAM entities', q: 'Match each IAM entity with its description.', p: [['IAM user', 'Person or application with long-term credentials'], ['IAM group', 'Collection of users sharing permissions'], ['IAM role', 'Identity that provides temporary credentials when assumed'], ['IAM policy', 'Document that lists permissions']], e: 'Users, groups, roles, policies.' },
    { t: 'tf', i: 1, c: 'IAM entities', q: 'An IAM role has long-term credentials such as a password or access keys.', a: false, e: 'Roles have no long-term credentials; assuming a role gives temporary credentials.' },
    { t: 'tf', c: 'IAM entities', q: 'Users added to an IAM group do not receive the permissions attached to that group.', a: false, e: 'Group members inherit the group\'s permissions.' },
    { t: 'mcq', c: 'IAM entities', q: 'What is the recommended way to configure long-term access for many users?', o: ['Attach policies to IAM groups and add users to the groups', 'Attach an inline policy to every user', 'Share the root user credentials', 'Create one IAM user for the whole team'], e: 'Best practice: attach policies to groups, assign users to groups.' },

    // Authentication
    { t: 'match', i: 1, c: 'Authentication', q: 'Match the photo-app step to the authentication type it needs.', p: [['Developer builds the app in the AWS account', 'AWS account authentication'], ['User signs in to the photo app', 'Application authentication'], ['App uploads the photo to S3', 'Resource authentication'], ['Backend job updates Amazon RDS', 'Database authentication']], e: 'Four authentication scenarios from the mobile photo app.' },
    { t: 'match', i: 1, c: 'IAM credentials', q: 'Match the access type to its credentials.', p: [['AWS Management Console', 'User name and password'], ['AWS CLI / SDK / API', 'Access key ID and secret access key']], e: 'Console: user name/password. Programmatic: access keys. MFA optional on both.' },
    { t: 'mcq', c: 'IAM credentials', q: 'Which value looks like an AWS access key ID?', o: ['AKIAIOSFODNN7EXAMPLE', 'UtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', 'arn:aws:iam::123:role/x', 'us-east-1'], e: 'Access key IDs start with AKIA; the long one is a secret key example.' },
    { t: 'mcq', i: 1, c: 'MFA', q: 'What does multi-factor authentication (MFA) add?', o: ['An extra layer of protection on top of the user name and password', 'Permanent credentials for applications', 'Encryption of S3 objects', 'Automatic least privilege'], e: 'MFA prompts users for an authentication code in addition to their password.' },
    { t: 'tf', c: 'MFA', q: 'MFA can only be used with a physical hardware token.', a: false, e: 'MFA can be hardware-based or a virtual device.' },
    { t: 'tf', c: 'MFA', q: 'Enabling MFA for AWS API users requires temporary security credentials.', a: true, e: 'Slide: AWS API users (requires temporary security credentials).' },
    { t: 'mcq', i: 1, c: 'IAM roles', q: 'Which is a characteristic of an IAM role?', o: ['It is assumable by a person, application or service', 'It is uniquely associated with one person', 'It provides permanent credentials', 'It can only be used by the root user'], e: 'Roles: temporary credentials, not tied to one person, assumable, used to delegate access.' },
    { t: 'mcq', i: 1, c: 'IAM roles', q: 'Which is NOT a common use case for IAM roles?', o: ['Storing the root user password', 'Application running on Amazon EC2', 'Cross-account access for an IAM user', 'Mobile applications'], e: 'Role use cases: EC2 apps, cross-account access, mobile apps.' },
    { t: 'mcq', i: 1, c: 'IAM roles', q: 'A company stores an access key in a text file on a custom AMI so EC2 instances can access DynamoDB. What is the more secure solution?', o: ['Create an IAM role with permissions to the table and launch the instances with the role', 'Put the access key in an S3 bucket and retrieve it on boot', 'Pass the access key through instance user data', 'Get the key from a key server in a private subnet'], e: 'Sample exam question: answer D, use an IAM role.' },
    { t: 'mcq', c: 'Credentials file', q: 'On Linux or macOS, where is the AWS credentials file?', o: ['~/.aws/credentials', '~/.aws/config.json', '/etc/aws/keys', '~/credentials.aws'], e: 'Linux/macOS/Unix: ~/.aws/credentials. Windows: C:\\Users\\USERNAME\\.aws\\credentials.' },
    { t: 'tf', i: 1, c: 'Credentials file', q: 'It is acceptable to hard-code AWS credentials in application code if the repository is private.', a: false, e: 'Avoid storing credentials in code or public places; use credential files or roles.' },
    { t: 'tf', c: 'Credentials file', q: 'For IDEs installed on an EC2 instance, you can use AWS managed temporary credentials.', a: true, e: 'Slide: use AWS managed temporary credentials for IDEs on EC2.' },

    // Authorization
    { t: 'match', i: 1, c: 'Policy types', q: 'Match each policy type to the question it answers.', p: [['Identity-based policy', 'What does a particular identity have access to?'], ['Resource-based policy', 'Who has access to a particular resource?']], e: 'Identity-based attach to identities; resource-based attach to resources.' },
    { t: 'mcq', i: 1, c: 'Policy types', q: 'Account A wants to let Account B access its S3 bucket. Which policy type does Account A use?', o: ['A resource-based (bucket) policy that names Account B', 'An identity-based policy in Account A', 'An inline policy on Account A\'s root user', 'An SCP in Account B'], e: 'Cross-account resource-based policy; Account B then creates an IAM user policy for its users.' },
    { t: 'match', i: 1, c: 'Managed vs inline', q: 'Match each policy kind with its characteristic.', p: [['Managed policy', 'Can be attached to multiple users, groups and roles'], ['Inline policy', 'Strict 1:1 relationship with one entity']], e: 'Managed = reusable; inline = embedded 1:1.' },
    { t: 'mcq', c: 'Managed vs inline', q: 'Which is a benefit of managed policies?', o: ['Versioning and rollback', 'Strict 1:1 relationship with a principal', 'They are deleted with the user', 'They cannot be reused'], e: 'Managed: reusability, central change management, versioning and rollback, delegation.' },
    { t: 'tf', c: 'Managed vs inline', q: 'An inline policy can be attached to many users, groups and roles at the same time.', a: false, e: 'Inline policies have a strict 1:1 relationship; managed policies are reusable.' },
    { t: 'mcq', i: 1, c: 'Evaluation logic', q: 'By default, how does IAM treat a request that no policy mentions?', o: ['It is denied', 'It is allowed', 'It is allowed for 24 hours', 'It is sent to the root user for approval'], e: 'All requests are denied by default (implicit deny).' },
    { t: 'mcq', i: 1, c: 'Evaluation logic', q: 'A group policy allows s3:* but a user policy explicitly denies s3:DeleteObject. What happens when the user tries to delete an object?', o: ['Denied, because an explicit deny overrides any allow', 'Allowed, because group policies take precedence', 'Allowed, because the allow is evaluated first', 'It depends on the order the policies were created'], e: 'Explicit deny always overrides allow; evaluation order doesn\'t matter.' },
    { t: 'tf', i: 1, c: 'Evaluation logic', q: 'The order in which IAM policies are evaluated affects the final decision.', a: false, e: 'Order has no effect; all policies are evaluated.' },
    { t: 'tf', c: 'Evaluation logic', q: 'An explicit allow overrides the default deny.', a: true, e: 'Default deny < explicit allow < explicit deny.' },
    { t: 'mcq', i: 1, c: 'Least privilege', q: 'What is the principle of least privilege?', o: ['Grant only the minimum permissions needed for the job, then add more as needed', 'Give all developers administrator access', 'Use the root user only for daily tasks', 'Deny everything permanently'], e: 'Start with minimum permissions and grant more as needed.' },
    { t: 'tf', i: 1, c: 'IAM scenario', q: 'AWS recommends using the account root user credentials for day-to-day tasks.', a: false, e: 'Create IAM users and keep root credentials secure.' },
    { t: 'tf', c: 'IAM scenario', q: 'You cannot control the privileges of the AWS account root user.', a: true, e: 'The root user has full access and its privileges cannot be controlled.' },
    { t: 'mcq', c: 'IAM scenario', q: 'Mateo is in the Admins group but has a user policy that explicitly denies creating IAM groups. What can he do?', o: ['Everything Admins can do except creating groups and attaching policies to them', 'Everything, including creating groups', 'Nothing at all', 'Only read-only actions'], e: 'His explicit deny overrides that part of the group allow.' },
    { t: 'mcq', i: 1, c: 'IAM scenario', q: 'Two DBAdmins members temporarily need Amazon RDS access, but the rest of the group doesn\'t. What should Sofía use?', o: ['An IAM role (TempDBRole) with RDS access for those users', 'Add RDS full access to the DBAdmins group', 'Share the root user', 'Create a new AWS account'], e: 'Roles are ideal for temporary, delegated access.' },
    { t: 'tf', c: 'IAM scenario', q: 'You can attach a policy directly to a user to deny actions that the user\'s group would otherwise allow.', a: true, e: 'Done for Developers group members whose group was too permissive.' },
    { t: 'tf', c: 'IAM policies', q: 'IAM policies can be attached to IAM users, IAM groups, or IAM roles.', a: true, e: 'Section 5 takeaway.' }
  ]
});
