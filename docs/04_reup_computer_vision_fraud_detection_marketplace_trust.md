# REUP — Computer Vision Fraud Detection for Marketplace Trust

## 3 KPIs / Key Results

- **Fraud / review-routing recall:** 83%
- **Image-processing backlog:** ~4 hours → under 1 hour
- **Manual workflows:** -40% through inventory and review automation

## What it does

A computer-vision and fraud-detection workflow for a C2B luxury marketplace. Suppliers submitted watch images, the system processed image and metadata signals, and suspicious or high-confidence cases were routed into the right human review path.

The system evolved from simpler feature extraction approaches into a CNN-based anomaly-detection workflow when the earlier approach plateaued.

## My role

I led the technical product build for the marketplace infrastructure and managed a cross-functional team of eight. My role covered supplier image ingestion, inventory automation, review routing, and the fraud-detection model strategy.

The key product decision was “how do we route the right cases faster while preserving trust in an adversarial marketplace?”

## Outcome

The system reached 83% recall, reduced image processing from about 4 hours to under 1 hour, and helped cut manual workflows by 40%. The broader marketplace grew to 1,200+ suppliers and $15M GMV, with early GMV growing around 40% quarter-over-quarter.

## Write-up

### Summary

At REUP, I led technical product development for a C2B luxury marketplace where fraud and operational throughput were both major constraints. We had an adversarial market dynamic, a high fraud rate, and a manual image-processing backlog that slowed the business.

The system eventually reached 83% recall on the review-routing / fraud-detection task, reduced image processing from about 4 hours to under 1 hour, and cut manual workflows by 40% through automation.

### Problem

REUP operated in a category where trust was the product.

Suppliers submitted images of watches that ranged from $5K to $50K in price, and the business needed to quickly determine which items were worth escalating to expert review. The challenge had two sides. First, fraud was a major marketplace risk. Second, the internal image-processing backlog was around 4 hours, which slowed response times and limited throughput.

Manual review alone was not going to scale. But full automation would have been risky because the market was adversarial and we had to eat the cost of a bad call. Side note: the quality of the fakes continues to increase.

So the product goal was not “replace the expert.” It was “route the right cases faster.”

### Approach

We built a human-in-the-loop computer vision pipeline.

The ingestion flow started with the way suppliers already worked: sending images through WhatsApp. Images came in through Twilio, hit a FastAPI backend, were stored with metadata in PostgreSQL, and were passed into an asynchronous processing pipeline using GCP Pub/Sub. From there, OpenCV handled preprocessing, and a PyTorch CNN performed inference before routing cases for manual review when needed.

The modeling path was intentionally pragmatic.

We first tried a simpler approach using traditional feature extraction and a Random Forest classifier. The idea was to avoid unnecessary deep learning complexity if handcrafted visual features were enough. We tested approaches like SIFT and ORB for feature extraction, but the system plateaued around 60% recall.

That was the signal to move to a CNN-based approach. Fine-tuning a ResNet-style model gave the system a better chance to learn subtle visual patterns directly from the images instead of depending on manually designed features.

### My role

I led the technical product build for the marketplace infrastructure and managed a cross-functional team of eight.

My role covered the core product workflow, supplier image ingestion, inventory automation, review routing, and the fraud-detection model strategy. I also helped make the key tradeoff decisions: when to use rules, when to use classical ML, when to move to deep learning, and where human experts needed to stay in the loop.

This was startup product work, so the job was not only to make the model better. It was to make the operation faster and more reliable.

### Evaluation

We optimized for the operational problem.

The primary model metric was recall because missing risky or important cases was more costly than sending extra cases to human review. Precision still mattered because missed margin in any given opportunity still hurt, but recall was the safer optimization target for this workflow.

The broader evaluation included recall, processing time, manual workload, reviewer usefulness, and marketplace throughput. The model was only one part of the system. The pipeline, queueing, metadata, review status, and human escalation flow were just as important.

### Tradeoffs

The biggest tradeoff was automation versus partner experience. Too much automation could create false confidence or frustrate suppliers. Too little automation left the team stuck with a slow manual process.

Another tradeoff was model simplicity versus model performance. The Random Forest approach was worth trying because it was cheaper and easier to reason about. But once it plateaued, the right product decision was to move to a CNN because the visual patterns were too subtle for handcrafted features.

### Outcome

The system reached 83% recall, reduced image processing from about 4 hours to under 1 hour, and helped cut manual workflows by 40%. The broader marketplace grew to 1,200+ suppliers and $15M GMV, with early GMV growing around 40% quarter-over-quarter.

This is the project I would use to show computer vision product judgment. It demonstrates work with messy data, adversarial behavior, operational constraints, and human review — not just clean benchmark problems.

### What I learned

One of the key lessons here was to start simple, but not stay simple past the evidence.

The Random Forest approach was worth testing. It gave us a baseline and helped identify features the model needed to learn. But when the evidence showed that handcrafted features were not enough, the product decision was to move to a more robust model.

I also learned that in marketplace ML, the model is only useful if it changes the operating system around it. 
