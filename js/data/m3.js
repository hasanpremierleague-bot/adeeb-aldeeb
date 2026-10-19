// Module 3: Developing Storage Solutions (Amazon S3)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm3',
  num: 3,
  title: 'Developing Storage Solutions (Amazon S3)',
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
    { t: 'mcq', i: 1, c: 'S3 basics', q: 'Amazon S3 is designed for what level of durability?', o: ['99.999999999% (11 nines)', '99.9%', '99.99%', '100%'], e: 'S3 is designed for 11 nines of durability.' },
    { t: 'tf', c: 'S3 basics', q: 'Amazon S3 can respond to event triggers.', a: true, e: 'S3 can respond to event triggers (for example, invoking Lambda).' },
    { t: 'mcq', c: 'S3 use cases', q: 'Which of the following is NOT listed as an Amazon S3 use case?', o: ['Running a relational database engine', 'Static website hosting', 'Data lakes and big data analytics', 'Disaster recovery'], e: 'Use cases: content storage/distribution, backup/restore/archive, data lakes, DR, static websites.' },
    { t: 'tf', c: 'S3 use cases', q: 'Amazon S3 can be used to host static websites.', a: true, e: 'Static website hosting is a listed use case.' },
    { t: 'match', i: 1, c: 'S3 components', q: 'Match each Amazon S3 component with its description.', p: [['Bucket', 'Regional container for objects'], ['Object', 'Data referenced by a URL inside a bucket'], ['Key', 'Value that identifies an object in the bucket'], ['Prefix', 'Implies a folder structure']], e: 'Buckets hold objects; keys identify objects; prefixes imply folders.' },
    { t: 'tf', i: 1, c: 'S3 components', q: 'S3 buckets are global resources that are not located in any Region.', a: false, e: 'Each bucket is Regional and has a Region-specific endpoint.' },
    { t: 'tf', c: 'S3 components', q: 'Objects in an S3 bucket can be referred to by their URL.', a: true, e: 'Section 2 takeaway.' },
    { t: 'mcq', i: 1, c: 'Bucket names', q: 'Which bucket name is valid?', o: ['cafe-website-2024', 'Cafe_Website', 'my_bucket', 'ab'], e: 'Names: 3–63 chars, lowercase letters, numbers, hyphens. No uppercase or underscores.' },
    { t: 'mcq', i: 1, c: 'Bucket names', q: 'How long can an S3 bucket name be?', o: ['3–63 characters', '1–255 characters', '5–50 characters', '3–128 characters'], e: 'Use 3 to 63 characters.' },
    { t: 'tf', i: 1, c: 'Bucket names', q: 'S3 bucket names only need to be unique within your AWS account.', a: false, e: 'Bucket names must be globally unique.' },
    { t: 'tf', c: 'Bucket names', q: 'Underscores (_) are allowed in S3 bucket names.', a: false, e: 'Do not use uppercase characters or underscores.' },
    { t: 'mcq', c: 'Bucket Regions', q: 'Which factors should you consider when choosing the Region for a bucket?', o: ['Latency, cost and regulatory requirements', 'Bucket name length and key prefix', 'Number of IAM users', 'The programming language of your SDK'], e: 'Deciding factors: latency, cost, regulatory requirements.' },
    { t: 'mcq', i: 1, c: 'Bucket URLs', q: 'In a virtual-host-style URL, where does the bucket name appear?', o: ['As part of the domain name', 'After the object key', 'In a query string parameter', 'It does not appear'], e: 'http://<bucket-name>.s3-<region>.amazonaws.com/<object-key>.' },
    { t: 'mcq', c: 'Bucket URLs', q: 'Which URL format is used for an S3 static website endpoint?', o: ['http://<bucket>.s3-website-<region>.amazonaws.com', 'http://s3.amazonaws.com/website/<bucket>', 'https://<region>.website.aws/<bucket>', 'http://<bucket>.cloudfront.net'], e: 'Static website endpoint includes "s3-website-<region>". It must be enabled.' },
    { t: 'tf', c: 'Bucket URLs', q: 'Static website hosting on an S3 bucket works automatically without being enabled.', a: false, e: 'Static website hosting must be enabled.' },
    { t: 'mcq', i: 1, c: 'Prefixes', q: 'How do you create an implied folder structure in an S3 bucket?', o: ['Use prefixes in object keys', 'Create sub-buckets', 'Use ACLs', 'Enable versioning'], e: 'Prefixes imply a folder structure in an S3 bucket.' },
    { t: 'tf', c: 'Prefixes', q: 'Specifying a prefix in a GET/list request returns only the object keys that start with that prefix.', a: true, e: 'The math prefix example returned only the math/john.txt and math/maria.txt keys.' },

    // metadata
    { t: 'match', i: 1, c: 'Object metadata', q: 'Match each metadata item to its type.', p: [['Object creation date', 'System-defined, controlled by S3'], ['Storage-class configuration', 'System-defined, but you can modify it'], ['x-amz-meta-alt-name', 'User-defined']], e: 'System-defined (S3-controlled or modifiable) vs user-defined (x-amz-meta-).' },
    { t: 'mcq', i: 1, c: 'Object metadata', q: 'User-defined S3 metadata keys must begin with which prefix?', o: ['x-amz-meta-', 'user-meta-', 's3-custom-', 'aws-user-'], e: 'User-defined metadata: x-amz-meta- followed by a custom name.' },
    { t: 'mcq', c: 'Object metadata', q: 'Which system-defined metadata can YOU modify?', o: ['Server-side encryption and storage class', 'Object creation date', 'Object size', 'Object version'], e: 'You can modify storage-class configuration and server-side encryption.' },
    { t: 'tf', c: 'Object metadata', q: 'Object metadata is a set of key-value pairs that provides additional information about the object.', a: true, e: 'Definition of metadata.' },

    // PUT/GET
    { t: 'match', i: 1, c: 'PUT object', q: 'Match each S3 upload rule with its size.', p: [['Maximum size for a single PUT', '5 GB'], ['Should use multipart upload above', '100 MB'], ['Maximum object size', '5 TB'], ['Presigned URL maximum validity', '1 week']], e: 'Single PUT ≤ 5 GB, multipart recommended >100 MB, required >5 GB, max object 5 TB.' },
    { t: 'mcq', i: 1, c: 'PUT object', q: 'You must upload a 20 GB file to S3. What must you use?', o: ['Multipart upload', 'A single PUT operation', 'A presigned GET URL', 'An ACL'], e: 'Multipart upload is required for objects over 5 GB.' },
    { t: 'mcq', i: 1, c: 'PUT object', q: 'What is the maximum size of a single S3 object?', o: ['5 TB', '5 GB', '100 MB', '50 TB'], e: 'Multipart upload allows a maximum object size of 5 TB.' },
    { t: 'tf', c: 'PUT object', q: 'If a multipart upload is interrupted, you must restart the whole upload from the beginning.', a: false, e: 'Multipart upload can resume where it left off and uploads parts in parallel.' },
    { t: 'tf', c: 'PUT object', q: 'You should use multipart upload for objects larger than 100 MB.', a: true, e: 'Recommended (should) above 100 MB; required (must) above 5 GB.' },
    { t: 'mcq', c: 'GET object', q: 'With the GET object operation you can retrieve:', o: ['The complete object or a range of bytes', 'Only the metadata', 'Only objects under 5 GB', 'Only the newest bucket'], e: 'GET the complete object or a range of bytes.' },

    // versioning
    { t: 'mcq', i: 1, c: 'Versioning', q: 'After versioning has been enabled on a bucket, what can you do?', o: ['Only suspend it', 'Disable it completely', 'Delete it from the bucket settings', 'Nothing can change it, not even suspension'], e: 'Once enabled, versioning can only be suspended, not disabled.' },
    { t: 'tf', i: 1, c: 'Versioning', q: 'In a versioning-enabled bucket, deleting an object by key only adds a delete marker instead of permanently deleting it.', a: true, e: 'The delete marker becomes the current version; GET returns 404.' },
    { t: 'mcq', i: 1, c: 'Versioning', q: 'In a versioned bucket, how do you permanently delete an object?', o: ['Send DELETE with the key and the version ID of each version', 'Send DELETE with only the key', 'Suspend versioning', 'Change the ACL to private'], e: 'You must delete each individual version with its version ID.' },
    { t: 'mcq', c: 'Versioning', q: 'What does a GET request return for an object whose current version is a delete marker?', o: ['404 Not Found', '200 OK with the previous version', '500 Internal Server Error', '403 Forbidden always'], e: 'Objects with a delete marker return 404 Not Found.' },
    { t: 'tf', c: 'Versioning', q: 'Object locking is only supported on buckets where versioning is disabled.', a: false, e: 'Versioned buckets support object locking.' },
    { t: 'tf', c: 'Versioning', q: 'Versioning helps you recover from unintended user actions and application failures.', a: true, e: 'Purpose of versioning.' },
    { t: 'tf', c: 'Versioning', q: 'Without versioning, deleting an object by its key deletes it permanently.', a: true, e: 'With versioning disabled, DELETE permanently removes the object.' },
    { t: 'mcq', c: 'S3 operations', q: 'Which three object operations does the S3 module cover?', o: ['PUT, GET, DELETE', 'CREATE, READ, SCAN', 'POST, PATCH, QUERY', 'INSERT, SELECT, DROP'], e: 'Section 4 takeaway: PUT, GET, DELETE.' },

    // encryption & access
    { t: 'match', i: 1, c: 'Encryption', q: 'Match each S3 server-side encryption option with who manages the keys.', p: [['SSE-S3', 'Amazon S3-managed keys'], ['SSE-KMS', 'AWS KMS-managed keys'], ['SSE-C', 'Customer-provided keys']], e: 'Three SSE options.' },
    { t: 'mcq', i: 1, c: 'Encryption', q: 'How is data in transit to Amazon S3 secured?', o: ['SSL/TLS-encrypted HTTPS endpoints and client-side encryption', 'SSE-S3 only', 'Bucket names', 'Versioning'], e: 'In transit: HTTPS (SSL/TLS) and client-side encryption before transmission.' },
    { t: 'tf', c: 'Encryption', q: 'SSE-C means Amazon S3 generates and manages the encryption keys for you.', a: false, e: 'SSE-C uses customer-provided keys. SSE-S3 uses S3-managed keys.' },
    { t: 'tf', i: 1, c: 'Access', q: 'By default, all Amazon S3 buckets and objects are private.', a: true, e: 'Only the AWS account that created the resource can access it by default.' },
    { t: 'match', i: 1, c: 'Access', q: 'Match each S3 access mechanism with its description.', p: [['Identity-based policy', 'Attached to IAM users, groups and roles'], ['Bucket policy', 'Resource-based JSON policy with granular permissions'], ['ACL', 'Basic read/write permissions for other AWS accounts'], ['Presigned URL', 'Temporary PUT or GET access to one object'], ['CORS', 'Lets a web app from another domain access bucket resources']], e: 'Access controls for S3.' },
    { t: 'mcq', c: 'Access', q: 'ACLs in Amazon S3 are mainly used to:', o: ['Grant basic read/write permissions to other AWS accounts', 'Encrypt objects with KMS', 'Enable versioning', 'Provide granular conditions with IAM policy language'], e: 'ACLs are resource-based and grant basic read/write to other accounts.' },
    { t: 'tf', c: 'Bucket policies', q: 'Bucket policies are written in SQL.', a: false, e: 'Bucket policies use the IAM policy language (JSON).' },
    { t: 'mcq', i: 1, c: 'Presigned URLs', q: 'What is the maximum validity of an S3 presigned URL?', o: ['1 week', '1 hour', '24 hours', '30 days'], e: 'Presigned URLs are valid until expiration, maximum of 1 week.' },
    { t: 'mcq', i: 1, c: 'Presigned URLs', q: 'Whose permissions does a presigned URL use?', o: ['The user who created the URL', 'The person who opens the URL', 'The bucket owner root user always', 'Anonymous public permissions'], e: 'Presigned URLs use the permissions of the creator.' },
    { t: 'tf', c: 'Presigned URLs', q: 'A presigned URL lets the holder perform any action on the bucket.', a: false, e: 'It only allows the PUT or GET it was created for, nothing else.' },
    { t: 'mcq', c: 'Presigned URLs', q: 'Which is NOT required to create a presigned URL?', o: ['A CORS configuration', 'Security credentials', 'Bucket name and object key', 'HTTP method and expiration time'], e: 'Needed: credentials, bucket, key, HTTP method, expiration.' },
    { t: 'mcq', i: 1, c: 'CORS', q: 'JavaScript on www.example.com must load resources from an S3 bucket in a different domain. What must you configure?', o: ['CORS on the bucket', 'SSE-KMS', 'Versioning', 'A larger multipart threshold'], e: 'CORS allows apps loaded in one domain to interact with resources in another.' },
    { t: 'tf', c: 'CORS', q: 'A CORS configuration can specify AllowedOrigins, AllowedMethods, AllowedHeaders and MaxAgeSeconds.', a: true, e: 'Those fields appear in the CORS example.' },
    { t: 'tf', c: 'Policies', q: 'Amazon S3 supports two types of access policies: identity-based and resource-based.', a: true, e: 'Section 5 takeaway.' }
  ]
});
