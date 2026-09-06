Read `AGENTS.md` before starting

We are adding the design system and UI primitive components. 

Install and configure `shadcn`

Add this `shard\cm` component. 

- Button 
- card 
- dialog 
- Input
- tabs
- textArea 
- ScrollArea 

Do not modify the generated `components\ui\*` files after installation. 

Also add `Lucid-React`.


With `lib/utils.ts` with a reusable `cn()` for merging Tailwind classes 

Ensure all components match the dark theme in globals.css. 

### check when done
- Components import without errors
- cn() work properly. 
- No default light styling appears. 