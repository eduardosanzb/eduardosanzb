# Pyton POC TDD
## Problem Statement

This project aims to build a personal assistant for managing WhatsApp messages. It will summarize daily messages, track important conversations, provide reply reminders, and offer AI-powered reply suggestions, all while prioritizing user privacy by keeping data and LLM processing local.

**Problems to Solve**:
1. **Message Management**: Efficiently summarize and track relevant WhatsApp messages.
2. **Reply Reminders**: Implement reminders for important messages or pending responses.
3. **AI Assistance**: Use a local Language Model (LLM) to generate reply suggestions.
4. **Data Privacy**: Ensure all data processing and AI computations are done locally to protect user privacy.


This project serves as a learning opportunity for Python, AWS infrastructure, modern Python tooling, and local LLM exploration.
Furthermore exposes a Design driven project.

## Summary
For further understanding of the explored **Workflows** of the system, pleaser read the [python-poc.spec.md](https://github.com/eduardosanzb/eduardosanzb/blob/master/notes/python-poc.spec.md)

**Key Components**

- **Backend**: FastAPI application for handling API requests, querying the database, triggering message summarization, managing conversation importance and reminders, and interacting with a local LLM.
- **Database**: PostgreSQL for storing chat messages and metadata locally.
- **Integration**:
  - WhatsApp: Use web-whatsapp.js to extract chat logs and send them to the backend.
  - Telegram: Utilize the Python Telegram Bot library for bot interactions.
  - Local LLM: Integrate llama.cpp for message summaries and reply suggestions.


## Resources

-   [Transitioning from JavaScript to Python](https://medium.com/@JeffyJeff/transitioning-from-javascript-to-python-bridging-the-scripting-divide-7a78f9e76752)
-   [Python Telegram Bot Library](https://python-telegram-bot.readthedocs.io/en/latest/)
-   [FastAPI Documentation](https://fastapi.tiangolo.com/)
-   [PostgreSQL Documentation](https://www.postgresql.org/docs/)
-   [llama.cpp](https://github.com/ggerganov/llama.cpp) (Example Local LLM)

## Goals

* Improve efficiency in managing WhatsApp messages.
* Reduce the burden of responding to messages.
* Enhance message context and prioritization.
* Provide a private and secure solution.
* Provide a learning platform for Python, AWS, and LLM technologies.

## Functional Requirements
### Data Acquisition and Storage
* The system shall extract, parse and store WhatsApp messages relevant data.
* The system should have a way to update the database with new exported chat logs.
### Message Summarization and Context Enrichment
* The system shall provide a daily summary of received messages.
* The system shall use a local Large Language Model (LLM) to generate message summaries.
* The system shall identify and track important conversations based on user-defined criteria (e.g., keywords, sender).
* The system shall enrich messages with context (e.g., sentiment analysis, topic identification).
* The system must be able to index all conversations for later queries.
### Reply Reminders
* The system shall provide reminders for critical messages that require a reply.
* The system shall allow users to mark messages as critical.
* The system shall allow users to set reminder schedules.
### AI-Powered Reply Suggestions
* The system shall use a LLM to generate reply suggestions.
* The reply suggestions shall be based on message content and conversation context.
* The system should try to mimic the user writing style.
### User Interface
* The primary user interface shall be a Chat bot.
* The user shall be able to interact with the system using natural language commands.
* The bot shall receive chat exports and user queries.
* The bot shall send message summaries, reminders, and reply suggestions.
* The bot shall provide a conversational interface for interacting with the system.
### Configuration and Management
* The system shall provide configuration options for database connection, LLM settings, and reminder schedules.
* The system shall be deployable to cloud infrastructure.
* The system shall have logging and monitoring capabilities.

## Non-Functional Requirements

### Security
* _User data shall be processed and stored locally to ensure privacy._
### Usability
* The Chat bot interface shall be intuitive and easy to use.
* The system shall provide clear and concise information.
### Reliability
* The system shall be robust and handle errors gracefully.
* The system shall provide consistent results.
### Maintainability
* The system shall be designed for easy maintenance and updates.
* The code shall be well-documented.
### Scalability
* Initially the system will be used for 1 user. But potential scalability for multiple users would be nice.
### Portability
* The system shall be deployable to different environments (local, AWS).

## Technology Stack
* Python
* FastAPI
* PostgreSQL
* Telegram Bot API
* Local LLM (e.g., llama.cpp)
* AWS (Elastic Beanstalk/ECS, RDS)

## Deployment
* The system shall be deployable to AWS using CI/CD pipelines.
* Deployment scripts shall be provided for local development and production environments.

## Testing
* Unit tests shall be implemented for core logic.
* E2E tests shall be implemented to verify end-to-end functionality.
* API testing shall be implemented to verify API endpoints.

## Future Considerations
* Integration with other messaging platforms.
* Advanced LLM fine-tuning on personal writing style.
* Web-based user interface for advanced features.
* Automated chat export from Whatsapp.

### Out of Scope
-   Direct WhatsApp integration (due to API limitations). We'll rely on exporting chat history.
-   Building a complex web UI initially.  We'll start with a Telegram interface.
-   Fine-tuning the LLM on personal writing style (stretch goal).
-   Monorepo (for now, keep it simple).
-   Manage Reminders or User Preferences

## Exploration
For further understanding of the explored **Workflows** of the system, pleaser read the [python-poc.spec.md](https://github.com/eduardosanzb/eduardosanzb/blob/master/notes/python-poc.spec.md)
We can divide the exploration in the next blocks
1.  **Data Acquisition**
2.  **Core Backend**
3.  **Client Interface**

### Data Acquisition
We need to implement a mechanism to parse exported WhatsApp chat logs and POST them to the backend for storing and post-processing.

In this block, we have to split in the next challenges:
1. How to retrieve the messages, by using an export or by using a scraping method.
2. Mechanism to get the latest messages. A simple approach would be to have a "tick" process that is constantly checking for new messages.
3. How to send the data to the backend.

For point 1 & 2 probably we could think of 2 approaches:
A) Import all the messages once and then listen to new updates.
B) Have a script that runs as a tick which will process all the messages everytime.
Lets explore PROS/CONS of both of this ones

#### Approach A
This approach would require an initial data migration to be run. And to keep a server running all the time.

On the *positive* side, this would be the leanest approach and it could result in a "realtime" experience.

On the *negative* side it would be very prone to edge cases such as:
- Missing messages when the service is down
- Mechanism to validate all messages have been processed.
- Situations with multiple messages at the same time; could create a very chatty system

The initial migration could be done using the export conversation; nevertheless cannot export ALL conversations  AT ONCE; and we'd need to automate the clicking of doing this.

An example of the export file:
```text
[26.11.24, 12:32:35] Eduardo Sanchez: What’s the name of the restaurant that have multiple kitchens on Neukölln a
[26.11.24, 12:32:43] Eduardo Sanchez: We went there always with Bcg
[26.11.24, 12:34:06] Eduardo Sanchez: Paolo pinker!
[26.11.24, 12:49:53] Emre Bcg Personal: Ouff lamb chops and cocktails
[26.11.24, 12:50:03] Emre Bcg Personal: Having a company party ?
```

Furthermore we'll need to find a similar project as [Baileys](https://github.com/WhiskeySockets/Baileys) which impelements a websocket listener to whatsapp. _we could use this but then we are not using python_

Another idea is to rely on a stream platform such as apache kafka; but come one. Overkilling it.

#### Approach B
This approach could result in a more deterministic results. Because we'd run a script that fetches all the chats and attempt to discover unread messages.

In the *positive*:
- A more deterministic approach; given that we'd ensure all the chats have been processed.
- In the long run a lower resource approach; we can run this "tick" every n minutes on cron-basis.
- We can also attempt to optimize delta changes based on previous runs.

In the *negative*:
- We'd need to implement a mechanism to diff the already processed; tho we could also just leave this to the DB with some unique-indexes
- The processing of the chats could become a problem if we have a very big chat history
- We could encounter locking problems; in the case the processing gets too slow .

##### Open-Questions
- How to handle slow runs or avoid overlapping runners?
**There could be the situation that we schedule to run the script while an older one is still running. The main problem here is that we could be wasting resources.**

**To Solve this, we can have a very simple "lockin" mechanism using the backend api. Simple and noncomplicated. Because we'll not have a distrubuted system or any kind of concurrency**

- How to detect change detection?
**When looking at the Interface provided by `whatsapp-web.js` we can see they offer an `unreadCount` and `lastMessage`. We could use this values to infer a) if there are new messages b) when was the last message*

- Error handling?
**Given that we are going to run the sync in a cron-basis we can just create a reporting mechanism and throw it to the slack or something monitoring like**

- Security? # TODO
**Given that we only care to send data to our backend; we can ensure the container can only reach the ip for our backend. using dnsmasq from within our container.
In this way we do not have to have a more complex network setup and we can run our script in CI runners or cron jobs anywhere**


- Authentication session for wwweb
**We'll use the [Remote auth strategy](https://wwebjs.dev/guide/creating-your-bot/authentication.html#remoteauth-strategy) to store the sessions in the backend db.

Here is a POC:

```sh
#!/bin/bash

# Get the IP address of eduardosanzb.dev and set up iptables rules
EDUARDOSANZB_IP=$(dig +short eduardosanzb.dev | head -n 1)
echo "Eduardo's IP: $EDUARDOSANZB_IP"

# Set up iptables rules
iptables -A OUTPUT -d "$EDUARDOSANZB_IP" -p tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j DROP

# Curl to the allowed domain
echo "Curling to https://eduardosanzb.dev"
curl -sSf https://eduardosanzb.dev>/dev/null  && echo "Success!"

# Curl to the blocked domain
echo "Curling to https://google.com (should fail)"
curl -v -m 10 --connect-timeout 5 -sSf https://google.com && echo "Success!" || echo "Failed as expected!"

echo "finish"
```

```dockerfile
FROM alpine:latest

RUN apk add --no-cache curl iptables bind-tools dnsmasq

# Add the custom DNS configuration for dnsmasq
RUN echo "server=/eduardosanzb.dev/8.8.8.8" > /etc/dnsmasq.conf && \
    echo "address=/#/0.0.0.0" >> /etc/dnsmasq.conf

WORKDIR /
COPY ./test_curl.sh /test_curl.sh
RUN chmod +x /test_curl.sh

# Starting this bad boi
RUN dnsmasq

## The script will attempt to curl google and fail
CMD ["sh", "test_curl.sh"]
```


#### Recomendation
It seems that the approach B is a more maintanable and straightforward one. The only benefit we have with Approach A is the "realtime" experience which is not that important for us.

Tho we could leverage having some kind of message queue; this would entail having more moving parts; for now we'll keep the complexity low.

In the negative the approach A open the door for too many edge cases.

Regarding the implementation details; we could automate this by using a Selenium driver and automate it with python. Nevertheless we found a very good [javascript](https://wwebjs.dev/) implementation and it would feel super wrong to not use it. Furthermore we'll have other opportunities to practice python through this project.

We have to keep an eye on the processing time and to make sure if we should implement some kind of deferance or queue.

In summary:
**We are going to create a script that will get the messages from whatsapp using web-whatsapp.js. This script will be running in a cron basis. Firstly the script will check if there's another running script _(asking the backend `/lock`)_ and later on `POST`ing the chats/messages to the backend**

**As initial; we'll run the script on schedule using github actions scheduled jobs**


###  Backend
["hexagonal" diagram](https://excalidraw.com/#json=Oo-ud0PtztQG4T4s4eqQc,XbTi-8yYntL_K9Oh6EB70g)
The requirements for a backend are the next:
* [x] CRUD chats/messages
  * [x] Standarize & store
  * [x] Vectorize data
* [x] Triggering message summarization.
* [x] Managing conversation importance and reminders.
* [x] Actions
  * [x] Send Summary periodically
  * [x] Send reminders
  * [x] Automatic reply
  * [x] Custom reply
  * [x] Create cal event
  * [x] Ignore

The backend ensures all data processing and AI computations are done locally, prioritizing user privacy.

We can split this exploration in the next parts:
- Data Layer
    - Data ingestion/exposure
      - Define interfaces (OAS, Types, etc)
      - Ranking rules
    - Data Storage
      - DB setup
      - Migrations
      - Client
      - Vector data research
- Summary engine
  - LLm integration research
  - Testing Business Logic
- Actions (send/receive)
  - Integrations capabilities (which integrations)
    - interact with whatsapp
    - Connect googlecal
    - interact with telegram/slack
    - interact with email
  - Define CRUD interfaces for actions
  - Reminders engine

The common component between this parts is that we'll be coupling all of this functionality in one monolithic service. As a learning opportunity we'll use python instead of typescript or go.

#### Data Layer
This section is the foundation of the core backend; one of the main decisions we have to make here is to select the database technology; As constraints we have that this is a small project; so we want to prioritize simplicity nevertheless we also want to use the right tool.

##### The Database Technology
We first explore the rationale behind choosing a SQL database engine.SQL databases are well-established and offer robust features for structured data management, relational integrity, and efficient querying – all critical for our application's data requirements.
Without any doubt we can recommend to use a SQL database engine.

Subsequently to this decision in the exploration; we have to explore the database technology to use; the biggest contenders are PostgreSQL recoginzed for its enterpise-grade capabilities and the rich ecosystem such as `pgvector` or `supabase`; On the other-hand we have SQLite which stands out as simple, embedded nature and file-base, making it super lightweight and easy to deploy, the ecosystem is not as extensive but we found nice vector plugins such as `sqlite-vec`.

Considering the nature of the project and rapid development, our **recommendation for this section is to start with SQLite, architecture the data layer in a way that we can gradually if required migrate towards PostgreSQL**

##### Conceptual Data Model
We started by identifying the core entities needed for our personal chat application: `UserProfile`, `Contacts`, `Chats`, and `Messages`.
We recognized the need to store user preferences and decided to create a separate `SummaryPreferences` entity to manage settings related to chat summarization, keeping it distinct from the general `UserProfile`.
Throughout our discussion, we prioritized pragmatism and aimed for a balance between creating a solid foundation and avoiding over-engineering for the initial version

We refined our entities by considering the features of `whatsapp-web.js` and incorporating more specific message types and relevant properties to align with real-world chat data.
Key decisions included separating "critical contacts" as a property of the Contacts entity itself for broader usability and keeping keyword preferences within `SummaryPreferences` for content control during summarization.

**1. UserProfile**
*   **Purpose:** Represents the user of the personal software application itself. Stores the main user's profile information and general application preferences.
*   **Attributes:**
    *   `user_profile_id` (INTEGER, PRIMARY KEY, Auto-increment): Unique identifier for the user profile.
    *   `name` (TEXT, NOT NULL): User's display name.
    *   `email` (TEXT, Optional): User's email address.
    *   `preferred_language` (TEXT, Optional, default 'en'): User's preferred language for the application interface.
    *   `theme` (TEXT, Optional, default 'system'): Preferred application theme (e.g., 'light', 'dark', 'system').
    *   `timezone` (TEXT, Optional, default 'UTC'): User's timezone for displaying times and reminders.

**2. SummaryPreferences**
*   **Purpose:** Stores user-specific preferences related to chat summarization and reminder features. Linked one-to-one with `UserProfile`.
*   **Attributes:**
    *   `summary_preferences_id` (INTEGER, PRIMARY KEY, Auto-increment): Unique identifier for these preferences.
    *   `user_profile_id` (INTEGER, NOT NULL, UNIQUE, FOREIGN KEY referencing `UserProfile`): Foreign key linking to the associated `UserProfile`.
    *   `summary_frequency` (TEXT, NOT NULL, default 'daily', values: 'daily', 'weekly', 'scheduled', 'manual', 'off'): How often summaries are generated.
    *   `daily_summary_time` (TEXT, Optional, default '09:00'): Time of day for daily summaries (HH:MM format).
    *   `weekly_summary_day` (TEXT, Optional, default 'Monday', values: 'Monday', 'Tuesday', ..., 'Sunday'): Day of the week for weekly summaries.
    *   `scheduled_summary_times` (TEXT, Optional): JSON array of scheduled summary times (HH:MM strings).
    *   `summarize_chat_types` (TEXT, NOT NULL, default 'all', values: 'all', 'group_chats_only', 'one_to_one_chats_only'): Types of chats to include in summaries.
    *   `keywords_enabled` (BOOLEAN, NOT NULL, default FALSE): Enable keyword-based summarization.
    *   `keywords_list` (TEXT, Optional): JSON array of keywords for summarization.

**3. Contacts**
*   **Purpose:** Stores metadata about individuals with whom the user has chat conversations.
*   **Attributes:**
    *   `contact_id` (INTEGER, PRIMARY KEY, Auto-increment): Unique identifier for the contact in our application.
    *   `name` (TEXT, NOT NULL): The name the user uses for this contact.
    *   `phone_number` (TEXT, Optional): Contact's phone number.
    *   `email_address` (TEXT, Optional): Contact's email address.
    *   `chat_app_username` (TEXT, Optional): Contact's username on a chat application.
    *   `is_critical` (BOOLEAN, NOT NULL, default FALSE): Flag to mark if the contact is considered "critical".
    *   `contact_language` (TEXT, Optional, default NULL): Contact's preferred language for communication.

**4. Chats**
*   **Purpose:** Represents individual chat conversations within the application.
*   **Attributes:**
    *   `chat_id` (INTEGER, PRIMARY KEY, Auto-increment): Unique identifier for the chat conversation.
    *   `chat_type` (TEXT, NOT NULL, default 'one_to_one', values: 'one_to_one', 'group'): Type of chat conversation (1-on-1 or group).
    *   `chat_name` (TEXT, Optional): Name of the chat (especially for group chats).
    *   `chat_language` (TEXT, Optional, default NULL, values: 'en', 'de', 'es', 'auto'): The language of the conversation.
    *   `creation_date` (TEXT, Optional): Date and time when the chat was created.
    *   `last_message_date` (TEXT, Optional): Date and time of the last message in the chat.
    *   `has_unread_messages` (BOOLEAN, NOT NULL, default FALSE): Flag indicating if there are unread messages in the chat.

**5. Messages**
*   **Purpose:** Stores individual messages within chat conversations.
*   **Attributes:**
    *   `message_id` (INTEGER, PRIMARY KEY, Auto-increment): Unique identifier for the message.
    *   `chat_id` (INTEGER, NOT NULL, FOREIGN KEY referencing `Chats`): Foreign key linking to the `Chats` table, indicating which chat the message belongs to.
    *   `sender_type` (TEXT, NOT NULL, default 'contact', values: 'user_profile', 'contact'): Type of sender (either the main `UserProfile` or a `Contact`).
    *   `sender_id` (INTEGER, NOT NULL): ID of the sender (references either `user_profiles` or `contacts` based on `sender_type`).
    *   `sent_date` (TEXT, NOT NULL): Date and time when the message was sent.
    *   `message_type` (TEXT, NOT NULL, default 'text', values: 'text', 'image', 'video', 'audio', 'document', 'location', 'contact_card', 'sticker', 'system', 'other'): Type of message content.
    *   `text_content` (TEXT, Optional): Text content of the message (for text-based messages).
    *   `media_url` (TEXT, Optional): URL to media attachment (for media messages).
    *   `is_deleted` (BOOLEAN, NOT NULL, default FALSE): Flag indicating if the message has been marked as deleted.
    *   `is_forwarded` (BOOLEAN, NOT NULL, default FALSE): Flag indicating if the message is a forwarded message.
    *   `has_media` (BOOLEAN, NOT NULL, default FALSE): Flag indicating if the message has media attached.
    *   `message_embedding` (BLOB, Optional): Vector embedding of the message text content.

#### Interfaces and API design
In this section we'll explore how our system will interact.

##### API Design
We can categorize the domains for our API in the next ones, based in our [workflows](./python-poc.spec.md)
1. Message Sourcing and Processing `/messages`
`POST` `/messages`- Send WhatsApp messages to the backend for processing.

2. Message Summarization `/summarization`
`POST` `/summarization/start` - Trigger message summarization.
`GET` `/summarization/status` - Check summarization status.
`GET` `/summarization/result` - Retrieve summarization results.

3. User Requests for AI-Powered Replies
`POST /replies/generate` - Request AI-generated reply suggestion for a specific message.
`POST /replies/approve` - Approve the generated reply for sending.
`POST /replies/update-reply` - Update the reply with user addendums.

4. Custom Reply Proxy `/replies/custom`
`POST` `/replies/custom` - Proxy a custom reply to a specific conversation.

5. System Health and Status `/system/status`
`GET` `/system/status `- Retrieve system health and status.

~6. Reminder Management~ Out of scope

From this we can generate our FastAPI types, which eventually will be used to create OAS and TS definitions.

##### DB Client

Given that we'll use sqlite; we can use the library already provided by [python](https://docs.python.org/3/library/sqlite3.html)







#### Ranking Logic
- [ ] Ranking logic
  - [ ] Criteria: importance, recency, user interaction


#### Ranking Logic
- [ ] Vectorization: Research and implement data embeddings for LLM summarization
  - [ ] Tools:

#### Migrations
- [ ] Migrations and infrastructure
  - [x] Migrations with atlas

In our exploration of database migration management tools, we considered several popular open-source options including [Flyway](https://flywaydb.org/), [Liquibase](https://www.liquibase.org/), [dbmate](https://github.com/amacneil/dbmate) and [Atlas](https://atlasgo.io/). While each tool offers robust capabilities, Atlas stands out due to its modern, declarative approach to schema management, aligning well with infrastructure-as-code principles.

Atlas's language-agnostic nature, defining schemas in HCL or SQL and generating standard SQL migrations, ensures broad applicability regardless of the application's backend language.
Its workflow promotes standardized, version-controlled database evolution, crucial for maintainability and collaboration. Furthermore, Atlas is designed for seamless integration with CI/CD pipelines, automating schema updates as part of the development lifecycle.

**Our recommendation for this section is to adopt Atlas as our database migration management tool due to its modern declarative approach, language agnosticism, CI-friendly workflow, and potential for Terraform integration.**

We tested atlas by managing a simple schema with changes and applying the migrations, with the next workflow:


- Make changes to the `schema.hcl` file
- Run the command to generate the SQL migration file
`atlas migrate diff --dev-url "sqlite://dev?mode=memory" --to "file://schema.hcl"`
- To apply the migration
`atlas migrate status --env local`


#### SRE
  - [ ] Infra setup local vs cloud
    - [ ] AWS cost-effectiveness
    - [ ] Just a VM?
  - [ ] CI/CD


#### Additional
- [ ] Additional
    - [ ] Performance optimizations
    - [ ] Security







### Telegram integration
Create a Telegram bot using the `python-telegram-bot` library. The bot will receive chat exports, user queries, and send summaries and reminders.

### AI part!

#### Local LLM integration
Integrate a local LLM (e.g., llama.cpp) into the FastAPI backend to generate message summaries and reply suggestions.

### Deployment
- AWS deployment: Deploy the FastAPI backend to AWS Elastic Beanstalk or ECS and use Amazon RDS for PostgreSQL.
- CI/CD pipeline: Set up a CI/CD pipeline for automated deployment.

### E2E Testing
Deploy the FastAPI backend to AWS Elastic Beanstalk or ECS and use Amazon RDS for PostgreSQL.

## Proposed Solution

### Data Acquisition

TLDR;
A dockerized script to be executed on a cron basis using GitHub Actions scheduled jobs. The script will:

1. Check for another running instance by querying the backend `/lock` endpoint.
2. Connect to the WhatsApp client (determine storage location for auth data).
3. Retrieve all chats, optionally filtering out archived ones.
4. For each chat, check for new messages and retrieve them if available.
5. Format the retrieved messages according to the provided interface by the FastAPI backend.
6. Send the formatted data to the backend via `POST` request.

Next steps:
- Define the authentication storage method (image or database).
- Implement the script using web-whatsapp.js.
- Set up the GitHub Actions workflow.


**Deployment Plan (Example - Adapt for your chosen AWS services):**

*   **Local:** Docker Compose for local development.
*   **Prod:** Deploy to AWS Elastic Beanstalk/ECS (prod environment).

## Open Questions

-   What's the best strategy for periodically exporting WhatsApp chat logs?  Automated export options?
-   Which local LLM provides the best balance of performance and resource usage for this task?
-   Detailed performance metrics of the chosen LLM on the target hardware.

## Risks

-   WhatsApp chat export format might change, breaking the parsing scripts.
-   Local LLM setup and configuration could be challenging.
-   Performance of the local LLM might not meet expectations.

## Definition of Done

**Functional Requirements:**

-   Parses exported WhatsApp chat logs.
-   Stores messages and metadata in PostgreSQL.
-   Telegram bot receives chat exports and user queries.
-   FastAPI backend exposes necessary API endpoints.
-   Local LLM generates message summaries and reply suggestions.
-   Reminders are sent via Telegram.

**Testing and Automation:**

-   Unit tests cover core logic.
-   E2E tests verify end-to-end functionality.
-   API tests ensure API endpoints work correctly.
-   CI/CD pipeline automates build and deployment.

**Monitoring and Logging:**

-   Logging implemented for all components.
-   Metrics collected for performance monitoring.

**Deployment:**

-   Deployment scripts for local, dev, and prod environments.
-   Application deployed to AWS.

**Cost:**

-   AWS costs estimated and optimized.

**Security:**

-   Data privacy ensured (local processing).
-   Secure access to AWS resources.

**Documentation:**

-   README with setup instructions.
-   API documentation.

**Communication:**

-   Regular updates on project progress.

**Feedback:**

-   Gather feedback on usability and functionality.
