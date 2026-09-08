## Goal

Build the `/editor` home screen and add dialog/sidebar actions. No API calls or persistence yet.

## Editor Home

Reuse the existing editor layout. Do not modify the nav bar or sidebar behavior.

The center of the page, add 

- heading: `Create a project or open an existing one. `
- description: Start a new architecture workspace or choose a project from the sidebar.
- New Project button becomes a `plus` icon.

keep the layout minimal. Do not wrap this content in cards.

Clicking "New project" should open the "Create project" dialog.

### Create Project
- project name input
- Live slug preview based on the name
- Preview updates as the user types

### Rename Project
- Pre-filled project name input
- Current project name shown in the description 
- Input auto-focuses
- Enter submit

### Delete Project
- Destructive confirmation only. 
- no Input
- Confirm button uses destructive styling. 


## Sidebar

add project item actions

-rename 
-delete

show Actions only for own project 

Hide actions for shared/collaborator projects. 

On mobile:

- Tapping outside the sidebar closes it. 
- Add a backdrop Scrim.

## Implementation

Create a dedicated hook to manage 

- dialogue state
- form state
- loading state

Wire

- editor home `New Project` -> Create dialog
- sidebar create -> Create Dialog
- sidebar rename -> Rename Dialog
- sidebar delete -> Delete dialog

use mock project data only. do not add api calls for persistence

## Check when done

- sidebar actions are wired
- slug preview works 
- no typescript errors 
- no lint errors
