# Workflow Specifications

# System workflows

## Workflow: Sourcing Data Messages (CJ<>CB)
* **Purpose**: Fetches WhatsApp messages from an external source and sends them to the Core Backend for processing.
* **Trigger**: Cron Job (CJ) initiation
* **Endpoints**:
    + `POST /messages` (Set preferences)
* **Steps**:
    1. `CJ Fetches WhatsApp Messages`
    2. `Format Messages` (list of chats with Messages, Contacts and metadata)
    3. `POST /messages` to Core Backend (CB)
    4. `CB Process messages` using the Process Raw Chats workflow
    5. `CB Responds` with Success/Failure
    6. `CJ Marks Action` as Success/Failure; Notify on Failure

## Workflow: System Health and Status Updates (CB)
* **Purpose**: Check systems are healthy
* **Trigger**: Scheduled checks
* **Endpoints**:
    + `GET /system/status` (Retrieve system status)
* **Steps**:
    1. `CB Checks System Health`
    2. `CB Updates & Provides Status`

## Workflow: Process Raw Chats (Orchestrator)
* **Purpose**: Orchestrates the complete processing of raw chat data, coordinating extraction, message processing, formatting, and database upsert.
* **Trigger**: Function call from "Sourcing Data Messages" workflow after fetching raw chat data.
* **Signature**:
    + `process_raw_chats(raw_chat_data: list[RawChatDataType]) -> ProcessingResultSummary`
* **Steps**:
    1. **Initialize Processing Context**: `context = ProcessingContext()`.
    2. **Initialize Processing**: (e.g., setup batch processing configurations if applicable).
    3. **For each `raw_chat` in `raw_chat_data`**:
        a. **Call "Extract Chat Data" Workflow**: `chat_extraction_result = extract_chat_data(raw_chat, context)`.
        b. **Call "Process Messages within Chat" Workflow**: `formatted_messages = process_messages_in_chat(raw_chat, context)`.
        c. **Format Contact Data**: `formatted_contacts = format_contact_data(chat_extraction_result.participant_identifiers, context)`. _Uses output from "Extract Chat Data"_.
        d. **Format Chat Metadata**: `formatted_chat_metadata = format_chat_metadata(chat_extraction_result.chat_metadata, context)`. _Uses output from "Extract Chat Data"_.
        e. **Call "Upsert Data to Database" Workflow**: `upsert_result = upsert_data(formatted_contacts, formatted_chat_metadata, formatted_messages, context)`.
        f. **Chat Processing Success/Error**: Based on `upsert_result` and errors recorded in context during steps a-e, call `context.increment_chats_success()` or `context.increment_chats_error()`.
    4. **Finalize and Return Result**: `summary = context.get_summary()`. Return `summary`.

## Workflow: Extract Chat Data
* **Purpose**: Extracts fundamental details from a raw chat data structure, including the chat type, participating contacts, and overall chat metadata.
* **Trigger**: Function call, invoked for each `raw_chat` by the "Process Raw Chats (Orchestrator)" workflow.
* **Signature**:
    + `extract_chat_data(raw_chat: RawChatDataType, context: ProcessingContext) -> ChatExtractionResult`
        (where `ChatExtractionResult` is a data structure containing: `chat_type`, `participant_identifiers`, `chat_metadata`)
* **Steps**:
    1. **Increment Total Chats in Context**: `context.increment_total_chats()`.
    2. **Detect Chat Type**: Call `detect_chat_type(raw_chat, context)`.
    3. **Extract Participants (Contacts)**: Call `extract_participants(raw_chat, context)`.
    4. **Extract Chat Metadata**: Call `extract_chat_metadata(raw_chat, context)`.
    5. **Return ChatExtractionResult**: Package extracted data into a `ChatExtractionResult` object.
    6. **Error Handling**: Implement context-based error handling within each step, using `context.record_error(...)` and incrementing error counters in case of failures.

## Workflow: Process Messages within Chat
* **Purpose**: Processes individual messages within a raw chat, handling sender identification, message type determination, content and embedding extraction, and data formatting.
* **Trigger**: Function call, invoked for each `raw_chat` by the "Process Raw Chats (Orchestrator)" workflow.
* **Signature**:
    + `process_messages_in_chat(raw_chat: RawChatDataType, context: ProcessingContext) -> list[FormattedMessageType]`
        (where `FormattedMessageType` is the data structure representing a formatted message, or an empty list if no messages or errors)
* **Steps**:
    1. **Count Messages**: Count messages in `raw_chat` and call `context.increment_total_messages(message_count)`.
    2. **Initialize Formatted Messages List**: Create an empty list to store formatted messages.
    3. **For each message in `raw_chat`**:
        a. **Identify Sender**: Call `identify_sender(message, context)`.
        b. **Determine Message Type**: Call `determine_message_type(message, context)`.
        c. **Extract Content**: Call `extract_content(message, context)`.
        d. **Generate Message Embedding**: Call `generate_embedding(message, context)`.
        e. **Format Message Data**: Call `format_message_data(message, embedding, context)`. _Note: Embedding passed as argument._
        f. **Append to Formatted Messages List**: Add the formatted message to the list.
        g. **Error Handling (per message)**: Wrap steps a-f in try-except. If error, call `context.record_error(...)` and `context.increment_messages_error()`. If success, `context.increment_messages_success()`.
    4. **Return Formatted Messages List**: Return the list of formatted messages.

