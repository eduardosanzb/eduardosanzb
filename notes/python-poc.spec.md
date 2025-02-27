# Workflow Specifications

## Workflow A: Sourcing Data Messages (CJ<>CB)

* **Trigger**: Cron Job (CJ) initiation
* **Endpoints**:
    + `POST /messages` (Set preferences)
* **Steps**:
    1. `CJ Fetches WhatsApp Messages`
    2. `Format Messages` (list of chats with Messages, Contacs and metadata)
    3. `POST /messages` to Core Backend (CB)
    4. `CB Normalizes & Upserts` in database, generates embeddings
    5. `CB Responds` with Success/Failure
    6. `CJ Marks Action` as Success/Failure; Notify on Failure

## Workflow B: Summarization Flow (CJ<>CB<>User)

* **Trigger**: CJ initiation for summarization
* **Endpoints**:
    + `POST /summarization/start` (Set preferences)
* **Steps**:
    1. `CJ Sends HTTP Request` to CB for summarization
    2. `CB Calls Summarization Engine`
    3. `CB Posts Summary` to Telegram Chatbot
    4. `CB Responds` with OK/Error
    5. `CJ Marks Action` as Success/Failure; Notify on Failure

## Workflow C: User Configuration Management (User<>CB)

* **Trigger**: User interaction
* **Endpoints**:
    + `POST /config/preferences` (Set preferences)
    + `GET /config/preferences` (Retrieve current preferences)
* **Steps**:
    1. `User Submits Preferences`
    2. `CB Updates & Stores Preferences`
    3. `CB Responds` with Success

## Workflow D: Data Export/Backup (User<>CB)

* **Trigger**: User request
* **Endpoints**:
    + `POST /data/export` (Initiate export)
    + `GET /data/export/status` (Check export status)
* **Steps**:
    1. `User Requests Data Export`
    2. `CB Initiates Export Process`
    3. `CB Provides Export Status`

## Workflow E: System Health and Status Updates (CB)

* **Trigger**: Scheduled checks
* **Endpoints**:
    + `GET /system/status` (Retrieve system status)
* **Steps**:
    1. `CB Checks System Health`
    2. `CB Updates & Provides Status`

## Workflow F: Data Encryption and Access Control (CB)

* **Implementation**:
    + Data encryption at rest and in transit
    + Multi-factor authentication setup

## Workflow G: Bulk Operations and Optimization (CJ<>CB)

* **Endpoints**:
    + `/messages/bulk` (Efficient large-volume message handling)
* **Steps**:
    1. `CJ Sends Bulk Message Request`
    2. `CB Processes Bulk Messages Optimally`

## Workflow H: Advanced Interaction Patterns (User<>CB)

* **Endpoints**:
    + `POST /commands/custom` (Execute custom command)
* **Steps**:
    1. `User Executes Custom Command`
    2. `CB Processes & Responds to Command`
