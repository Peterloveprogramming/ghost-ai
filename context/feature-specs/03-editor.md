Read `AGENTS.md` before starting

we need the base Chrome component that frames every editor screen: the top nav bar and the left side bar shell. This will be reused and extended in every chapter that follows

### Editor Navbar
Create `components/editor/editor-navbar.tsx`

Requirement:
- fixed height - top nav bar 
- Left, center, and right sections 
- Section contains sidebar toggle button 
- Panelleftopen, panelleftclose icons based on the sidebar state 
- Right section stays empty for now
- Dark background with subtle bottom border 

### Project sidebar

Create Create `components/editor/project-sidebar.tsx`

Requirements:
- sidebar should float above the editor canvas. 
- Opening it should not have pushed the page content. 
- Slides in from the left 
- Accepts isOpen prop
- The with project title + close button
- both tabs show empty placeholders state. 
- Fullwidth new project buttons at the bottom with plus icon

### Dialog Pattern

Use the existing tokens from globals.css for dialogue styling 

Support
- title
- description 
- Footer action 

do not build the actual dialogue yet

### Check when done
- new components compile without any typescript errors
- no lint errors
- dialogue pattern is ready for future use 
