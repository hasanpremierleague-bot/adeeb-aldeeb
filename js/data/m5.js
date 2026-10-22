// Module 5: Developing Flexible NoSQL Solutions (Amazon DynamoDB)
window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: 'm5',
  num: 5,
  title: 'Developing Flexible NoSQL Solutions (DynamoDB)',
  scope: 'Slides 7–63',
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
  <li><b>Scan</b>: reads <b>ALL items</b> in a table/index; optional FilterExpression.</li>
  <li>Pagination: <b>1 MB</b> limit per Query/Scan; use <b>LastEvaluatedKey</b> → <b>ExclusiveStartKey</b>; <b>Limit</b> sets max items returned.</li>
</ul>
<div class="tip"><b>Exam tip:</b> GSI = different partition key; LSI = same partition key, different sort key. Batch = partial failures OK; Transaction = all-or-nothing.</div>
`,
  questions: [
    { t: 'dnd', i: 1, c: 'Database types', q: 'Drag each feature to relational or nonrelational databases.', p: [['Rows and columns, fixed schema', 'Relational (SQL)'], ['Key-value, documents and graphs, dynamic schema', 'Nonrelational (NoSQL)'], ['Scales vertically', 'Relational (SQL)'], ['Scales horizontally', 'Nonrelational (NoSQL)']], e: 'SQL: rows/columns, fixed schema, vertical. NoSQL: key-value/docs/graphs, dynamic, horizontal.' },
    { t: 'mcq', i: 1, c: 'Database types', q: 'When should you choose a relational database?', o: ['When you need strict schema rules and data quality and don\'t need extreme read/write capacity', 'When you need to scale horizontally at extreme rates', 'When data doesn\'t fit traditional schemas', 'When you need key-value storage only'], e: 'Relational: strict schema, no extreme performance needs.' },
    { t: 'dnd', c: 'AWS databases', q: 'Drag each service to its database category.', p: [['Amazon RDS', 'Relational'], ['Amazon Aurora', 'Relational'], ['Amazon DynamoDB', 'Nonrelational'], ['Amazon Neptune', 'Nonrelational'], ['Amazon ElastiCache', 'Nonrelational']], e: 'RDS & Aurora relational; DynamoDB, ElastiCache, Neptune nonrelational.' },

    { t: 'match', i: 1, c: 'DynamoDB components', q: 'Match each DynamoDB component with its description.', p: [['Table', 'Stores a collection of items'], ['Item', 'Uniquely identifiable group of attributes (like a row)'], ['Attribute', 'Fundamental data element (like a column)'], ['Primary key', 'Uniquely identifies each item']], e: 'Items ≈ rows, attributes ≈ columns.' },
    { t: 'tf', i: 1, c: 'DynamoDB components', q: 'Different items in the same DynamoDB table can have a different number of attributes.', a: true, e: 'DynamoDB is schemaless beyond the primary key.' },
    { t: 'match', i: 1, c: 'Primary keys', q: 'Match each primary key type with its definition.', p: [['Simple primary key', 'Partition key only'], ['Composite primary key', 'Partition key and sort key'], ['Partition key', 'Hash attribute (KeyType HASH)'], ['Sort key', 'Range attribute (KeyType RANGE)']], e: 'Simple vs composite; HASH vs RANGE.' },
    { t: 'mcq', c: 'Primary keys', q: 'The SensorReadings table uses SensorId and Time as its key. What kind of key is this?', o: ['Composite primary key', 'Simple primary key', 'Global secondary index', 'Foreign key'], e: 'Partition key + sort key = composite.' },
    { t: 'tf', c: 'Primary keys', q: 'Two items in a DynamoDB table can have the same primary key.', a: false, e: 'No two items can have the same key.' },

    { t: 'mcq', i: 1, c: 'Partitions', q: 'How does DynamoDB decide which partition stores an item?', o: ['A hash function uses the partition key value as input', 'Items are stored in the order they were created', 'The sort key alone determines the partition', 'A random partition is chosen each time'], e: 'The hash of the partition key determines the partition.' },
    { t: 'mcq', i: 1, c: 'Partitions', q: 'With a composite primary key, how are items with the same partition key stored?', o: ['Together, in ascending order by sort key', 'In different partitions, randomly', 'In descending order by creation time', 'In separate tables'], e: 'Same partition key items are stored together, sorted by sort key.' },

    { t: 'match', i: 1, c: 'Secondary indexes', q: 'Match each index type with its key structure.', p: [['Global secondary index', 'Different partition key and sort key from the base table'], ['Local secondary index', 'Same partition key as the base table, different sort key']], e: 'GSI = different keys; LSI = same partition key.' },
    { t: 'mcq', i: 1, c: 'Secondary indexes', q: 'The Music table key is Artist + SongTitle. You create an index with Genre + AlbumTitle. What kind of index is it?', o: ['Global secondary index', 'Local secondary index', 'Composite primary key', 'Stream'], e: 'Different partition key → GSI.' },
    { t: 'mcq', i: 1, c: 'Secondary indexes', q: 'The Music table key is Artist + SongTitle. You create an index with Artist + AlbumTitle. What kind of index is it?', o: ['Local secondary index', 'Global secondary index', 'Simple primary key', 'Global table'], e: 'Same partition key, different sort key → LSI.' },
    { t: 'mcq', c: 'Secondary indexes', q: 'Why do you use a secondary index?', o: ['To query data based on non-primary-key attributes', 'To back up a table', 'To replicate data across Regions', 'To encrypt data'], e: 'Secondary indexes define an alternate key for queries.' },
    { t: 'tf', c: 'Secondary indexes', q: 'A local secondary index can have a different partition key from the base table.', a: false, e: 'An LSI has the same partition key and a different sort key. A GSI can have a different partition key.' },

    { t: 'match', i: 1, c: 'Read consistency', q: 'Match each use case with the read consistency it needs.', p: [['Blog posts', 'Eventually consistent read'], ['Scoreboards and booking systems', 'Strongly consistent read']], e: 'Eventual may be stale; strong returns most up-to-date data.' },
    { t: 'tf', i: 1, c: 'Read consistency', q: 'An eventually consistent read might return slightly stale data if it happens immediately after a write.', a: true, e: 'Copies are usually consistent within a second.' },
    { t: 'mcq', i: 1, c: 'Transactions', q: 'What do DynamoDB transactions provide?', o: ['All-or-nothing, ACID changes across multiple items and tables', 'Partial success with retries', 'Cross-Region strong consistency', 'Automatic backups'], e: 'Transactions are coordinated, all-or-nothing and ACID.' },

    { t: 'match', i: 1, c: 'Capacity units', q: 'Match each capacity unit with its definition.', p: [['1 RCU', '1 strongly consistent read per second for items up to 4 KB'], ['1 WCU', '1 write per second for items up to 1 KB'], ['Eventually consistent reads', 'Use half the provisioned read capacity']], e: 'RCU = 4 KB strong read (or 2 eventual); WCU = 1 KB write.' },
    { t: 'mcq', i: 1, c: 'Capacity units', q: 'You must read 20 items of 11 KB every second with eventual consistency. How many RCUs?', o: ['30', '60', '55', '20'], e: '11 KB → 12 → 3 RCU each × 20 = 60 → ÷2 = 30.' },
    { t: 'mcq', i: 1, c: 'Capacity units', q: 'You must write 120 items of 7 KB every minute. How many WCUs?', o: ['14', '840', '7', '120'], e: '120/min = 2/s; 7 WCU each × 2 = 14.' },
    { t: 'mcq', i: 1, c: 'Capacity units', q: 'You need 10 strongly consistent reads per second of 6 KB items. How many RCUs?', o: ['20', '10', '15', '30'], e: '6 KB → 8 KB → 2 RCU each × 10 = 20 (no halving for strong).' },
    { t: 'mcq', c: 'Capacity units', q: 'You need 8 eventually consistent reads per second of 4 KB items. How many RCUs?', o: ['4', '8', '16', '2'], e: '4 KB = 1 RCU × 8 = 8 ÷ 2 = 4.' },
    { t: 'match', i: 1, c: 'Throughput modes', q: 'Match each throughput mode with its description.', p: [['Provisioned', 'You set throughput as RCUs and WCUs'], ['On-demand', 'Pay-per-request, adapts to unpredictable traffic']], e: 'Provisioned vs on-demand.' },
    { t: 'mcq', c: 'Throughput modes', q: 'You are creating a new table with an unknown workload and unpredictable traffic. Which capacity mode fits best?', o: ['On-demand', 'Provisioned with 1 RCU', 'Provisioned with reserved capacity', 'Global tables'], e: 'On-demand suits unknown workloads and unpredictable traffic.' },
    { t: 'tf', c: 'Throughput modes', q: 'One WCU covers one write per second for items up to 4 KB.', a: false, e: '1 WCU = one 1 KB write per second. 4 KB is the RCU item size.' },

    { t: 'mcq', i: 1, c: 'Streams', q: 'What are DynamoDB Streams?', o: ['A time-ordered sequence of item-level changes in a table', 'A way to scan all items faster', 'A backup that lasts 35 days', 'A secondary index type'], e: 'Streams capture item-level modifications.' },
    { t: 'tf', i: 1, c: 'Streams', q: 'DynamoDB streams are composed of shards and can be consumed by AWS Lambda.', a: true, e: 'Section 7 takeaway.' },
    { t: 'mcq', i: 1, c: 'Global tables', q: 'What do DynamoDB global tables provide?', o: ['A multi-Region, multi-active database without building your own replication', 'A single-Region read replica only', 'A cross-account backup', 'A SQL interface for DynamoDB'], e: 'Global tables replicate across the Regions you choose.' },
    { t: 'mcq', c: 'Global tables', q: 'How do global tables resolve concurrent updates to the same item in different Regions?', o: ['Last writer wins', 'First writer wins', 'The update is rejected', 'The user is asked to choose'], e: 'Last writer wins reconciliation.' },
    { t: 'tf', i: 1, c: 'Global tables', q: 'DynamoDB supports strongly consistent reads across AWS Regions with global tables.', a: false, e: 'Strongly consistent reads must happen in the same Region as the writes.' },

    { t: 'match', i: 1, c: 'Backup', q: 'Match each backup feature to its description.', p: [['On-demand backup', 'Full table backup you create any time'], ['Point-in-time recovery', 'Restore to any point in the last 35 days']], e: 'On-demand vs PITR.' },

    { t: 'match', i: 1, c: 'API operations', q: 'Match each operation to its category.', p: [['CreateTable', 'Control operation'], ['PutItem / GetItem', 'Data operation'], ['BatchWriteItem', 'Batch operation'], ['TransactWriteItems', 'Transaction operation']], e: 'Control, data, batch, transaction.' },
    { t: 'match', i: 1, c: 'Data operations', q: 'Match each DynamoDB operation to what it does.', p: [['PutItem', 'Creates a new item or replaces an existing one'], ['UpdateItem', 'Edits attributes, or adds the item if it doesn\'t exist'], ['DeleteItem', 'Deletes a single item by primary key'], ['GetItem', 'Reads one item by primary key']], e: 'CRUD operations.' },
    { t: 'tf', i: 1, c: 'Data operations', q: 'PutItem fails if an item with the same primary key already exists.', a: false, e: 'PutItem replaces (overwrites) the existing item unless you add a condition.' },
    { t: 'mcq', i: 1, c: 'Condition expressions', q: 'You want to set accountLocked = N only if the last failed login was more than 24 hours ago. What do you use?', o: ['A condition expression on UpdateItem', 'A Scan with a filter', 'A global secondary index', 'A DynamoDB stream'], e: 'Condition expressions make writes conditional.' },
    { t: 'mcq', i: 1, c: 'Query vs Scan', q: 'Which operation reads ALL items in a table or index?', o: ['Scan', 'Query', 'GetItem', 'BatchGetItem'], e: 'Scan reads every item; Query uses the key condition.' },
    { t: 'tf', i: 1, c: 'Query vs Scan', q: 'A Query operation is more efficient than a Scan operation.', a: true, e: 'Query targets a partition key; Scan reads everything.' },
    { t: 'mcq', i: 1, c: 'Pagination', q: 'What is the maximum amount of data a single Query or Scan returns before pagination?', o: ['1 MB', '4 KB', '16 MB', '400 KB'], e: 'The 1-MB pagination limit.' },
    { t: 'tf', i: 1, c: 'Batch vs transaction', q: 'If one request in a batch operation fails, the entire batch fails.', a: false, e: 'Batch: partial failures are returned for retry. Transaction: one failure fails all.' },
    { t: 'tf', i: 1, c: 'Batch vs transaction', q: 'If one operation in TransactWriteItems fails, the entire transaction fails.', a: true, e: 'Transactions are all-or-nothing.' },
    { t: 'mcq', c: 'Batch vs transaction', q: 'Which operation contains a read set of one or more GetItem operations across multiple tables, all-or-nothing?', o: ['TransactGetItems', 'BatchGetItem', 'Scan', 'Query'], e: 'TransactGetItems = read set; TransactWriteItems = write set.' },
    { t: 'mcq', i: 1, c: 'Read consistency', q: 'A booking system must always read the latest seat availability right after a write. Which read type should it use?', o: ['Strongly consistent read', 'Eventually consistent read', 'Scan with a filter', 'Global table read in another Region'], e: 'Strongly consistent reads return the most up-to-date data.' },
    { t: 'mcq', i: 1, c: 'Query vs Scan', q: 'An app frequently scans an entire DynamoDB table to find items by a non-key attribute, and it is slow and expensive. What should the developer do?', o: ['Create a global secondary index on that attribute and use Query', 'Increase the Scan Limit', 'Switch to eventually consistent Scan', 'Use BatchWriteItem'], e: 'Use an index + Query instead of Scan.' },
    { t: 'dnd', i: 1, c: 'Data operations', q: 'Drag each DynamoDB data operation into Read or Write.', p: [['GetItem', 'Read'], ['Query', 'Read'], ['Scan', 'Read'], ['PutItem', 'Write'], ['UpdateItem', 'Write'], ['DeleteItem', 'Write']], e: 'Read: GetItem, Query, Scan. Write: PutItem, UpdateItem, DeleteItem.' },
    {"t": "match", "i": 1, "c": "Exam-style", "q": "You are developing the following applications. Match the Amazon database that best supports each one.", "p": [["Fraud detection (complex relationships)", "Amazon Neptune"], ["App that needs a database compatible with MySQL and PostgreSQL", "Amazon Aurora"], ["Business application that needs persistent storage and ACID transactions at internet scale", "Amazon DynamoDB"], ["Application that needs in-memory caching and real-time analytics", "Amazon ElastiCache"]], "e": "Neptune: graph database (fraud detection, recommendations). Aurora: relational, MySQL and PostgreSQL compatible. DynamoDB: key-value/document with ACID transactions for persistent storage. ElastiCache: in-memory store for caching, sessions and real-time analytics.", "x": ["Amazon S3 Glacier", "Amazon ECR"]},
    {"t": "match", "i": 1, "c": "Exam-style", "q": "You store this data in one DynamoDB table, using the animal group as the partition key and the animal name as the sort key. Match each group to the keys it uses.", "p": [["Fish: Seabass, Hamour, Salmon", "1 partition key value, 3 sort key values"], ["Birds: Canary, Pigeon, Duck, Chicken, Nightingale", "1 partition key value, 5 sort key values"], ["Cattle: Sheep, Cow, Camel, Goat", "1 partition key value, 4 sort key values"], ["Insects: Fly, Bee", "1 partition key value, 2 sort key values"]], "e": "With a composite primary key, items that share a partition key value are grouped together and ordered by the sort key. Each group is one partition key value; each animal in it is one sort key value. The table has 4 partition key values and 14 items.", "x": ["2 partition key values, 2 sort key values", "4 partition key values, 1 sort key value"]},
    {"t": "mcq", "i": 1, "c": "Capacity units", "q": "How many RCUs must you provision to read 40 items that are 16 KB in size every second with eventual consistency?", "o": ["80", "160", "40", "100"], "e": "16 KB / 4 KB = 4 RCUs per item. 4 × 40 = 160 for strongly consistent reads. Eventually consistent halves it: 160 / 2 = 80 RCUs."},
    {"t": "mcq", "i": 1, "c": "Capacity units", "q": "How many RCUs must you provision to read 20 items that are 6 KB in size every second with strong consistency?", "o": ["40", "20", "30", "60"], "e": "Round 6 KB up to 8 KB: 8 / 4 = 2 RCUs per item. 2 × 20 = 40 RCUs (no halving for strong consistency)."},
    {"t": "mcq", "i": 1, "c": "Capacity units", "q": "How many WCUs must you provision to write 10 items that are 2.5 KB in size every second?", "o": ["30", "25", "20", "10"], "e": "1 WCU = one 1 KB write per second. Round 2.5 KB up to 3 KB = 3 WCUs per item. 3 × 10 = 30 WCUs."},
    {"t": "mcq", "i": 1, "c": "Backups", "q": "You are developing an application that uses Amazon DynamoDB, and you accidentally deleted some records. Which backup feature lets you restore the table to just before the deletion?", "o": ["Point-in-time recovery", "DynamoDB Streams", "Increasing the table's RCUs", "A global secondary index"], "e": "Point-in-time recovery protects against accidental writes and deletes and can restore the table to any point in the last 35 days. On-demand backups are full backups you create for long-term retention."},
    {"t": "mcq", "c": "Capacity calculations", "i": 1, "q": "How many RCUs must you provision to read 15 items that are 9 KB in size every second with strong consistency?", "o": ["45", "34", "30", "23"], "e": "Round 9 KB up to the next multiple of 4 (12 KB), divide by 4 KB = 3 RCUs per item, multiply by 15 items per second = 45. Strong consistency is not halved."},
    {"t": "mcq", "c": "Capacity calculations", "i": 1, "q": "An application reads 600 items that are 8 KB in size every minute, using eventually consistent reads. How many RCUs must you provision?", "o": ["10", "20", "300", "600"], "e": "600 per minute = 10 per second. 8 KB / 4 KB = 2 RCUs per item, x 10 = 20 for strong consistency; divide by 2 for eventual consistency = 10."},
    {"t": "mcq", "c": "Capacity calculations", "i": 1, "q": "An application must read 1,200 items that are 3 KB in size every minute with strong consistency. How many RCUs must you provision?", "o": ["20", "10", "15", "1200"], "e": "1,200 per minute = 20 per second. 3 KB rounds up to 4 KB = 1 RCU per item, x 20 = 20. Strongly consistent, so no halving."},
    {"t": "mcq", "c": "Capacity calculations", "q": "How many RCUs must you provision to read 50 items that are 1 KB in size every second with eventual consistency?", "o": ["25", "13", "50", "100"], "e": "Items smaller than 4 KB still use a full 4 KB read unit: 1 RCU x 50 = 50 for strong consistency, divided by 2 for eventual consistency = 25."},
    {"t": "mcq", "c": "Capacity calculations", "i": 1, "q": "How many RCUs must you provision to read 25 items that are 13 KB in size every second with eventual consistency?", "o": ["50", "41", "100", "82"], "e": "Round 13 KB up to 16 KB, divide by 4 = 4 RCUs per item, x 25 = 100, divide by 2 for eventual consistency = 50."},
    {"t": "match", "c": "Capacity calculations", "q": "An application reads 30 items that are 12 KB in size every second. Match each read type with the RCUs needed.", "p": [["Strongly consistent reads", "90"], ["Eventually consistent reads", "45"]], "x": ["30", "180"], "e": "12 KB / 4 KB = 3 RCUs per item, x 30 = 90 for strong consistency. Eventually consistent reads use half the capacity: 45."},
    {"t": "mcq", "c": "Capacity calculations", "q": "A table is provisioned with 100 RCUs. How many eventually consistent reads per second of items up to 4 KB can it support?", "o": ["200", "100", "50", "400"], "e": "One RCU is one strongly consistent read per second, or two eventually consistent reads per second, for items up to 4 KB. 100 x 2 = 200."},
    {"t": "mcq", "c": "Capacity calculations", "i": 1, "q": "How many WCUs must you provision to write 15 items that are 3.5 KB in size every second?", "o": ["60", "53", "45", "15"], "e": "1 WCU = one 1 KB write per second. 3.5 KB rounds up to 4 KB = 4 WCUs per item, x 15 = 60."},
    {"t": "mcq", "c": "Capacity calculations", "i": 1, "q": "An application writes 300 items that are 1.5 KB in size every minute. How many WCUs must you provision?", "o": ["10", "8", "5", "600"], "e": "300 per minute = 5 per second. 1.5 KB rounds up to 2 KB = 2 WCUs per item, x 5 = 10."},
    {"t": "mcq", "c": "Capacity calculations", "q": "How many WCUs must you provision to write 40 items that are 0.5 KB in size every second?", "o": ["40", "20", "10", "80"], "e": "Each write uses at least 1 WCU (writes of up to 1 KB), so 0.5 KB rounds up to 1 KB: 1 x 40 = 40."},
    {"t": "mcq", "c": "Capacity calculations", "q": "An application writes 180 items that are 6 KB in size every minute. How many WCUs must you provision?", "o": ["18", "1080", "6", "36"], "e": "180 per minute = 3 per second. A 6 KB item needs 6 WCUs, x 3 = 18."},
    {"t": "order", "c": "Capacity calculations", "i": 1, "q": "Put the steps for calculating the RCUs needed for eventually consistent reads in order.", "s": ["Round the item size up to the next multiple of 4 KB", "Divide by 4 KB to get RCUs per item", "Multiply by the number of items read per second", "Divide by 2 for eventual consistency"], "e": "The slide method: e.g. 11 KB -> 12 KB, /4 = 3, x 20 items = 60, /2 = 30 RCUs."},
    {"t": "order", "c": "Capacity calculations", "q": "Put the steps for calculating WCUs for a per-minute write rate in order.", "s": ["Round the item size up to the next whole KB to get WCUs per item", "Convert items per minute to items per second", "Multiply WCUs per item by items per second"], "e": "Slide example: a 7 KB item needs 7 WCUs; 120 items per minute = 2 per second; 7 x 2 = 14 WCUs."},
    {"t": "tf", "c": "Read consistency", "i": 1, "q": "A strongly consistent read returns the most up-to-date data, reflecting all prior successful writes.", "a": true, "e": "Strongly consistent reads return the most up-to-date data; only eventually consistent reads might return stale data."},
    {"t": "tf", "c": "Read consistency", "i": 1, "q": "A strongly consistent read might return stale data if it is performed immediately after a write.", "a": false, "e": "That describes an eventually consistent read. A strongly consistent read always reflects all prior successful writes."},
    {"t": "tf", "c": "Read consistency", "q": "Strongly consistent reads are supported on global secondary indexes.", "a": false, "e": "The notes state that consistent reads are not supported on global secondary indexes."},
    {"t": "mcq", "c": "Read consistency", "q": "How soon are all copies of DynamoDB data usually consistent after a write?", "o": ["Within a second", "Within 24 hours", "Within 35 days", "Only after a strongly consistent read"], "e": "DynamoDB keeps multiple copies across Availability Zones; all copies are usually consistent within a second after a write."},
    {"t": "tf", "c": "Read consistency", "q": "GetItem uses strongly consistent reads by default.", "a": false, "e": "GetItem uses eventually consistent reads by default; you can request a strongly consistent read instead."},
    {"t": "mcq", "c": "Global tables", "i": 1, "q": "Your customers in North America, Europe, and Asia update their profiles in a CustomerProfiles table. You want the data kept in sync across three Regions without writing your own replication code. What should you use?", "o": ["DynamoDB global tables", "Three separate tables and custom replication code", "A local secondary index in each Region", "Point-in-time recovery"], "e": "Global tables deploy a multi-Region, multi-active database without building and maintaining your own replication; DynamoDB propagates changes to all replicas."},
    {"t": "order", "c": "Global tables", "q": "Put the steps of global table data replication in order.", "s": ["A change is made in one replica table", "The change is recorded in a DynamoDB stream", "The change is propagated to the other replicas"], "e": "Global tables use DynamoDB Streams to propagate changes between replicas, usually within seconds."},
    {"t": "tf", "c": "Global tables", "q": "A global table can replicate only some of a table's items to other Regions.", "a": false, "e": "Each replica stores the same set of data items; DynamoDB does not support partial replication."},
    {"t": "tf", "c": "Global tables", "q": "A global table can have only one replica table per AWS Region.", "a": true, "e": "Any given global table can only have one replica table per Region, and each replica has the same table name and primary key schema."},
    {"t": "tf", "c": "Global tables", "q": "When you create a global table, you specify the AWS Regions where you want the table to be available.", "a": true, "e": "You choose the Regions; DynamoDB creates identical tables in them and propagates ongoing changes."},
    {"t": "mcq", "c": "Batch operations", "i": 1, "q": "What is the maximum a single BatchGetItem call can read?", "o": ["Up to 100 items, up to 16 MB of data", "Up to 25 items, up to 16 MB of data", "Up to 100 items, up to 1 MB of data", "Up to 25 items, up to 400 KB of data"], "e": "BatchGetItem reads up to 16 MB of data that consists of up to 100 items from multiple tables."},
    {"t": "mcq", "c": "Batch operations", "i": 1, "q": "What is the maximum a single BatchWriteItem call can write?", "o": ["Up to 25 PUT or DELETE requests, up to 16 MB of data", "Up to 100 PUT or DELETE requests, up to 16 MB of data", "Up to 25 PUT or UPDATE requests, up to 1 MB of data", "Up to 100 items, up to 400 KB of data"], "e": "BatchWriteItem writes up to 16 MB of data made of up to 25 PUT or DELETE requests to multiple tables."},
    {"t": "match", "c": "Batch operations", "i": 1, "q": "Match each batch limit with its value.", "p": [["Maximum items in one BatchGetItem", "100"], ["Maximum PUT or DELETE requests in one BatchWriteItem", "25"], ["Maximum data in one BatchGetItem or BatchWriteItem call", "16 MB"], ["Maximum size of one item", "400 KB"]], "x": ["1 MB", "4 KB"], "e": "BatchGetItem: 100 items / 16 MB; BatchWriteItem: 25 PUT or DELETE requests / 16 MB; an item can be up to 400 KB."},
    {"t": "mcq", "c": "Batch operations", "q": "A BatchWriteItem call returns some requests as failed. What should the application do?", "o": ["Retry using the failed keys and data returned by the operation", "Resend the entire batch because the whole batch failed", "Switch to TransactWriteItems to retry", "Nothing; DynamoDB retries automatically"], "e": "If one request in a batch fails, the entire operation does not fail; retry with the failed keys and data returned by the operation."},
    {"t": "multi", "c": "Batch operations", "q": "What are benefits of using batch operations instead of single PutItem or DeleteItem calls? Select more than one answer.", "o": ["Higher throughput by handling multiple items in one request", "Parallelism without managing multiple threads yourself", "Lower average latency for multiple writes", "All-or-nothing changes across all items"], "k": 3, "e": "Batch operations give higher throughput, parallelism without managing threads, and lower average latency. They are not all-or-nothing; that is what transactions provide."},
    {"t": "tf", "c": "Batch operations", "q": "BatchWriteItem can perform UpdateItem requests.", "a": false, "e": "BatchWriteItem consists of PUT or DELETE requests. TransactWriteItems is the operation that can include UpdateItem."},
    {"t": "mcq", "c": "DynamoDB components", "i": 1, "q": "What is the maximum size of a DynamoDB item?", "o": ["400 KB", "4 KB", "1 MB", "16 MB"], "e": "An item's size is the sum of its attribute name and value lengths, and an item can be up to 400 KB."},
    {"t": "match", "c": "DynamoDB components", "q": "Match each DynamoDB attribute value type with its category.", "p": [["Number, string, binary, Boolean, null", "Scalar types"], ["String set, number set, binary set", "Set types"], ["List and map", "Document types"]], "x": ["Key types"], "e": "DynamoDB attribute values can be scalar, set (multi-value), or document types."},
    {"t": "tf", "c": "DynamoDB components", "q": "DynamoDB can be used as both a key-value store and a document store.", "a": true, "e": "DynamoDB is a key-value and document database; the primary key is the key and the remaining attributes are the value."},
    {"t": "tf", "c": "Partitions", "q": "With a simple primary key, items in a partition are stored in sorted order by key.", "a": false, "e": "With a simple primary key the hash of the partition key picks the partition, and items are not stored in sorted order. Sorting by sort key happens only with a composite key."},
    {"t": "multi", "c": "Partitions", "q": "Which statements about DynamoDB partitions are true? Select more than one answer.", "o": ["They are backed by solid state drives (SSDs)", "They are automatically replicated across multiple Availability Zones in a Region", "Partition management is handled entirely by DynamoDB", "You must manually assign each item to a partition"], "k": 3, "e": "A partition is SSD-backed storage, automatically replicated across multiple AZs, and fully managed by DynamoDB, which places items by hashing the partition key."},
    {"t": "tf", "c": "Throughput modes", "q": "Provisioned throughput is divided evenly among a table's partitions.", "a": true, "e": "DynamoDB divides throughput evenly among partitions: per-partition throughput is total provisioned throughput divided by the number of partitions."},
    {"t": "mcq", "c": "Throughput modes", "i": 1, "q": "What happens when an application exceeds the provisioned throughput of a table?", "o": ["Its requests are subject to throttling", "DynamoDB switches the table to on-demand mode", "Extra requests are queued in a DynamoDB stream", "The table is replicated to another Region"], "e": "Provisioned throughput is the maximum capacity an application can consume; exceeding it makes requests subject to throttling."},
    {"t": "match", "c": "Secondary indexes", "i": 1, "q": "Match each statement to the index type it describes.", "p": [["Has its own provisioned throughput, separate from the table", "Global secondary index"], ["Shares provisioned throughput with the table", "Local secondary index"], ["Has no size limitations", "Global secondary index"], ["Indexed items per partition key value can't exceed 10 GB", "Local secondary index"], ["Up to 20 per table (default limit)", "Global secondary index"], ["Up to 5 per table", "Local secondary index"]], "e": "A GSI spans all partitions, has no size limit, its own throughput and up to 20 per table; an LSI is scoped to one partition key value (10 GB), shares throughput and up to 5 per table."},
    {"t": "multi", "c": "Secondary indexes", "q": "What does a secondary index contain? Select more than one answer.", "o": ["Alternate-key attributes", "Primary-key attributes of the base table", "An optional subset of other attributes (projected attributes)", "All items from every table in the account"], "k": 3, "e": "A secondary index holds the alternate key, the base table's primary key attributes, and optionally projected attributes."},
    {"t": "multi", "c": "Transactions", "q": "Which are use cases for DynamoDB transactions? Select more than one answer.", "o": ["Processing financial transactions", "Fulfilling and managing orders", "Building multiplayer game engines", "Storing billions of graph relationships", "In-memory caching of session data"], "k": 3, "e": "The slide lists financial transactions, order fulfillment, multiplayer game engines, and coordinating distributed components as transaction use cases."},
    {"t": "tf", "c": "Transactions", "q": "Transactions are enabled on DynamoDB global tables by default.", "a": false, "e": "Transactions are enabled for single-Region tables but disabled on global tables by default; cross-Region replication is asynchronous."},
    {"t": "mcq", "c": "Streams", "i": 1, "q": "An ad server must react whenever user preferences change in a DynamoDB table. Which feature captures these item-level changes?", "o": ["DynamoDB Streams", "Global secondary index", "Point-in-time recovery", "BatchGetItem"], "e": "DynamoDB Streams capture a time-ordered sequence of item-level modifications that other applications can process in near-real time."},
    {"t": "mcq", "c": "Streams", "i": 1, "q": "How long are stream records kept in a DynamoDB stream?", "o": ["Up to 24 hours", "Up to 35 days", "Up to 7 days", "Until you delete the table"], "e": "DynamoDB Streams store item-level changes for up to 24 hours; stream records in a shard are removed automatically after 24 hours."},
    {"t": "tf", "c": "Streams", "q": "A DynamoDB stream can be configured to capture both the before and after images of modified items.", "a": true, "e": "Stream records include the primary key of modified items and can be configured to capture before and after images."},
    {"t": "mcq", "c": "Backup and restore", "q": "You must keep full copies of a table for long-term data retention and archiving to meet regulations. Which feature fits?", "o": ["On-demand backups", "Point-in-time recovery", "DynamoDB Streams", "Global tables"], "e": "On-demand backups create full table backups for long-term retention and archiving; point-in-time recovery only covers the last 35 days."},
    {"t": "multi", "c": "Backup and restore", "q": "Which statements about DynamoDB on-demand backups are true? Select more than one answer.", "o": ["There is no limit to the number of on-demand backups", "Backups do not consume provisioned throughput", "Each on-demand backup contains the entire table data", "Backups can be restored only within 24 hours"], "k": 3, "e": "Each on-demand backup is a full backup, there is no limit on how many you take, and backups do not consume provisioned throughput."},
    {"t": "tf", "c": "API operations", "q": "If a condition expression on PutItem, UpdateItem, or DeleteItem evaluates to false, the operation fails.", "a": true, "e": "Condition expressions decide whether an item should be modified: true means success, otherwise the operation fails."},
    {"t": "tf", "c": "API operations", "q": "You can read and write items in a new table as soon as CreateTable returns a status of CREATING.", "a": false, "e": "CreateTable is asynchronous; you can read and write only after the TableStatus becomes ACTIVE."},
    {"t": "mcq", "c": "API operations", "q": "A Query operation finds no items that match its key condition. What does it return?", "o": ["An empty result set", "An error", "All items in the table", "The last item written"], "e": "Query returns the items that match the conditions; if none match, it returns an empty result set."},
    {"t": "mcq", "c": "API operations", "q": "What does the Limit setting of a Query or Scan control?", "o": ["The maximum number of items returned", "The maximum item size in KB", "The number of RCUs consumed per second", "The number of partitions read"], "e": "Besides the 1 MB page limit, you can set Limit to the maximum number of items a Query or Scan returns."},
    {"t": "tf", "c": "API operations", "q": "Control operations such as CreateTable also let you work with indexes and streams.", "a": true, "e": "Control operations create and manage tables and let you work with indexes, streams, and other objects that depend on tables."},
    {"t": "dnd", "c": "Database types", "q": "Drag each traditional database into relational or nonrelational.", "p": [["Microsoft SQL Server", "Relational"], ["Oracle Database", "Relational"], ["MySQL", "Relational"], ["MongoDB", "Nonrelational"], ["Cassandra", "Nonrelational"], ["Redis", "Nonrelational"]], "e": "The slide lists SQL Server, Oracle, and MySQL as traditional relational databases, and MongoDB, Cassandra, and Redis as nonrelational."},
    {"t": "mcq", "c": "Database types", "q": "Your application's read/write rates exceed what a traditional SQL database can economically support. Which type of database should you choose?", "o": ["Nonrelational", "Relational", "A relational database with a stricter schema", "A relational database scaled vertically"], "e": "Choose nonrelational when you need horizontal scaling, data doesn't fit traditional schemas, or read/write rates exceed what SQL databases support economically."},
    {"t": "mcq", "c": "Database types", "q": "Amazon Aurora can be up to how much faster than standard MySQL?", "o": ["Five times", "Three times", "Ten times", "Two times"], "e": "Aurora is up to five times faster than standard MySQL and up to three times faster than standard PostgreSQL."},
    {"t": "tf", "c": "Database types", "q": "Amazon DynamoDB delivers single-digit millisecond performance.", "a": true, "e": "DynamoDB is a multi-Region, multi-active, durable key-value and document database with single-digit millisecond performance."}
  ]
});
