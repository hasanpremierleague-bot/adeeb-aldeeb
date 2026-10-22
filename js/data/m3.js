// Module 3: Developing Storage Solutions (Amazon S3)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm3',
  num: 3,
  title: 'Developing Storage Solutions (Amazon S3)',
  scope: 'Slides 7–34',
  short: 'Amazon S3',
  icon: '🪣',
  study: `
<h3>1. Amazon S3 basics</h3>
<ul>
  <li><b>Object storage</b> service offering scalability, data availability, security and performance.</li>
  <li>Designed for <b>99.999999999% (11 nines) durability</b>.</li>
  <li>Easy-to-use management features; can <b>respond to event triggers</b>.</li>
  <li><b>Use cases</b>: content storage & distribution, backup/restore & archive, data lakes & big data analytics, disaster recovery (DR), static website hosting.</li>
</ul>
<h4>Components</h4>
<ul>
  <li><b>Bucket</b> – container for objects. Each bucket is <b>Regional</b>, with a Region-specific endpoint: <code>https://s3-&lt;region&gt;.amazonaws.com/&lt;bucket-name&gt;/</code></li>
  <li><b>Object</b> – a file + metadata, referenced by URL: <code>.../&lt;bucket-name&gt;/&lt;object-key&gt;</code></li>
  <li><b>Key</b> – identifies the object in the bucket (e.g. <code>preview.mp4</code>).</li>
</ul>

<h3>2. Creating buckets</h3>
<ul>
  <li>Bucket names must be <b>globally unique</b>.</li>
  <li><b>3–63 characters</b>; only <b>lowercase letters, numbers and hyphens (-)</b>; <b>no uppercase, no underscores</b>.</li>
  <li>Choosing a Region – deciding factors: <b>latency, cost, regulatory requirements</b>.</li>
</ul>
<h4>Bucket URLs</h4>
<ul>
  <li><b>Virtual-host-style URL</b>: bucket name is part of the domain. <code>http://&lt;bucket&gt;.s3-&lt;region&gt;.amazonaws.com/&lt;key&gt;</code></li>
  <li><b>Static website endpoint</b> (must be enabled): <code>http://&lt;bucket&gt;.s3-website-&lt;region&gt;.amazonaws.com</code></li>
</ul>
<h4>Prefixes</h4>
<ul><li>S3 has a flat structure; <b>prefixes imply a folder structure</b>. Specifying prefix <code>2021/.../math</code> returns only keys starting with it.</li></ul>

<h3>3. Working with objects</h3>
<h4>Object metadata (key-value pairs)</h4>
<table>
<tr><th>System-defined</th><th>User-defined</th></tr>
<tr><td>Controlled by S3: creation date, size, version. <br>Modifiable by you: storage class, server-side encryption.</td><td>Assigned by you; key starts with <code>x-amz-meta-</code> followed by a custom name (e.g. <code>x-amz-meta-alt-name</code>).</td></tr>
</table>
<h4>Operations: PUT, GET, DELETE</h4>
<table>
<tr><th>Rule</th><th>Value</th></tr>
<tr><td>Single PUT can upload up to</td><td><b>5 GB</b></td></tr>
<tr><td>Should use multipart upload for objects over</td><td><b>100 MB</b></td></tr>
<tr><td>Must use multipart upload for objects over</td><td><b>5 GB</b></td></tr>
<tr><td>Maximum object size</td><td><b>5 TB</b></td></tr>
</table>
<ul>
  <li>Multipart upload: <b>parallel uploads</b> improve throughput and you can <b>resume</b> where it left off.</li>
  <li><b>GET</b>: retrieve the complete object or a <b>range of bytes</b>.</li>
</ul>
<h4>Versioning</h4>
<ul>
  <li>Keeps multiple variants of an object in the same bucket; recovers from unintended user actions and application failures.</li>
  <li>Each object gets a <b>version ID</b>.</li>
  <li>Once enabled, versioning can only be <b>suspended, never disabled</b>.</li>
  <li>Versioned buckets support <b>object locking</b>.</li>
  <li><b>DELETE without versioning</b>: object is permanently deleted by key.</li>
  <li><b>DELETE with versioning (key only)</b>: S3 inserts a <b>delete marker</b> that becomes the current version; GET then returns <b>404 Not Found</b>. To permanently delete, DELETE with <b>key + version ID</b> (each version individually).</li>
</ul>

<h3>4. Protecting data & managing access</h3>
<h4>Encryption</h4>
<ul>
  <li><b>In transit</b>: SSL/TLS endpoints (HTTPS); client-side encryption before transmission.</li>
  <li><b>At rest</b>: client-side encryption, or server-side encryption:
    <ul><li><b>SSE-S3</b> – Amazon S3-managed keys</li><li><b>SSE-KMS</b> – AWS KMS-managed keys</li><li><b>SSE-C</b> – customer-provided keys</li></ul></li>
</ul>
<h4>Access</h4>
<ul>
  <li>By default all buckets and objects are <b>private</b>; only the creating account can access them.</li>
  <li><b>Identity-based policies</b> – attached to IAM users, groups, roles.</li>
  <li><b>Resource-based policies</b> – attached to S3 resources (bucket policies, ACLs).</li>
  <li><b>ACLs</b> – resource-based, at object or bucket level; grant <b>basic read/write permissions to other AWS accounts</b>.</li>
  <li><b>Bucket policies</b> – IAM policy language; <b>granular</b> permissions (e.g. Principal "*", Action s3:GetObject on <code>arn:aws:s3:::bucket/*</code> = public read).</li>
  <li><b>Presigned URLs</b> – give access to PUT or GET an object without other permissions; use the <b>permissions of the creator</b>; need credentials, bucket, key, HTTP method and expiration; valid up to <b>1 week</b> max.</li>
  <li><b>CORS</b> – lets client web apps loaded in one domain interact with resources in another domain (AllowedOrigins, AllowedMethods, MaxAgeSeconds, AllowedHeaders).</li>
</ul>
<div class="tip"><b>Exam tip:</b> numbers to memorize – 11 nines, 3–63 chars, 5 GB single PUT, &gt;100 MB should multipart, &gt;5 GB must multipart, 5 TB max object, presigned URL max 7 days.</div>
`,
  questions: [
    { t: 'mcq', i: 1, c: 'S3 basics', q: 'What type of storage service is Amazon S3?', o: ['Object storage', 'Block storage', 'File system storage', 'Relational database'], e: 'Amazon S3 is an object storage service.' },
    { t: 'match', i: 1, c: 'S3 components', q: 'Match each Amazon S3 component with its description.', p: [['Bucket', 'Regional container for objects'], ['Object', 'Data referenced by a URL inside a bucket'], ['Key', 'Value that identifies an object in the bucket'], ['Prefix', 'Implies a folder structure']], e: 'Buckets hold objects; keys identify objects; prefixes imply folders.' },
    { t: 'tf', i: 1, c: 'S3 components', q: 'S3 buckets are global resources that are not located in any Region.', a: false, e: 'Each bucket is Regional and has a Region-specific endpoint.' },
    { t: 'mcq', i: 1, c: 'Bucket names', q: 'Which bucket name is valid?', o: ['cafe-website-2024', 'Cafe_Website', 'my_bucket', 'ab'], e: 'Names: 3–63 chars, lowercase letters, numbers, hyphens. No uppercase or underscores.' },
    { t: 'tf', i: 1, c: 'Bucket names', q: 'S3 bucket names only need to be unique within your AWS account.', a: false, e: 'Bucket names must be globally unique.' },
    { t: 'mcq', c: 'Bucket Regions', q: 'Which factors should you consider when choosing the Region for a bucket?', o: ['Latency, cost and regulatory requirements', 'Bucket name length and key prefix', 'Number of IAM users', 'The programming language of your SDK'], e: 'Deciding factors: latency, cost, regulatory requirements.' },
    { t: 'mcq', i: 1, c: 'Prefixes', q: 'How do you create an implied folder structure in an S3 bucket?', o: ['Use prefixes in object keys', 'Create sub-buckets', 'Use ACLs', 'Enable versioning'], e: 'Prefixes imply a folder structure in an S3 bucket.' },

    // metadata

    // PUT/GET
    { t: 'match', i: 1, c: 'PUT object', q: 'Match each S3 upload rule with its size.', p: [['Maximum size for a single PUT', '5 GB'], ['Should use multipart upload above', '100 MB'], ['Maximum object size', '5 TB'], ['Presigned URL maximum validity', '1 week']], e: 'Single PUT ≤ 5 GB, multipart recommended >100 MB, required >5 GB, max object 5 TB.' },
    { t: 'mcq', i: 1, c: 'PUT object', q: 'You must upload a 20 GB file to S3. What must you use?', o: ['Multipart upload', 'A single PUT operation', 'A presigned GET URL', 'An ACL'], e: 'Multipart upload is required for objects over 5 GB.' },
    { t: 'tf', c: 'PUT object', q: 'If a multipart upload is interrupted, you must restart the whole upload from the beginning.', a: false, e: 'Multipart upload can resume where it left off and uploads parts in parallel.' },
    { t: 'tf', c: 'PUT object', q: 'You should use multipart upload for objects larger than 100 MB.', a: true, e: 'Recommended (should) above 100 MB; required (must) above 5 GB.' },

    // versioning
    { t: 'mcq', i: 1, c: 'Versioning', q: 'After versioning has been enabled on a bucket, what can you do?', o: ['Only suspend it', 'Disable it completely', 'Delete it from the bucket settings', 'Nothing can change it, not even suspension'], e: 'Once enabled, versioning can only be suspended, not disabled.' },
    { t: 'tf', i: 1, c: 'Versioning', q: 'In a versioning-enabled bucket, deleting an object by key only adds a delete marker instead of permanently deleting it.', a: true, e: 'The delete marker becomes the current version; GET returns 404.' },
    { t: 'mcq', i: 1, c: 'Versioning', q: 'In a versioned bucket, how do you permanently delete an object?', o: ['Send DELETE with the key and the version ID of each version', 'Send DELETE with only the key', 'Suspend versioning', 'Change the ACL to private'], e: 'You must delete each individual version with its version ID.' },
    { t: 'tf', c: 'Versioning', q: 'Versioning helps you recover from unintended user actions and application failures.', a: true, e: 'Purpose of versioning.' },
    { t: 'tf', c: 'Versioning', q: 'Without versioning, deleting an object by its key deletes it permanently.', a: true, e: 'With versioning disabled, DELETE permanently removes the object.' },

    // encryption & access
    { t: 'match', i: 1, c: 'Encryption', q: 'Match each S3 server-side encryption option with who manages the keys.', p: [['SSE-S3', 'Amazon S3-managed keys'], ['SSE-KMS', 'AWS KMS-managed keys'], ['SSE-C', 'Customer-provided keys']], e: 'Three SSE options.' },
    { t: 'mcq', i: 1, c: 'Encryption', q: 'How is data in transit to Amazon S3 secured?', o: ['SSL/TLS-encrypted HTTPS endpoints and client-side encryption', 'SSE-S3 only', 'Bucket names', 'Versioning'], e: 'In transit: HTTPS (SSL/TLS) and client-side encryption before transmission.' },
    { t: 'tf', c: 'Encryption', q: 'SSE-C means Amazon S3 generates and manages the encryption keys for you.', a: false, e: 'SSE-C uses customer-provided keys. SSE-S3 uses S3-managed keys.' },
    { t: 'tf', i: 1, c: 'Access', q: 'By default, all Amazon S3 buckets and objects are private.', a: true, e: 'Only the AWS account that created the resource can access it by default.' },
    { t: 'match', i: 1, c: 'Access', q: 'Match each S3 access mechanism with its description.', p: [['Identity-based policy', 'Attached to IAM users, groups and roles'], ['Bucket policy', 'Resource-based JSON policy with granular permissions'], ['ACL', 'Basic read/write permissions for other AWS accounts'], ['Presigned URL', 'Temporary PUT or GET access to one object'], ['CORS', 'Lets a web app from another domain access bucket resources']], e: 'Access controls for S3.' },
    { t: 'mcq', i: 1, c: 'Presigned URLs', q: 'Whose permissions does a presigned URL use?', o: ['The user who created the URL', 'The person who opens the URL', 'The bucket owner root user always', 'Anonymous public permissions'], e: 'Presigned URLs use the permissions of the creator.' },
    { t: 'tf', c: 'Presigned URLs', q: 'A presigned URL lets the holder perform any action on the bucket.', a: false, e: 'It only allows the PUT or GET it was created for, nothing else.' },
    { t: 'mcq', i: 1, c: 'CORS', q: 'JavaScript on www.example.com must load resources from an S3 bucket in a different domain. What must you configure?', o: ['CORS on the bucket', 'SSE-KMS', 'Versioning', 'A larger multipart threshold'], e: 'CORS allows apps loaded in one domain to interact with resources in another.' },
    { t: 'mcq', i: 1, c: 'Presigned URLs', q: 'A mobile app must let users upload one photo to a private S3 bucket without giving them AWS credentials. What is the best solution?', o: ['Generate a presigned URL for a PUT on that object', 'Make the bucket public', 'Share an IAM user access key in the app', 'Enable versioning'], e: 'Presigned URLs give temporary PUT/GET on one object using the creator\'s permissions.' },
    { t: 'mcq', i: 1, c: 'Versioning', q: 'A company must be able to recover objects that users delete or overwrite by mistake. What should they enable?', o: ['S3 Versioning', 'SSE-S3 encryption', 'CORS', 'Multipart upload'], e: 'Versioning keeps previous versions and turns deletes into delete markers.' },
    { t: 'dnd', i: 1, c: 'Encryption', q: 'Drag each protection into the right category.', p: [['SSL/TLS (HTTPS) endpoints', 'Data in transit'], ['SSE-S3', 'Data at rest'], ['SSE-KMS', 'Data at rest'], ['SSE-C', 'Data at rest']], e: 'HTTPS protects data in transit; server-side encryption protects data at rest. Client-side encryption covers both.' },
    { t: 'dnd', i: 1, c: 'Access', q: 'Drag each S3 access control into its policy type.', p: [['Bucket policy', 'Resource-based'], ['ACL', 'Resource-based'], ['Policy attached to an IAM user', 'Identity-based'], ['Policy attached to an IAM role', 'Identity-based']], e: 'Resource-based policies attach to the bucket/object; identity-based attach to users, groups, roles.' },
    {"t": "mcq", "i": 1, "c": "Exam-style", "q": "You upload an object named menu.pdf to an S3 bucket named cafe-site in the eu-west-1 Region. Which URL can a client use to access the object?", "o": ["http://cafe-site.s3.eu-west-1.amazonaws.com/menu.pdf", "http://s3.amazonaws.com/menu.pdf/cafe-site", "http://menu.pdf.s3.eu-west-1.amazonaws.com/cafe-site", "http://cafe.s3-website-eu-west-1.amazonaws.com/menu.pdf"], "e": "Virtual-host-style URL: http://<bucket-name>.s3.<region>.amazonaws.com/<object-key>. The bucket name is part of the domain and the object key comes after the slash."},
    {"t": "mcq", "i": 1, "c": "Exam-style", "q": "You enable static website hosting on a bucket named cafe-site in eu-west-1. Which URL is the website endpoint?", "o": ["http://cafe-site.s3-website-eu-west-1.amazonaws.com", "http://s3-website-eu-west-1.amazonaws.com/cafe-site", "http://cafe-site.website.s3.amazonaws.com", "http://eu-west-1.cafe-site.s3-website.amazonaws.com"], "e": "Website endpoint structure: http://<bucket-name>.s3-website-<aws-region>.amazonaws.com. Static website hosting must be enabled first."},
    {"t": "tf", "i": 1, "c": "Exam-style", "q": "Amazon S3 supports server-side processing, such as PHP or ASP.NET scripts, for websites hosted in a bucket.", "a": false, "e": "S3 hosts static websites only. Pages can contain client-side scripts, but S3 does not support server-side scripting."},
    {"t": "tf", "i": 1, "c": "Exam-style", "q": "A static website hosted on Amazon S3 can include client-side scripts.", "a": true, "e": "Static pages may contain client-side scripts; only server-side scripting is unsupported."},
    {"t": "multi", "i": 1, "c": "Exam-style", "q": "You need to host a static website on Amazon S3. Which of the following are required? Select more than one answer.", "o": ["Enable static website hosting on the bucket", "Upload the website content to the bucket", "Give the bucket public read access", "Launch an EC2 instance as a web server", "Enable server-side scripting on the bucket"], "k": 3, "e": "Configure the bucket for website hosting, upload the content, and allow public read access. No servers are needed and server-side scripts are not supported."},
    {"t": "multi", "i": 1, "c": "Exam-style", "q": "Which of the following are common use cases for Amazon S3? Select more than one answer.", "o": ["Static website hosting", "Backup and restore", "Data lakes and big data analytics", "Running server-side PHP code", "Running a relational database engine"], "k": 3, "e": "S3 use cases: content storage and distribution, backup and restore, archiving, data lakes, big data analytics, disaster recovery and static website hosting."},
    {"t": "tf", "i": 1, "c": "S3 basics", "q": "Amazon S3 is designed for 99.999999999% (11 nines) of durability.", "a": true, "e": "S3 is designed for 11 nines of durability."},
    {"t": "match", "i": 1, "c": "Metadata", "q": "Match each S3 object metadata item to its type.", "p": [["Object creation date", "System-defined, controlled by S3"], ["Storage-class configuration", "System-defined, but you can modify it"], ["Server-side encryption setting", "System-defined, but you can modify it"], ["x-amz-meta-alt-name", "User-defined"]], "e": "System-defined metadata is set by S3; some of it (storage class, server-side encryption) you can modify. User-defined metadata uses the x-amz-meta- prefix."},
    {"t": "tf", "c": "Amazon S3 basics", "q": "Amazon S3 can respond to event triggers.", "a": true, "i": 1, "e": "Slide 8 lists 'Can respond to event triggers' as an S3 feature: you can configure event notifications, for example when an object is created, deleted or restored."},
    {"t": "multi", "c": "Amazon S3 basics", "q": "You configure Amazon S3 event notifications for when objects are created. Which services can receive these notifications? Select more than one answer.", "o": ["AWS Lambda", "Amazon SNS", "Amazon SQS", "Amazon CloudFront", "AWS KMS"], "k": 3, "e": "Per slide 8 notes, S3 event notifications can be used with AWS Lambda, Amazon SNS and Amazon SQS."},
    {"t": "mcq", "c": "Bucket naming", "q": "How many characters can an S3 bucket name have?", "o": ["Between 3 and 63", "Between 1 and 255", "Between 3 and 255", "Between 8 and 63"], "i": 1, "e": "Slide 13: bucket names must be at least 3 and no more than 63 characters long."},
    {"t": "multi", "c": "Bucket naming", "q": "Which characters are allowed in an S3 bucket name? Select more than one answer.", "o": ["Lowercase letters", "Numbers", "Hyphens (-)", "Underscores (_)", "Uppercase letters"], "k": 3, "i": 1, "e": "Slide 13: use only lowercase letters, numbers and hyphens; do not use uppercase characters or underscores."},
    {"t": "tf", "c": "Bucket naming", "q": "After you create an S3 bucket, you can rename it if the new name is globally unique.", "a": false, "e": "Slide 13 notes: after you create an S3 bucket, you can't change the bucket name, so choose it carefully."},
    {"t": "tf", "c": "Bucket Regions", "q": "You can move an existing S3 bucket to a different Region by changing its Region setting.", "a": false, "e": "Slide 14 notes: after you create a bucket, you cannot change its Region."},
    {"t": "tf", "c": "Bucket Regions", "q": "Objects stored in an AWS Region never leave that Region unless you explicitly transfer them to another Region.", "a": true, "e": "Slide 10 notes: each bucket is Regional, and its objects never leave the Region unless you explicitly transfer them."},
    {"t": "mcq", "c": "Prefixes", "q": "A bucket contains the keys 2021/english/john.txt, 2021/math/john.txt, 2021/math/maria.txt and 2021/summary.txt. You query the bucket with the prefix 2021/math. Which keys are returned?", "o": ["2021/math/john.txt and 2021/math/maria.txt", "All four keys", "Only 2021/summary.txt", "2021/english/john.txt and 2021/math/john.txt"], "i": 1, "e": "Slide 16: a prefix limits results to only those objects whose keys begin with that prefix."},
    {"t": "tf", "c": "PUT object", "q": "The S3 PUT operation lets you update only part of an existing object.", "a": false, "e": "Slide 20 notes: Amazon S3 always writes the entire object; you cannot do partial updates to an object."},
    {"t": "multi", "c": "PUT object", "q": "Which are benefits of using multipart upload? Select more than one answer.", "o": ["Parts can be uploaded in parallel to improve throughput", "A failed part can be resumed without affecting other parts", "Parts can be uploaded independently and in any order", "Objects are automatically encrypted with SSE-C", "Objects larger than 5 TB can be stored"], "k": 3, "i": 1, "e": "Slide 20: multipart upload allows parallel uploading, can resume where it left off, and parts can be uploaded independently in any order. The maximum object size is still 5 TB."},
    {"t": "mcq", "c": "GET object", "q": "Your application runs on a low-bandwidth connection and can only process part of a large S3 object at a time. How should it retrieve the data?", "o": ["GET a range of bytes of the object", "GET the complete object in one request", "Use a multipart PUT", "Enable versioning on the bucket"], "i": 1, "e": "Slide 22: GET can retrieve a range of bytes, which is useful when network connectivity is low or the application can only process subsets of object data."},
    {"t": "mcq", "c": "Versioning", "q": "In a versioning-enabled bucket, a user sends DELETE with only the key of photo.gif. Another user then sends a GET for photo.gif without a version ID. What happens?", "o": ["S3 returns a 404 Not Found error", "S3 returns the previous version of photo.gif", "S3 returns an empty object", "S3 returns a 403 Access Denied error"], "i": 1, "e": "Slide 25 notes: deleting with only the key adds a delete marker that becomes the current version, and a request to retrieve that object returns 404 Not Found."},
    {"t": "tf", "c": "Versioning", "q": "Versioning is enabled by default on new S3 buckets.", "a": false, "e": "Slide 23 notes: by default, versioning is disabled in S3 buckets."},
    {"t": "tf", "c": "Versioning", "q": "In a versioning-enabled bucket, two objects can have the same key but different version IDs.", "a": true, "e": "Slide 23: each object has a version ID, so photo.gif can exist as version 111111 and version 121212 in the same bucket."},
    {"t": "tf", "c": "Versioning", "q": "Versioned S3 buckets support object locking.", "a": true, "e": "Slide 23: versioned buckets support object locking; S3 Object Lock prevents data from being changed, overwritten or deleted."},
    {"t": "tf", "c": "Encryption", "q": "When you enable server-side encryption on a bucket, S3 also encrypts the objects that were already stored in it.", "a": false, "i": 1, "e": "Slide 28 notes: S3 does not encrypt objects already in the bucket; it only encrypts objects added after encryption is enabled."},
    {"t": "mcq", "c": "Encryption", "q": "A company needs server-side encryption for S3 objects and an audit trail of when the encryption key was used and by whom. Which option should it choose?", "o": ["SSE-KMS", "SSE-S3", "SSE-C", "Client-side encryption only"], "i": 1, "e": "Slide 28 notes: SSE-KMS provides an audit trail of when your key was used and by whom, and requires additional permissions for the envelope key."},
    {"t": "mcq", "c": "Encryption", "q": "Which data protection option means YOU manage the encryption process, the encryption keys and the related tools before the data reaches S3?", "o": ["Client-side encryption", "SSE-S3", "SSE-KMS", "SSE-C"], "e": "Slide 28 notes: with client-side encryption you encrypt data on the client side and upload it, managing the process, keys and tools yourself. With SSE-C you provide keys but S3 performs the encryption."},
    {"t": "tf", "c": "Access policies", "q": "Amazon S3 supports both identity-based policies and resource-based policies for managing access.", "a": true, "e": "Slides 29 and 34: Amazon S3 has two types of access policies, identity-based (attached to IAM users, groups, roles) and resource-based (attached to S3 resources)."},
    {"t": "mcq", "c": "Access policies", "q": "Which access mechanism is used to grant basic read/write permissions on a bucket or object to other AWS accounts?", "o": ["Access control lists (ACLs)", "CORS configuration", "Presigned URLs", "Server-side encryption"], "i": 1, "e": "Slide 30: ACLs are resource-based access policies used to grant basic read/write permissions to other AWS accounts, at the bucket or object level."},
    {"t": "mcq", "c": "Access policies", "q": "Account B uploads objects into a bucket owned by Account A. What is the only way to manage access to those objects?", "o": ["Object ACLs set by Account B", "A bucket policy written by Account A", "An IAM role in Account A", "A CORS configuration on the bucket"], "e": "Slide 30 notes: an object ACL is the only way to manage access to objects the bucket owner does not own; the account that created the object grants permissions with object ACLs."},
    {"t": "tf", "c": "Access policies", "q": "Bucket policies supplement, and in many cases replace, ACL-based access policies.", "a": true, "e": "Slide 31 notes: bucket policies are resource-based IAM policies that supplement, and in many cases replace, ACL-based access policies."},
    {"t": "multi", "c": "Presigned URLs", "q": "Which must you provide when you create a presigned URL? Select more than one answer.", "o": ["Your security credentials", "The bucket name and object key", "An HTTP method (PUT or GET)", "An expiration date and time", "The IAM user name of the person who will use the URL"], "k": 4, "e": "Slide 32: you provide security credentials, a bucket name, an object key, an HTTP method and an expiration date and time. The URL uses the creator's permissions."},
    {"t": "mcq", "c": "CORS", "q": "You host a web font in an S3 bucket, and a webpage in a different domain uses that font. The browser blocks the font. What should you configure on the bucket?", "o": ["CORS", "Versioning", "SSE-S3", "Multipart upload"], "e": "Slide 33 notes: the browser performs a CORS check when a page in another domain loads a web font from your bucket, so CORS must be enabled on the bucket."},
    {"t": "match", "c": "S3 use cases", "q": "Match each requirement with the S3 use case it describes.", "p": [["Store structured and unstructured data at any scale in a central repository for analytics", "Data lake"], ["Automatically copy objects to a bucket in another Region to protect critical data", "Disaster recovery"], ["Move rarely accessed data to S3 Glacier with lifecycle policies", "Backup and archive"], ["Distribute images and videos directly or through CloudFront edge locations", "Content storage and distribution"]], "x": ["Static website hosting"], "e": "Slide 9 notes: data lakes are centralized repositories; DR uses Cross-Region Replication; lifecycle policies archive to S3 Glacier; content can be distributed from S3 or CloudFront."}
  ]
});
