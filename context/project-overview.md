# Ghost AI

## Overview

Post AI is a real-time collaborative system design workspace. Users describe a system in plain English, and an AI agent maps that system into a shared canvas. Collaborators refine the architecture, and the app generates a technical specification from the resulting graph.

## Goals

1. Let authenticated users create and manage architecture projects.
2. Provide the collaborative real-time canvas for the system design.
3. Let users import prebuilt starter system designs into Canvas.
4. Let collaborators refine the generated architecture.
5. Convert the final graph into a persistent Markdown technical spec.

## Core User Flow

1. User signs in. 
2. User creates or selects a project. 
3. User enters the project workspace.
4. User optionally imports starter system design templates into Canvas. 
5. User prompts the AI to generate or extend the system design. 
6. AI generates nodes and edges in the shared canvas.
7. User triggers spec generation. 
8. App persists the generated Markdown spec. 
9. User views or downloads the spec.

## Features

### Authentication and Projects

- Users - Sign-in and route protection 
- Project creation, ownership, and collaborator access 
- Project list and workspace navigation


### Collaborative canvas: 
- Shared, real-time canvas using life blocks and React Flow - Live cursors - Presence indicators - Node edge editing 
- Canvas snapshots persistent to the file system

### Starter system design

- A curated library of prebuilt system design templates. 
- Users can import starter templates into the canvas at any point during editing.
- Templates are static canvas snapshots loaded directly into the active room.
- Covers common patterns: monolith, microservices, event-driven, serverless, and more

### AI architecture generation
- AI generates a system design from a user-supplied prompt 
- Output is structured as canvas nodes and edges, written into the shared room
- Generation runs as a durable background task

### Spec generation
- The current canvas graph is converted into a Markdown technical specification
- Specs are persisted as files and linked to the project in a database
- Users can view and download generated specs

## Scope

### In Scope

- Authentication and root protection 
- Project creation and ownership 
- Collaborator access by project 
- Starter system design template library and import 
- Real-time shared canvas with node edges and present 
- AI-powered architecture generation from prompt 
- AI-powered Markdown spec generation from the canvas graph 
- Persistent storage for project metadata and generated artifact spec download


### Out of Scope

- Billing and subscription systems 
- Enterprise permission tiers beyond owner and collaborator 
- Versioned spec history and review workflows 
- Production object storage migration 
- Mobile native applications

## Success Criteria

1. A signed-in user can create and open a project.
2. Multiple users can collaborate in the same canvas simultaneously.
3. A user can import a prebuilt starter design into the canvas.
4. AI can generate an architecture in the shared room from a prompt.
5. The graph can be converted into a persistent Markdown spec.
6. Project metadata and generated artifacts are stored in the correct layers.
