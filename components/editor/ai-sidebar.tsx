"use client"

import { useRef, useState } from "react"
import { Bot, Download, FileText, Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AiSidebarProps {
  /** Whether the sidebar is visible; toggled from the navbar. */
  open: boolean
  onClose: () => void
}

const STARTER_PROMPTS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
]

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

const activeTabClass =
  "data-active:bg-accent data-active:text-accent-foreground text-muted-foreground"

/**
 * Floating AI chat sidebar. Structure only — messaging is local UI state,
 * no backend, Liveblocks, or AI generation logic attaches here yet.
 */
export function AiSidebar({ open, onClose }: AiSidebarProps) {
  if (!open) {
    return null
  }

  return (
    <aside className="my-3 mr-3 flex w-96 shrink-0 flex-col overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Bot className="size-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-foreground">
              AI Workspace
            </span>
            <span className="text-xs text-muted-foreground">
              Collaborate with Ghost AI
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close AI sidebar"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      <Tabs
        defaultValue="architect"
        className="flex min-h-0 flex-1 flex-col px-3 pt-3"
      >
        <TabsList className="w-full">
          <TabsTrigger value="architect" className={cn("flex-1", activeTabClass)}>
            AI Architect
          </TabsTrigger>
          <TabsTrigger value="specs" className={cn("flex-1", activeTabClass)}>
            Specs
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="architect"
          className="flex min-h-0 flex-1 flex-col py-3"
        >
          <AiArchitectTab />
        </TabsContent>

        <TabsContent value="specs" className="min-h-0 flex-1 overflow-y-auto py-3">
          <SpecsTab />
        </TabsContent>
      </Tabs>
    </aside>
  )
}

function AiArchitectTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function sendMessage(content: string) {
    const trimmed = content.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: trimmed },
    ])
    setInput("")
  }

  function handleStarterClick(prompt: string) {
    setInput(prompt)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="min-h-0 flex-1 overflow-y-auto px-1">
        {messages.length === 0 ? (
          <EmptyArchitectState onStarterClick={handleStarterClick} />
        ) : (
          <div className="flex flex-col gap-3 pb-2">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-end gap-2 border-t border-border px-1 pt-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              sendMessage(input)
            }
          }}
          placeholder="Describe what you want to build..."
          className="max-h-40 min-h-18 resize-none"
        />
        <Button
          size="icon"
          aria-label="Send message"
          className="shrink-0"
          onClick={() => sendMessage(input)}
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}

function EmptyArchitectState({
  onStarterClick,
}: {
  onStarterClick: (prompt: string) => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Bot className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          Design your system with AI
        </p>
        <p className="text-xs text-muted-foreground">
          Describe what you want to build and Ghost AI will help you
          architect it.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {STARTER_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onStarterClick(prompt)}
            className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-secondary/80"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-2 text-sm wrap-break-word",
          isUser
            ? "border-2 border-primary/50 bg-accent text-foreground"
            : "border border-border bg-popover text-accent-foreground"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

function SpecsTab() {
  return (
    <div className="flex flex-col gap-4 px-1">
      <Button className="w-full">
        <FileText />
        Generate Spec
      </Button>

      <div className="rounded-2xl border border-border bg-popover p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <FileText className="size-4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              Architecture Spec
            </span>
            <p className="line-clamp-3 text-xs text-muted-foreground">
              Defines the system&apos;s services, data flow, and
              infrastructure components based on the current canvas layout.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Download spec"
            disabled
          >
            <Download />
          </Button>
        </div>
      </div>
    </div>
  )
}
