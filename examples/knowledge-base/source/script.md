# Sim Knowledge Base Explainer — Plain-Language Script

## Scene list (locked first — visuals follow this)

1. workspace
2. one KB → many KBs
3. zoom into one KB
4. documents
5. chunks
6. document update / reindex
7. query
8. relevant chunks
9. chunks into context
10. grounded output

---

## 1. Intro

If you've already built a couple workflows in Sim, you probably know the basics by now.

You know how to use blocks. You know how to chain agent steps together. You know how to pass inputs and outputs through a workflow.

But at some point, you hit a different kind of problem.

What if your workflow needs to actually **know things**?

Not just generate text from a prompt, but work with real information — things from your docs, your notes, your PDFs, your spreadsheets, your company knowledge, whatever your workflow actually depends on.

That's what this video is about.

I'm going to explain what the Knowledge Base is, how it works, and how it gives your workflow a way to look up the right information when it needs it.

---

## 2. The problem

The basic problem is simple.

AI can only work with the information you give it.

And in real life, the information you care about is usually spread across a bunch of places:

- Notion
- PDFs
- Gmail
- spreadsheets
- slide decks
- docs
- notes

You can't just dump your whole company, your whole project, or your whole research folder into one prompt every time you run a workflow.

So the problem is not really:
"How do I write a better prompt?"

The problem is:
"How do I let my AI get access to the right parts of a much larger body of knowledge, at the moment it needs them?"

That shows up in all kinds of practical ways.

Maybe you want an AI to answer questions without making things up.

Maybe you want it to reference actual project data.

Maybe you want it to find something specific.

Maybe you want it to make a recommendation based on existing material.

That's the problem the Knowledge Base is solving.

---

## 3. High-level solution

At a high level, Sim's Knowledge Base gives your AI a place to look things up.

That's the simplest way to think about it.

It gives you:

- a place to store knowledge
- a way to process it
- a way to search it
- and a way to bring the most relevant pieces into your workflow when they're needed

So instead of treating your AI like it has to remember everything all at once, you give it a library it can search.

Not a giant library card catalog you manage by hand — Sim handles that part for you.

The important idea is:
your workflow doesn't need the **entire** library every time.

It just needs the **right pages**.

---

## 4. What a Knowledge Base actually contains

Now let's talk about the core mental model.

A Knowledge Base stores things called **Documents**.

And "Documents" here doesn't just mean traditional text documents.

You should think of them more broadly as the original things you upload or sync in:

- PDFs
- notes
- slide decks
- spreadsheets
- markdown files
- exported text
- other files

So the first important idea is:

A Knowledge Base is made up of **documents**.

Then each document gets broken into smaller pieces.

Those smaller pieces are called **chunks**.

And those chunks are what the system actually searches over.

So a simple way to picture it is:

- first you have the original file
- then Sim breaks it into smaller, searchable pieces
- then later, when your workflow needs information, it searches through those smaller pieces

That means:

- the original document is where the knowledge starts
- the chunk is the piece the system actually pulls back later

If you only remember one structure from this video, remember this:

**Knowledge Base → Documents → Chunks**

---

## 5. What happens when you add knowledge

When you upload a file into the Knowledge Base, Sim processes it for you in the background.

You don't have to manually build the whole retrieval pipeline yourself.

At a high level, here's what happens:

- Sim extracts the text
- breaks it into smaller pieces
- makes those pieces searchable by meaning
- and stores them so your workflows can find them later

You don't really need to understand the math behind embeddings or the lower-level details to start using it well.

What matters is understanding the outcome:

Your original files get turned into smaller searchable pieces that the AI can look through later.

---

## 6. How search actually works

Now we get to the really important part.

Once your Knowledge Base is set up, how does it become useful?

Let's say your workflow has a task.

Maybe the user asks a question.

Maybe an agent needs to make a recommendation.

Maybe a workflow step needs to check something against existing information.

That task becomes a query.

