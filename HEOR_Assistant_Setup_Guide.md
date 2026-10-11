# HEOR AI Assistant — Setup Guide

## Prerequisites
- Python 3.8+ installed
- OpenAI API key (`sk-proj-...`)
- The 13 HEOR/RWE `.docx` files in one folder

## Step 1 — Install OpenAI library

```bash
pip install openai
```

---

## Step 2 — Create the Assistant (run once)

Save as `setup_assistant.py` and run it.

Update two things before running:
- Your API key on line 4
- The path to your docs folder on line 7

```python
from openai import OpenAI
import os, glob

client = OpenAI(api_key="sk-proj-YOUR_KEY_HERE")

# Path to the folder containing your .docx files
doc_folder = r"C:\path\to\your\docs"

# Upload all docs
file_ids = []
for path in glob.glob(os.path.join(doc_folder, "*.docx")):
    f = client.files.create(file=open(path, "rb"), purpose="assistants")
    print(f"Uploaded: {os.path.basename(path)} -> {f.id}")
    file_ids.append(f.id)

# Create vector store
vector_store = client.vector_stores.create(name="HEOR Synopsis Docs")
client.vector_stores.file_batches.create(
    vector_store_id=vector_store.id,
    file_ids=file_ids
)

# Create the assistant
assistant = client.beta.assistants.create(
    name="HEOR AI",
    instructions="""Follow the format of the sample documents provided. When given a problem statement and proposed solution, generate a new HEOR/RWE synopsis document matching the structure of the samples — with objectives and study steps. Always follow the previous submission format.""",
    model="gpt-4o",
    tools=[{"type": "file_search"}],
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}}
)

print(f"\n=== SAVE THESE IDS ===")
print(f"Assistant ID:    {assistant.id}")
print(f"Vector Store ID: {vector_store.id}")
print(f"======================")
```

**Save both IDs that get printed. You will need them.**

---

## Step 3 — Call the Assistant from your app

Use this function anywhere in your code to send a message and get a response:

```python
from openai import OpenAI

client = OpenAI(api_key="sk-proj-YOUR_KEY_HERE")

ASSISTANT_ID = "asst_YOUR_ASSISTANT_ID"  # from Step 2

def ask_heor(user_message):
    thread = client.beta.threads.create()
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=user_message
    )
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread.id,
        assistant_id=ASSISTANT_ID
    )
    messages = client.beta.threads.messages.list(thread_id=thread.id)
    return messages.data[0].content[0].text.value


# Example usage
result = ask_heor("Create a synopsis for a retrospective claims study evaluating migraine treatment costs")
print(result)
```

---

## Step 4 — Add more docs later

Run this whenever you have new documents to add:

```python
from openai import OpenAI

client = OpenAI(api_key="sk-proj-YOUR_KEY_HERE")

VECTOR_STORE_ID = "vs_YOUR_VECTOR_STORE_ID"  # from Step 2

# Upload and add a new doc
f = client.files.create(
    file=open(r"C:\path\to\new_doc.docx", "rb"),
    purpose="assistants"
)
client.vector_stores.files.create(
    vector_store_id=VECTOR_STORE_ID,
    file_id=f.id
)
print(f"Added: {os.path.basename(r'C:\path\to\new_doc.docx')} -> {f.id}")
```

To add multiple docs at once:

```python
from openai import OpenAI
import os, glob

client = OpenAI(api_key="sk-proj-YOUR_KEY_HERE")

VECTOR_STORE_ID = "vs_YOUR_VECTOR_STORE_ID"  # from Step 2

new_docs_folder = r"C:\path\to\new\docs"
for path in glob.glob(os.path.join(new_docs_folder, "*.docx")):
    f = client.files.create(file=open(path, "rb"), purpose="assistants")
    client.vector_stores.files.create(
        vector_store_id=VECTOR_STORE_ID,
        file_id=f.id
    )
    print(f"Added: {os.path.basename(path)} -> {f.id}")
```

---

## Notes

- The assistant searches all uploaded docs automatically when answering
- No need to recreate anything when adding new docs
- Model used: GPT-4o (can be changed to gpt-4o-mini for lower cost)
- API usage is pay-as-you-go based on tokens used
- Monitor usage at platform.openai.com under Usage
