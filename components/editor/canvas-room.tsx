"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import { ErrorBoundary } from "react-error-boundary"

import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense"

import { Canvas } from "@/components/editor/canvas"

interface CanvasRoomProps {
  roomId: string
}

// Sets up the Liveblocks room for a workspace and hands off to the React
// Flow canvas once Storage has loaded.
export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null, thinking: false }}>
        <ErrorBoundary FallbackComponent={CanvasConnectionError}>
          <ClientSideSuspense fallback={<CanvasLoading />}>
            <Canvas roomId={roomId} />
          </ClientSideSuspense>
        </ErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

function CanvasLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm">Connecting to the shared canvas…</p>
    </div>
  )
}

function CanvasConnectionError() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl border border-border bg-popover text-destructive">
        <AlertTriangle className="size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">
          Couldn&apos;t connect to the canvas
        </p>
        <p className="text-sm text-muted-foreground">
          Check your connection and refresh the page to try again.
        </p>
      </div>
    </div>
  )
}