The system then searches through the chunks in the Knowledge Base and brings back the ones that seem most relevant.

This is important:

It usually does **not** pull back the entire original file.

It pulls back the parts that seem most useful for the current task.

So if you want a mental model, think of it like this:

The original file might be the full book.

The chunks are like the pages or passages the AI flips to when it needs help.

And then those retrieved chunks get passed into the AI step as background.

That's how they become useful.

They become the information the model sees **before it answers**.

So the point of the Knowledge Base is not just "search for text."

The point is:
**bring the right information in front of the model before it reasons.**

That's the heart of the whole thing.

---

## 7. A quick note on relevance

One subtle thing worth understanding:

This kind of search is based on **relevance**, not perfection.

The system is trying to find the pieces that seem most related to the query.

That means:

- the wording of the query matters
- the way the information is stored matters
- the way the content is broken up can matter too

It's not the same as checking every single file line by line in a brute-force way.

It's more like asking:

"What are the most likely useful pieces for this task?"

That's usually exactly what you want.

But it also means this is not the right tool for every possible problem.

We'll come back to that later.

---

## 8. Workflow connectors

One other useful thing to know:

A Knowledge Base doesn't only have to come from files you upload manually.

Sim also has connectors and workflows that let outside systems feed into the knowledge layer.

That means your knowledge can stay connected to where it already lives.

So instead of thinking of the Knowledge Base as just a static pile of uploads, you can think of it as something that can stay in sync with the rest of your systems.

I'm not going deep into connectors here, but it's worth knowing that this can be much more than "upload a PDF once."

---

## 9. Demo

**[PLACEHOLDER — insert demo section here]**

This is where I'll show:

- setting up or selecting a Knowledge Base
- adding documents
- searching it from a workflow
- seeing which chunks come back
- and using those results in an AI step

---

## 10. What it's good for

The most obvious use case is question answering.

That's the classic "chat with docs" use case.

And that's fine.

But the more interesting use case is broader than that.

A Knowledge Base becomes useful any time your workflow needs to make a more informed move.

That could mean:

- answering a question
- making a recommendation
- checking against prior information
- routing something to the right next step
- planning using existing material
- grounding an AI process in real knowledge

So yes, Q&A is the easy example.

But the bigger idea is:
**your workflow can consult a body of knowledge before it acts.**

That's what makes this more powerful than just "a smarter chatbot."

---

## 11. What it's not good for

It's also helpful to be clear about what the Knowledge Base is **not**.

It is not:

- the entire corpus stuffed into the model every time
- a magical perfect answer engine
- an exhaustive search over every single piece of information by default

If your task needs:

- full traversal of every item
- a guaranteed check over the whole dataset
- or more structured iteration across all entries

then you may need other workflow patterns on top.

The Knowledge Base is strongest when you want:

- the **most relevant** information
- at the right moment
- for the current task

That's its sweet spot.

---

## 12. Knowledge Base vs Memory

One last distinction that can help:

Knowledge Base and Memory are not the same thing.

A Knowledge Base is for **stored material that already exists**:

- docs
- files
- notes
- reference information

Memory is more about **what happened over time**:

- past interactions
- conversation continuity
- facts learned about a user or session

A simple way to remember it is:

- **Knowledge Base stores what exists**
- **Memory stores what happened**

That's not perfect, but it's a very good starting distinction.

---

## 13. Closing

So to recap:

The problem is that your AI needs access to real knowledge, but that knowledge is too large and too scattered to fit directly into one prompt.

Sim's Knowledge Base solves that by giving your workflow a place to store, process, search, and retrieve information when it's needed.

Inside the Knowledge Base, your information starts as **documents**.

Those documents get broken into **chunks**.

When a workflow needs information, it searches over those chunks, retrieves the most relevant ones, and passes them into the model as context.

That's the mechanism.

And once you understand that, the Knowledge Base stops feeling like "a feature for uploading files" and starts feeling like what it really is:

**a way for your AI to look up the right information before it answers, decides, or acts.**
