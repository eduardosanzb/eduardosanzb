# Deep Dive into LLMs

## Resources
- [Deep Dive into LLMs like ChatGPT](https://www.youtube.com/watch?v=7xTGNNLPyMI&list=WL)

## Introduction

### Pretaining. In: Internet documents Out: Base Model

TLDR; the data is collected from the internet, then using a complex pipeline the data gets pruned and formatted.

e.g. [FineWeb](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbnRWa3hWRDZxXzlpYURVekxZdlZibnloQ1RFUXxBQ3Jtc0trMWJzaXl5cmRqYlAwVXhVOHBIS2dRLWUzUkFQQUphY0VQNF9hVHd1RGl5RjI4NmZjdkc5NV8xc21wM0c5V1dZdnBGX3h0Zzk0M1FySEJVdFBUSnJQZUN1NW1zWGY5TDJoRm9IUDcwYm9VSTJfYm41NA&q=https%3A%2F%2Fhuggingface.co%2Fspaces%2FHuggingFaceFW%2Fblogpost-fineweb-v1&v=7xTGNNLPyMI)
1. Url Filtering (no porn, no illegal content)
2. Text Extraction (not html, not js, just text)
3. Language Filtering (only english or other languages)
4. Gopher Filtering (quality of the text using different metrics. e.g. word count, sentence count, etc.)
5. MinHash dedup
6. C4 Filters
7. Custom Filters
8. PII Removal

### tokenization

TLDR; finding patterns in the text and converting them into tokens.
The goal is to maximize the representation of the text with the least tokens possible

1. Text to UTF-8 encode to get raw bites (8 bites per character) (a -> 01100001)
2. Change the bites to integers (0-255) (a -> 97)
3. Byte pair encoding; Find consecutive characters that appear together and replace them with a single token.
(e.g. "116 32" -> "32")
_GPT 4 uses ~100k symbols_

"hello world -> 2 tokens (hello, world) (15339, 1917)"
"Hello world -> 2 tokens (hello, world) (9907, 1917)"
"helloworld -> 2 tokens (h, elloworld) (71, 96392)"


Explore examples in [Tiktokenizer](https://tiktokenizer.vercel.app/)

### neuronal network I/O

TLDR; We take windows of token in the dataset _we control the window size e.g. 512 tokens_
and we predict the next token.
**This is the input to the neuronal network. The output is the probability of the next token.**

### training

Because we already know the next token in the training data, we can calibrate the neuronal network
to predict the next token with a high probability.

```mermaid
---
config:
  layout: fixed
---
flowchart TB
    n8[" "] --> n7(["NN"])
    n1["91"]
    n2["Rounded"]
    n3["860"]
    n4["287"]
    n5["11579"]
    n9["prob of 1983434: 2%"]
    n10["prob of 123123: 1%"]
    n11["prob of 9907: 3%"]
    n12["Correct answer is 9907"]
    n8@{ shape: anchor}
    n1@{ shape: rounded}
    n2@{ shape: rounded}
    n3@{ shape: rounded}jjjjjj
    n4@{ shape: rounded}
    n5@{ shape: rounded}
    n9@{ shape: rect}0
    n10@{ shape: rect}
    n11@{ shape: rect}
    n12@{ shape: rounded}

```


### Neuronal network internals
_The params is normally what is attached to the models e.g. Llama 3.1 405B as of 405 billion of params_
We have the inputs of tokens that can go to 0 to a defined amount of tokens.
This is the context, then we have put this inputs with parameters (_weights_) which are like
knobs that we can tune to get the best output.

All of this is passed to a giant mathematical expression that will always give the outputs.


### Inference
generating new data from the model, to analize what kind of patterns the model has internalized.

The use case of this is to generate text _or predict the next token_ inspired by the data that the
model has seen.

## Example of training a model

Here we understand the cycle of training a model; which basically is to feed the model with windows of
tokens and calibrate the weights of the model to predict the next token.

**This is the most expensive part of the training process; here's where we use massive machines**

The output will be the "Base model". Which is an internet document simulator.

_We could train a very small model like GPT-2 for around 400usd in 2025_


### The psychology of a base model
- It is a token-level internet document simulator
- It is stochastic / probabilistic - you're going to get something else each time you run *
- It "dreams" internet documents
- It can also recite some training documents verbatim from memory ("regurgitation")
- The parameters of the model are kind of like a lossy zip file of the internet
-> a lot of useful world knowledge is stored in the parameters of the network
- You can already use it for applications (e..g translation) by being clever with your prompts
  - e.g. English-Korean translator app by constructing a "few-shot" prompt and leveraging "in-context-learning" ability
  - e.g. an Assistant that answer questions using a prompt that looks like a conversation

## Post-training: Supervised Finetuning. In: Base Model Out: SFT model
_This is the step where we fine-tune the base model to become an assistant, this is a less expensive step_

we should start thinking in "Conversations" instead of "Documents". We want to model how the model interacts with the user.
We'll do this by training the model with a dataset of conversations; this will make the model more human-like.

### Tokenazation of conversations
We have to think in a data structure/protocol like the TCP IP protocol, but for conversations.

*Normal conversation*:
- User: What is 2+2?
- Assistant: 2+2=4
- User: What if it was *?
- Assistant: 2^2=4, same as 2+2!

Then this conversation will be tokenized into a format that the model can understand. Like:

```
<|im_start|>user<|im_sep|>what is 2+2?<|im_end|><|im_start|>assistant<|im_sep|>2+2=4<|im_end|><|im_start|>user<|im_sep|>what if it is *?<|im_end|>
<|im_start|>assistant<|im_sep|>2^2=4, same as 2+2!<|im_end|><|im_start|>assistant<|im_sep|>
```

The important part is that the base model has never been this new token "im_start" or "im_end", so we have to train the model with this new tokens and
the conversation dataset.

This is done the same as before; chunking the window of the tokens and calibrating the weights of the model to predict the next token.


We learn that at the beginning someone like openAI hired a bunch of "human labelers" to create this kind of conversations.
There are other open source datasets like the one in [ huggingface](https://huggingface.co/datasets/stingning/ultrachat), but nowadays we use more advance techniques for creating this chats.
One example is the usage of [UltraChat](https://github.com/thunlp/UltraChat)


### Post-training: Reinforcement Learning. In: SFT model Output:
This is the final step of training a model; in this phase is about giving the model the power of "reasoning".
Which without the magic, is making the model to question itself.


## Summary of Training a model
```mermaid
graph:

[Internet Documents] --> {_pretraining_} --> [Base Model] --> {_supervised finetunning_} --> [SFT model: An assistant, trained] --> {_reinforcement_} --> [RL model]
```

**Analogy**. A science study book from school.
Pre-training --> Exposition to background knowledge; in a book is just the chapter content
Post-training<Supervised finetuning> --> Is the problem+demonstrated solution, for imitation
Post-training<Reinforcement learning> --> Is the promts to practice, trial & error until reach correct answer

## Notes

 ** Limitations of Reinforcement learning**; at some point RL will plateu and the results will become shit.
 This usually happens when doing RL from un-verfifieable domains (e.g. rating a joke).

 The setup for this RL is normally to use a separated "rating model" which emulates human behaviour. After multiple passes of the RL the RL model
 will learn how to trick the RM.

_e.g. A joke about pelicans? --> "the the the the the the the" will come as a super joke.

## What is next for 2025

- multimodal (not just text but audio, images, video, etc)
- tasks -> agents
- pervasive, invisible
- computer-using
- test-time training?


## Resources to keep up to date

- https://lmarena.ai
- https://buttondown.com/ainews
- https://together.ai


