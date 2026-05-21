"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-medium">Something went wrong.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Refresh the page or try again in a moment.
          </p>
          <Button
            type="button"
            className="mt-4"
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
