// Module 5: Developing Flexible NoSQL Solutions (Amazon DynamoDB)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm5',
  num: 5,
  title: 'Developing Flexible NoSQL Solutions (DynamoDB)',
  short: 'DynamoDB',
  icon: '🗄️',
  study: `
<h3>1. Database options</h3>
<table>
<tr><th>Feature</th><th>Relational (SQL)</th><th>Nonrelational (NoSQL)</th></tr>
<tr><td>Data storage</td><td>Rows and columns</td><td>Key-value, documents, graphs</td></tr>
<tr><td>Schema</td><td>Fixed</td><td>Dynamic</td></tr>
<tr><td>Querying</td><td>SQL-based</td><td>Focused on collection of documents</td></tr>
<tr><td>Scalability</td><td><b>Vertical</b></td><td><b>Horizontal</b></td></tr>
<tr><td>Traditional examples</td><td>SQL Server, Oracle, MySQL</td><td>MongoDB, Cassandra, Redis</td></tr>
<tr><td>AWS examples</td><td>Amazon RDS, Amazon Aurora</td><td>Amazon DynamoDB, ElastiCache, Neptune</td></tr>
</table>
<ul>
  <li>Choose <b>relational</b> when you need strict schema rules / data quality and don't need extreme read/write capacity (lowest-effort solution).</li>
  <li>Choose <b>nonrelational</b> when you need to scale horizontally, data doesn't fit traditional schemas, or read/write rates exceed what SQL can economically support.</li>
</ul>

<h3>2. DynamoDB key concepts</h3>
<ul>
  <li><b>Table</b> → contains <b>items</b> (≈ rows) → each item has <b>attributes</b> (≈ columns). An attribute is a fundamental data element.</li>
  <li><b>Primary key</b> uniquely identifies each item; no two items share a key.</li>
  <li><b>Simple primary key</b> = partition key only (e.g. SensorId). <b>Composite primary key</b> = partition key + sort key (e.g. SensorId + Time).</li>
  <li>Partition key = <b>hash attribute</b> (KeyType HASH); sort key = <b>range attribute</b> (KeyType RANGE).</li>
  <li>Items in the same table can have <b>different numbers of attributes</b>.</li>
  <li>Attribute types: scalar (<b>String, Number, Boolean</b>), document (<b>Map, List</b>, JSON).</li>
</ul>

<h3>3. Partitions</h3>
<ul>
  <li>Data is stored in <b>partitions</b> (SSD-backed, automatically replicated across multiple AZs, fully managed by DynamoDB).</li>
  <li>A <b>hash function</b> takes the partition key value as input; output determines the partition.</li>
  <li>Composite key: items with the same partition key are stored together, <b>sorted in ascending order by sort key</b>.</li>
</ul>

<h3>4. Secondary indexes</h3>
<ul>
  <li>Let you query on <b>non-primary-key attributes</b> using an <b>alternate key</b>.</li>
  <li>Contain alternate-key attributes, primary-key attributes, and optional <b>projected attributes</b>.</li>
</ul>
<table>
<tr><th>Global secondary index (GSI)</th><th>Local secondary index (LSI)</th></tr>
<tr><td><b>Different</b> partition key and sort key from the base table (e.g. Genre + AlbumTitle).</td><td><b>Same partition key</b> as the base table but a <b>different sort key</b> (e.g. Artist + AlbumTitle).</td></tr>
</table>

<h3>5. Read/write throughput</h3>
<ul>
  <li><b>Eventually consistent read</b> (default): may return stale data right after a write (copies usually consistent within a second). Use case: <b>blog posts</b>.</li>
  <li><b>Strongly consistent read</b>: returns most up-to-date data. Use cases: <b>scoreboards, booking systems, financial algorithms</b>.</li>
  <li><b>Transactions</b>: coordinated <b>all-or-nothing</b> inserts/updates/deletes across items and tables; <b>ACID</b>. Use cases: financial transactions, orders, multiplayer games, coordinating distributed components.</li>
</ul>
<table>
<tr><th>Provisioned mode</th><th>On-demand mode</th></tr>
<tr><td>Set throughput as RCU/WCU; divided evenly among partitions.</td><td>Pay-per-request; adapts rapidly to workload; for <b>new tables with unknown workloads, unpredictable traffic</b>, pay only for what you use.</td></tr>
</table>
<ul>
  <li><b>1 RCU</b> = 1 strongly consistent read/sec (or <b>2 eventually consistent</b>) for items up to <b>4 KB</b>.</li>
  <li><b>1 WCU</b> = 1 write/sec for items up to <b>1 KB</b>.</li>
</ul>
<div class="formula">
<b>RCU</b> = ceil(size / 4 KB) × reads per second (÷ 2 if eventually consistent)<br>
Example: 20 items × 11 KB/s, eventual → ceil(11/4)=3 → 3×20=60 → ÷2 = <b>30 RCUs</b><br>
<b>WCU</b> = ceil(size / 1 KB) × writes per second<br>
Example: 120 items × 7 KB per <i>minute</i> → 2/s → 7×2 = <b>14 WCUs</b>
</div>

<h3>6. Streams & global tables</h3>
<ul>
  <li><b>DynamoDB Streams</b>: time-ordered sequence of item-level changes, stored <b>up to 24 hours</b>; records can include before/after images; records are grouped in <b>shards</b>; can be consumed by services like <b>AWS Lambda</b>.</li>
  <li><b>Global tables</b>: multi-Region, <b>multi-active</b> database without building your own replication. You choose the Regions. Changes are recorded in a stream and propagated to the other replicas.</li>
  <li>Concurrent updates: <b>last writer wins</b> reconciliation.</li>
  <li><b>Strongly consistent reads are not supported across Regions</b>; must read/write in the same Region. Transactions are disabled on global tables by default.</li>
</ul>

<h3>7. Backup and restore</h3>
<ul>
  <li><b>On-demand backups</b>: full backups any time (console, CLI, API); no impact on performance; don't consume provisioned throughput; unlimited number.</li>
  <li><b>Point-in-time recovery (PITR)</b>: protects from accidental writes/deletes; restore to any point in the <b>last 35 days</b>.</li>
</ul>

<h3>8. API operations</h3>
<table>
<tr><th>Category</th><th>Examples</th></tr>
<tr><td>Control</td><td>CreateTable (create/manage tables)</td></tr>
<tr><td>Data</td><td>Write: PutItem, UpdateItem, DeleteItem. Read: GetItem, Query, Scan</td></tr>
<tr><td>Batch</td><td><b>BatchGetItem</b>: up to <b>100 items / 16 MB</b>. <b>BatchWriteItem</b>: up to <b>25 PUT/DELETE / 16 MB</b>. One failure does <b>not</b> fail the whole batch – retry the failed keys.</td></tr>
<tr><td>Transaction</td><td><b>TransactWriteItems</b> (write set), <b>TransactGetItems</b> (read set). If one fails, the <b>entire transaction fails</b>.</td></tr>
</table>
<ul>
  <li><b>create_table</b>: TableName, KeySchema (HASH / RANGE), AttributeDefinitions (type 'S'...), ProvisionedThroughput (RCU/WCU).</li>
  <li><b>put_item</b>: creates or <b>replaces (overwrites)</b> an item; only primary key attributes required.</li>
  <li><b>update_item</b>: edits attributes or <b>adds a new item if it doesn't exist</b>; uses Key, UpdateExpression ('SET age = :val1'), ExpressionAttributeValues.</li>
  <li><b>delete_item</b>: deletes a single item by primary key.</li>
  <li><b>Condition expressions</b>: only perform the write if a condition is true (e.g. unlock account only if last failed login &gt; 24h ago).</li>
  <li><b>get_item</b>: reads one item by full primary key.</li>
  <li><b>Query</b>: uses <b>KeyConditionExpression</b> (partition key); optional ProjectionExpression, ConsistentRead, FilterExpression. <b>More efficient than Scan</b>.</li>
  <li><b>Scan</b>: reads <b>ALL items</b> in a table/index; optional FilterExpression (e.g. <code>Attr('age').lt(27)</code>).</li>
  <li>Pagination: <b>1 MB</b> limit per Query/Scan; use <b>LastEvaluatedKey</b> → <b>ExclusiveStartKey</b>; <b>Limit</b> sets max items returned.</li>
</ul>
<div class="tip"><b>Exam tip:</b> GSI = different partition key; LSI = same partition key, different sort key. Batch = partial failures OK; Transaction = all-or-nothing.</div>
`,
  questions: [
    { t: 'match', i: 1, c: 'Database types', q: 'Match each feature to relational or nonrelational databases.', p: [['Rows and columns, fixed schema', 'Relational (SQL)'], ['Key-value, documents and graphs, dynamic schema', 'Nonrelational (NoSQL)'], ['Scales vertically', 'Relational (SQL)'], ['Scales horizontally', 'Nonrelational (NoSQL)']], e: 'SQL: rows/columns, fixed schema, vertical. NoSQL: key-value/docs/graphs, dynamic, horizontal.' },
    { t: 'mcq', i: 1, c: 'Database types', q: 'When should you choose a relational database?', o: ['When you need strict schema rules and data quality and don\'t need extreme read/write capacity', 'When you need to scale horizontally at extreme rates', 'When data doesn\'t fit traditional schemas', 'When you need key-value storage only'], e: 'Relational: strict schema, no extreme performance needs.' },
    { t: 'mcq', c: 'Database types', q: 'Which is NOT a reason to choose a nonrelational database?', o: ['You must enforce strict schema rules', 'You need to scale horizontally', 'Your data doesn\'t lend itself to traditional schemas', 'Your read/write rates exceed what SQL can economically support'], e: 'Strict schema is a reason for relational.' },
    { t: 'match', c: 'AWS databases', q: 'Match each service to its database category.', p: [['Amazon RDS', 'Relational'], ['Amazon Aurora', 'Relational'], ['Amazon DynamoDB', 'Nonrelational'], ['Amazon Neptune', 'Nonrelational'], ['Amazon ElastiCache', 'Nonrelational']], e: 'RDS & Aurora relational; DynamoDB, ElastiCache, Neptune nonrelational.' },
    { t: 'mcq', c: 'Database types', q: 'Which is a traditional nonrelational database example?', o: ['MongoDB', 'MySQL', 'Oracle Database', 'Microsoft SQL Server'], e: 'NoSQL examples: MongoDB, Cassandra, Redis.' },

    { t: 'match', i: 1, c: 'DynamoDB components', q: 'Match each DynamoDB component with its description.', p: [['Table', 'Stores a collection of items'], ['Item', 'Uniquely identifiable group of attributes (like a row)'], ['Attribute', 'Fundamental data element (like a column)'], ['Primary key', 'Uniquely identifies each item']], e: 'Items ≈ rows, attributes ≈ columns.' },
    { t: 'tf', i: 1, c: 'DynamoDB components', q: 'Different items in the same DynamoDB table can have a different number of attributes.', a: true, e: 'DynamoDB is schemaless beyond the primary key.' },
    { t: 'match', i: 1, c: 'Primary keys', q: 'Match each primary key type with its definition.', p: [['Simple primary key', 'Partition key only'], ['Composite primary key', 'Partition key and sort key'], ['Partition key', 'Hash attribute (KeyType HASH)'], ['Sort key', 'Range attribute (KeyType RANGE)']], e: 'Simple vs composite; HASH vs RANGE.' },
    { t: 'mcq', c: 'Primary keys', q: 'The SensorReadings table uses SensorId and Time as its key. What kind of key is this?', o: ['Composite primary key', 'Simple primary key', 'Global secondary index', 'Foreign key'], e: 'Partition key + sort key = composite.' },
    { t: 'tf', c: 'Primary keys', q: 'Two items in a DynamoDB table can have the same primary key.', a: false, e: 'No two items can have the same key.' },
    { t: 'match', c: 'Attribute types', q: 'Match each value to its DynamoDB attribute type.', p: [['"My Favorite Video"', 'String'], ['5.00', 'Number'], ['true', 'Boolean'], ['{"year": 2021, "month": 5}', 'Map'], ['["Paulo", "Richard", "Jane"]', 'List']], e: 'Scalar types and document types (Map, List).' },

    { t: 'mcq', i: 1, c: 'Partitions', q: 'How does DynamoDB decide which partition stores an item?', o: ['A hash function uses the partition key value as input', 'Items are stored in the order they were created', 'The sort key alone determines the partition', 'A random partition is chosen each time'], e: 'The hash of the partition key determines the partition.' },
    { t: 'mcq', i: 1, c: 'Partitions', q: 'With a composite primary key, how are items with the same partition key stored?', o: ['Together, in ascending order by sort key', 'In different partitions, randomly', 'In descending order by creation time', 'In separate tables'], e: 'Same partition key items are stored together, sorted by sort key.' },
    { t: 'tf', c: 'Partitions', q: 'DynamoDB partitions are backed by SSDs and automatically replicated across multiple Availability Zones.', a: true, e: 'Partition management is handled entirely by DynamoDB.' },
    { t: 'tf', c: 'Partitions', q: 'Developers must manually manage DynamoDB partitions.', a: false, e: 'Partition management is handled entirely by DynamoDB.' },

    { t: 'match', i: 1, c: 'Secondary indexes', q: 'Match each index type with its key structure.', p: [['Global secondary index', 'Different partition key and sort key from the base table'], ['Local secondary index', 'Same partition key as the base table, different sort key']], e: 'GSI = different keys; LSI = same partition key.' },
    { t: 'mcq', i: 1, c: 'Secondary indexes', q: 'The Music table key is Artist + SongTitle. You create an index with Genre + AlbumTitle. What kind of index is it?', o: ['Global secondary index', 'Local secondary index', 'Composite primary key', 'Stream'], e: 'Different partition key → GSI.' },
    { t: 'mcq', i: 1, c: 'Secondary indexes', q: 'The Music table key is Artist + SongTitle. You create an index with Artist + AlbumTitle. What kind of index is it?', o: ['Local secondary index', 'Global secondary index', 'Simple primary key', 'Global table'], e: 'Same partition key, different sort key → LSI.' },
    { t: 'mcq', c: 'Secondary indexes', q: 'Why do you use a secondary index?', o: ['To query data based on non-primary-key attributes', 'To back up a table', 'To replicate data across Regions', 'To encrypt data'], e: 'Secondary indexes define an alternate key for queries.' },
    { t: 'tf', c: 'Secondary indexes', q: 'A local secondary index can have a different partition key from the base table.', a: false, e: 'An LSI has the same partition key and a different sort key. A GSI can have a different partition key.' },

    { t: 'match', i: 1, c: 'Read consistency', q: 'Match each use case with the read consistency it needs.', p: [['Blog posts', 'Eventually consistent read'], ['Scoreboards and booking systems', 'Strongly consistent read']], e: 'Eventual may be stale; strong returns most up-to-date data.' },
    { t: 'tf', i: 1, c: 'Read consistency', q: 'An eventually consistent read might return slightly stale data if it happens immediately after a write.', a: true, e: 'Copies are usually consistent within a second.' },
    { t: 'tf', c: 'Read consistency', q: 'Strongly consistent reads can return stale data right after a write.', a: false, e: 'Strongly consistent reads return the most up-to-date data; eventually consistent reads might be stale.' },
    { t: 'mcq', i: 1, c: 'Transactions', q: 'What do DynamoDB transactions provide?', o: ['All-or-nothing, ACID changes across multiple items and tables', 'Partial success with retries', 'Cross-Region strong consistency', 'Automatic backups'], e: 'Transactions are coordinated, all-or-nothing and ACID.' },
    { t: 'mcq', c: 'Transactions', q: 'What does ACID stand for?', o: ['Atomicity, consistency, isolation, durability', 'Availability, consistency, integrity, durability', 'Atomicity, concurrency, isolation, distribution', 'Access, control, identity, data'], e: 'ACID = atomicity, consistency, isolation, durability.' },
    { t: 'mcq', c: 'Transactions', q: 'Which is a listed use case for DynamoDB transactions?', o: ['Processing financial transactions', 'Hosting a static website', 'Streaming video', 'Storing log files for 24 hours'], e: 'Use cases: financial transactions, orders, multiplayer games, distributed coordination.' },

    { t: 'match', i: 1, c: 'Capacity units', q: 'Match each capacity unit with its definition.', p: [['1 RCU', '1 strongly consistent read per second for items up to 4 KB'], ['1 WCU', '1 write per second for items up to 1 KB'], ['Eventually consistent reads', 'Use half the provisioned read capacity']], e: 'RCU = 4 KB strong read (or 2 eventual); WCU = 1 KB write.' },
    { t: 'mcq', i: 1, c: 'Capacity units', q: 'You must read 20 items of 11 KB every second with eventual consistency. How many RCUs?', o: ['30', '60', '55', '20'], e: '11 KB → 12 → 3 RCU each × 20 = 60 → ÷2 = 30.' },
    { t: 'mcq', i: 1, c: 'Capacity units', q: 'You must write 120 items of 7 KB every minute. How many WCUs?', o: ['14', '840', '7', '120'], e: '120/min = 2/s; 7 WCU each × 2 = 14.' },
    { t: 'mcq', i: 1, c: 'Capacity units', q: 'You need 10 strongly consistent reads per second of 6 KB items. How many RCUs?', o: ['20', '10', '15', '30'], e: '6 KB → 8 KB → 2 RCU each × 10 = 20 (no halving for strong).' },
    { t: 'mcq', c: 'Capacity units', q: 'You need 5 writes per second of 2.5 KB items. How many WCUs?', o: ['15', '5', '13', '10'], e: '2.5 KB rounds up to 3 KB → 3 WCU × 5 = 15.' },
    { t: 'mcq', c: 'Capacity units', q: 'You need 8 eventually consistent reads per second of 4 KB items. How many RCUs?', o: ['4', '8', '16', '2'], e: '4 KB = 1 RCU × 8 = 8 ÷ 2 = 4.' },
    { t: 'match', i: 1, c: 'Throughput modes', q: 'Match each throughput mode with its description.', p: [['Provisioned', 'You set throughput as RCUs and WCUs'], ['On-demand', 'Pay-per-request, adapts to unpredictable traffic']], e: 'Provisioned vs on-demand.' },
    { t: 'mcq', c: 'Throughput modes', q: 'You are creating a new table with an unknown workload and unpredictable traffic. Which capacity mode fits best?', o: ['On-demand', 'Provisioned with 1 RCU', 'Provisioned with auto rounding', 'Global tables'], e: 'On-demand suits unknown workloads and unpredictable traffic.' },
    { t: 'tf', c: 'Throughput modes', q: 'One WCU covers one write per second for items up to 4 KB.', a: false, e: '1 WCU = one 1 KB write per second. 4 KB is the RCU item size.' },

    { t: 'mcq', i: 1, c: 'Streams', q: 'What are DynamoDB Streams?', o: ['A time-ordered sequence of item-level changes in a table', 'A way to scan all items faster', 'A backup that lasts 35 days', 'A secondary index type'], e: 'Streams capture item-level modifications.' },
    { t: 'mcq', c: 'Streams', q: 'How long does DynamoDB Streams store change records?', o: ['Up to 24 hours', 'Up to 35 days', 'Forever', '1 hour'], e: 'Stream records are stored for up to 24 hours.' },
    { t: 'tf', i: 1, c: 'Streams', q: 'DynamoDB streams are composed of shards and can be consumed by AWS Lambda.', a: true, e: 'Section 7 takeaway.' },
    { t: 'mcq', i: 1, c: 'Global tables', q: 'What do DynamoDB global tables provide?', o: ['A multi-Region, multi-active database without building your own replication', 'A single-Region read replica only', 'A cross-account backup', 'A SQL interface for DynamoDB'], e: 'Global tables replicate across the Regions you choose.' },
    { t: 'mcq', c: 'Global tables', q: 'How do global tables resolve concurrent updates to the same item in different Regions?', o: ['Last writer wins', 'First writer wins', 'The update is rejected', 'The user is asked to choose'], e: 'Last writer wins reconciliation.' },
    { t: 'tf', i: 1, c: 'Global tables', q: 'DynamoDB supports strongly consistent reads across AWS Regions with global tables.', a: false, e: 'Strongly consistent reads must happen in the same Region as the writes.' },
    { t: 'tf', c: 'Global tables', q: 'With global tables, you must build and maintain your own replication between Regions.', a: false, e: 'Global tables replicate automatically across the Regions you choose.' },

    { t: 'match', i: 1, c: 'Backup', q: 'Match each backup feature to its description.', p: [['On-demand backup', 'Full table backup you create any time'], ['Point-in-time recovery', 'Restore to any point in the last 35 days']], e: 'On-demand vs PITR.' },
    { t: 'tf', c: 'Backup', q: 'DynamoDB backups consume the table\'s provisioned throughput.', a: false, e: 'Backups work without consuming provisioned throughput.' },

    { t: 'match', i: 1, c: 'API operations', q: 'Match each operation to its category.', p: [['CreateTable', 'Control operation'], ['PutItem / GetItem', 'Data operation'], ['BatchWriteItem', 'Batch operation'], ['TransactWriteItems', 'Transaction operation']], e: 'Control, data, batch, transaction.' },
    { t: 'match', i: 1, c: 'Data operations', q: 'Match each DynamoDB operation to what it does.', p: [['PutItem', 'Creates a new item or replaces an existing one'], ['UpdateItem', 'Edits attributes, or adds the item if it doesn\'t exist'], ['DeleteItem', 'Deletes a single item by primary key'], ['GetItem', 'Reads one item by primary key']], e: 'CRUD operations.' },
    { t: 'tf', i: 1, c: 'Data operations', q: 'PutItem fails if an item with the same primary key already exists.', a: false, e: 'PutItem replaces (overwrites) the existing item unless you add a condition.' },
    { t: 'mcq', i: 1, c: 'Condition expressions', q: 'You want to set accountLocked = N only if the last failed login was more than 24 hours ago. What do you use?', o: ['A condition expression on UpdateItem', 'A Scan with a filter', 'A global secondary index', 'A DynamoDB stream'], e: 'Condition expressions make writes conditional.' },
    { t: 'mcq', i: 1, c: 'Query vs Scan', q: 'Which operation reads ALL items in a table or index?', o: ['Scan', 'Query', 'GetItem', 'BatchGetItem'], e: 'Scan reads every item; Query uses the key condition.' },
    { t: 'tf', i: 1, c: 'Query vs Scan', q: 'A Query operation is more efficient than a Scan operation.', a: true, e: 'Query targets a partition key; Scan reads everything.' },
    { t: 'mcq', i: 1, c: 'Pagination', q: 'What is the maximum amount of data a single Query or Scan returns before pagination?', o: ['1 MB', '4 KB', '16 MB', '400 KB'], e: 'The 1-MB pagination limit.' },
    { t: 'match', c: 'Pagination', q: 'Match each pagination parameter with its role.', p: [['LastEvaluatedKey', 'Returned when more results remain'], ['ExclusiveStartKey', 'Passed in to continue from the previous page'], ['Limit', 'Maximum number of items returned']], e: 'Pagination parameters.' },
    { t: 'match', i: 1, c: 'Batch operations', q: 'Match each batch operation with its limit.', p: [['BatchGetItem', 'Up to 100 items / 16 MB'], ['BatchWriteItem', 'Up to 25 PUT or DELETE requests / 16 MB']], e: 'Batch limits.' },
    { t: 'tf', i: 1, c: 'Batch vs transaction', q: 'If one request in a batch operation fails, the entire batch fails.', a: false, e: 'Batch: partial failures are returned for retry. Transaction: one failure fails all.' },
    { t: 'tf', i: 1, c: 'Batch vs transaction', q: 'If one operation in TransactWriteItems fails, the entire transaction fails.', a: true, e: 'Transactions are all-or-nothing.' },
    { t: 'mcq', c: 'Batch vs transaction', q: 'Which operation contains a read set of one or more GetItem operations across multiple tables, all-or-nothing?', o: ['TransactGetItems', 'BatchGetItem', 'Scan', 'Query'], e: 'TransactGetItems = read set; TransactWriteItems = write set.' }
  ]
});
