# HPE — Enterprise RAG / Knowledge Search Platform

## 3 KPIs / Key Results

- **Guide traffic:** -80%
- **Clicked-result dwell:** +20%
- **Support impact:** 98% beta satisfaction and ~30% Q3 support-ticket reduction

## What it does

A RAG-based enterprise knowledge assistant for HPE Brand Central and sales / partner documentation. It ingests complex documentation from a JavaScript-heavy site, captures hidden and linked content, converts source material into inspectable artifacts, embeds the content, retrieves relevant chunks, and generates grounded answers from enterprise documentation.

The product moved users from “search, click, scan, and escalate” toward direct answers grounded in the source corpus.

## My role

I identified the user discovery failure, framed the business case around support-ticket reduction, scoped the retrieval and LLM architecture, led the POC, and helped convert engineering skepticism into buy-in by proving the approach with a working demo.

The PM work was as much about the data pipeline and adoption path as it was about the model. The system only worked if the corpus was complete enough, retrieval was reliable enough, and stakeholders trusted the answers.

## Outcome

The project reduced guide-seeking behavior, improved engagement with clicked results, and showed that RAG could be productized with governance, latency, authentication, and enterprise data constraints in mind. It also gave the team a practical pattern for using retrieval and LLMs without treating the model as the source of truth.

## Write-up

### Summary

At WebMocha, I worked on a RAG-based enterprise knowledge search experience for HPE sales / partner documentation. The problem was straightforward: users were spending too much time searching through documentation and still failing to find answers.

We identified that a large share of traffic was going to guide pages rather than actual source information, and there were meaningful zero-result searches. The RAG search experience reduced guide traffic by 80% and increased clicked-result dwell by 20%. A two-week beta test produced 98% satisfaction and gave the team confidence to roll the system out more broadly.

### Problem

The original experience forced users to search, click, scan, navigate, and often escalate anyway.

Enterprise employees and partners were spending around 10 minutes per session searching through brand documentation, with a high failure rate in finding answers. That created support tickets, follow-up email threads, and wasted time for both users and support teams.

The goal was to reduce the amount of work required to get a trusted answer from a large and messy documentation corpus.

### Approach

I approached this as a retrieval problem first and an LLM problem second when building the initial POC (pre-Claude Code I might add).

The hard part was not getting an LLM to respond. The hard part was getting the right content into the system in a reliable, auditable way. The existing solution was a dynamic, JavaScript-heavy web app, so the ingestion pipeline had to render pages, wait for content to load, expand hidden UI sections like accordions, follow linked PDFs and PPTs - I opted for Puppeteer over Selenium here - and preserve the extracted source material in a format we could inspect later.

The core RAG flow:

1. Pull source content from the documentation system
2. Convert content into clean, inspectable documents
3. Chunk the documents into retrieval-friendly passages
4. Generate embeddings
5. Store embeddings and metadata in a vector index
6. Retrieve the top relevant chunks for a user query
7. Send the query plus retrieved context to the LLM
8. Return a synthesized answer with source references

The architecture used an orchestration layer, vector search, document storage, and LLM access through the enterprise API environment. The system used tools such as LangChain for orchestration, a vector store for semantic retrieval, and enterprise LLM / embedding endpoints for answer generation and indexing.

### My role

I identified the search problem through usage data, framed the business case, built the POC, lead the governance approval process, gained alignment and led execution into prod.

Engineering had legitimate concerns about complexity. RAG adds moving pieces: ingestion, chunking, embeddings, retrieval quality, prompt design, latency, permissions, and monitoring. I worked through that by presenting the search data, organizing knowledge-sharing sessions on keyword versus semantic search, and building a working POC that made the approach concrete.

I also helped define the launch constraints: answer quality, latency, authentication, output auditability, and cost observability. The point was to make the system useful without creating a black box.

### Evaluation

If the system failed to retrieve the right source document, the generated answer could sound good and still be wrong. So the evaluation had to look at retrieval and answer quality together.

The main evaluation dimensions were answer quality, false negatives, latency, stakeholder acceptance, and downstream ticket reduction. We worked backward from the support-ticket reduction goal and estimated what adoption, F1, and answer acceptance would be needed to make a meaningful dent in the backlog.

That evaluation framing mattered because accuracy can hide false negatives. For a support workflow, missing the correct answer is often more damaging than producing a bland one.

### Tradeoffs

The biggest tradeoff was breadth versus depth in the first version of the corpus. We prioritized the top documents that drove most support queries instead of trying to ingest everything perfectly on day one. That let us validate whether RAG was useful before investing in a more complex extraction and governance pipeline.

Another tradeoff was speed versus observability. Converting extracted pages into PDFs created extra work, but it gave us a way to inspect what the system had actually captured. That was useful when stakeholders asked whether the bot had access to the right source material.

### Outcome

The project reduced guide traffic by 80% and increased dwell time on clicked results by 20%. The POC also achieved strong stakeholder acceptance in beta, and the broader effort reduced support tickets by about 30% in Q3.

One of the interesting parts of the project is that it shows the unglamorous parts of RAG: corpus quality, multi-modal ingestion, retrieval, latency, evals, and governance. Those are usually what determine whether a RAG product works.

### What I learned

The biggest lesson was that RAG quality starts before retrieval.

If the source docs are incomplete, stale, badly chunked, or missing hidden content from the UI, the model cannot fix that at generation time. The data pipeline was the product. Shout out to LlamaParse for ingestion tooling.

I also learned that technical buy-in often comes from showing the system working, not from debating architecture in the abstract. The POC mattered because it made the tradeoffs visible. But there is a need for automated approvals, and phase gating for AI/ML systems. So Im working on a regulated-agent-launch-kit (see https://github.com/WillLewis)