## Workflow: Upsert Data to Database
* **Purpose**: Manages the database operations to update or insert formatted contact, chat, and message data, ensuring data integrity and relationships.
* **Trigger**: Function call, invoked by the "Process Raw Chats (Orchestrator)" workflow after data processing and formatting.
* **Signature**:
    + `upsert_data(formatted_contacts: list[FormattedContactType], formatted_chat: FormattedChatMetadataType, formatted_messages: list[FormattedMessageType], context: ProcessingContext) -> UpsertResult`
        (where `UpsertResult` can indicate success/failure and potentially counts of upserted items)
* **Steps**:
    1. **Upsert Contacts**: Call `upsert_contacts(formatted_contacts, context)`.
    2. **Upsert Chats**: Call `upsert_chats(formatted_chat, context)`.
    3. **Upsert Messages**: Call `upsert_messages(formatted_messages, context)`.
    4. **Handle Database Errors**: Wrap upsert steps in try-except. If error in any upsert, call `context.record_error(...)` and potentially `context.increment_chats_error()` if chat upsert fails fundamentally.
    5. **Return UpsertResult**: Return a result object indicating success/failure and potentially counts of upserted items.

## Data Mapper: format_contact_data
* **Purpose**: Transforms participant identifiers into formatted contact data structures, aligning with the `Contacts` data model for database readiness.
* **Signature**:
    + `format_contact_data(participant_identifiers, context: ProcessingContext) -> list[FormattedContactType]`
* **Steps**:
    1. **Transform Data**: Take `participant_identifiers` and structure it according to the `Contacts` data model for each participant.
    2. **Error Handling**: Implement error handling as needed within formatting logic and use `context.record_error(step="format_contact_data", error_details=...)` if formatting fails for any participant.
    3. **Return Formatted Data**: Return the list of formatted contact data structures.

## Data Mapper: format_chat_metadata
* **Purpose**: Transforms extracted chat metadata into a structured format that conforms to the `Chats` data model, preparing it for database upsert.
* **Signature**:
    + `format_chat_metadata(chat_metadata, context: ProcessingContext) -> FormattedChatMetadataType`
* **Steps**:
    1. **Transform Data**: Take `chat_metadata` and structure it according to the `Chats` data model.
    2. **Error Handling**: Implement error handling as needed within formatting logic and use `context.record_error(step="format_chat_metadata", error_details=...)` if formatting fails.
    3. **Return Formatted Data**: Return the formatted chat metadata structure.

# User workflows

## Workflow B: Summarization Flow (CJ<>CB<>User)
* **Purpose**: Provide a summarize of the User messages in a time-frame
* **Trigger**: CJ initiation for summarization
* **Endpoints**:
    + `POST /summarization/start` (Set preferences)
    + `GET` `/summarization/status` - Check summarization status.
    + `GET` `/summarization/result` - Retrieve summarization results.
* **Steps**:
    1. `CJ Sends HTTP Request` to CB for summarization and start pooling the status
    2. `CB Calls Summarization Engine`
    3. `CB Posts Summary` to Telegram Chatbot
    4. `CB` Updates the summary
    5. `CJ Marks Action` as Success/Failure; Notify on Failure

## Workflow: User request LLM reply to specific message (AI powered replies)
* **Purpose**: Allow users to request AI-generated replies for specific messages. If the user approves the reply, it is sent to WhatsApp. If the user provides additional information (addendums), the system restarts the reply generation process.
* **Trigger**: User react to specific chat with 🤖 emoji
* **Endpoints**:
    + `POST /replies/generate` - Request AI-generated reply.
    + `POST /replies/approve` - Approve the generated reply for sending.
    + `POST /replies/update-reply` - Update the reply with user addendums.
* **Steps**:
    1. `Bot` send POST request to `CB` with the specific Chat and ask for a generated reply
    2. `CB` replies with the generated message and `Bot` starts a new thread
    3. If `User` react with a ✅ `Bot` will request to `CB` to reply to whatsapp
    4. If `User` reply with addendums then the cycle restart

## Workflow: User wants to proxy a custom reply
* **Purpose**: Allow user to send a custom reply to the specific chat
* **Trigger**: User reply to specific conversation
* **Endpoints**:
    + `POST /replies/custom`
* **Steps**:
    1. `Bot` send POST request to `CB` with the custom reply
    2. `CB` proxy message to specific conversation in WhatsApp
    3. `CB` when success reply to `Bot` that the message was sent
    4. `Bot` react to the reply with a ✅

# Unexplored Workflows
## Workflow: User Configuration Management (User<>CB)
* **Purpose**: Allow user to configure the profile
* **Trigger**: User action (to be defined, but managed via DB directly)
* **Endpoints**: N/A - Management via DB directly
* **Steps**: _Management will be done via the DB directly_

## Workflow: User wants to create a calendar entry based on conversation and invite Contact
* **Purpose**: Allow user to generate a calendar entry and invite Contacts in Chat
* **Trigger**: User react to message with 📅 emoji
* **Endpoints**:
    + `POST /...`
* **Steps**:
    1. `Bot` send POST request to `CB` with the message
    2. `CB` will create a calendar entry based on the context of the message.
    3. `CB` will attempt to invite the `Contact` using the metadata. If email is not found then it will ask for an email to the `Contact`.
    And if possible we'll send an auto-invite link to the `Contact`.
    4. `Bot` will send a message once the invite has been created and the contact invited.

## Workflow: User wants to have TLDR from audio messages
* **Purpose**: Enable user to receive a TLDR of an audio message; in the case that exists.
* **Trigger**:
    + User send audio message form chatbot.
    + User sends audio from whatsapp and the system detects it.
* **Endpoints**:
    + TBD

