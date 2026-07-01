# AGENTS.md

## AI Form Generation

This project uses the Hugging Face Inference API to generate form structures from natural language prompts.

The AI should **not** generate HTML, JSX, React components, CSS, or markdown.

Instead, it must return a structured JSON object describing the form.

---

## Goal

Users can type prompts such as:

> Create a job application form.

> Generate a customer satisfaction survey.

> Create an event registration form.

The AI converts the prompt into a JSON representation that the frontend renders.

---

## Expected JSON Format

The AI response must follow this structure exactly.

```json
{
  "title": "Job Application Form",
  "description": "Please complete the application.",
  "questions": [
    {
      "label": "Full Name",
      "type": "text",
      "required": true
    },
    {
      "label": "Email",
      "type": "email",
      "required": true
    },
    {
      "label": "Years of Experience",
      "type": "number",
      "required": false
    }
  ]
}
```

---

## Allowed Question Types

Only use the following question types.

```text
text
email
number
textarea
select
radio
checkbox
date
rating
```

Do not invent new question types.

---

## Select Example

```json
{
  "label": "Department",
  "type": "select",
  "options": [
    "Engineering",
    "Marketing",
    "Sales"
  ],
  "required": true
}
```

---

## Radio Example

```json
{
  "label": "Employment Type",
  "type": "radio",
  "options": [
    "Full Time",
    "Part Time",
    "Intern"
  ],
  "required": true
}
```

---

## Checkbox Example

```json
{
  "label": "Skills",
  "type": "checkbox",
  "options": [
    "React",
    "Vue",
    "Angular"
  ],
  "required": false
}
```

---

## Rules

Always generate:

- a title
- a description
- at least 3 questions
- at most 15 questions

Every question must contain

- label
- type
- required

Only select, radio, and checkbox questions may include an `options` array.

---

## API Integration

The frontend sends a prompt to Hugging Face.

Example payload:

```json
{
  "inputs": "Create a customer feedback form."
}
```

The response should be parsed into the JSON schema above.

If the model returns extra text before or after the JSON, extract only the JSON object before processing.

---

## Prompt Template

The frontend should prepend the user's prompt with the following system instruction.

```
You are an AI Form Generator.

Generate ONLY valid JSON.

Do not explain anything.

Do not use markdown.

Do not wrap the JSON inside code blocks.

Return a JSON object with:

- title
- description
- questions

Each question must include:

- label
- type
- required

Allowed types:

text
email
number
textarea
select
radio
checkbox
date
rating

For select, radio, and checkbox questions, include an "options" array.

Return valid JSON only.
```

---

## Frontend Responsibilities

The frontend is responsible for:

- calling the Hugging Face API
- parsing the JSON
- validating the schema
- rendering the form editor
- allowing the user to edit generated questions
- saving the form to the backend

The AI should never generate UI code.

The AI only generates structured form data.

---

## Error Handling

If the AI response cannot be parsed:

- show an error message
- allow the user to retry
- never save invalid JSON

---

## Future Improvements

Possible future enhancements:

- Multi-page forms
- Conditional questions
- File upload fields
- AI-generated validation rules
- AI-generated placeholder text
- AI-generated help text
- AI-generated default values
- Form templates by industry