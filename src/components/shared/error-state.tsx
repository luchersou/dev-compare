import { CircleAlert } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p className="status status--bad">
        <CircleAlert aria-hidden="true" />
        {message ?? "Something went wrong"}
      </p>

      {onRetry && (
        <button type="button" onClick={onRetry} className="key key--sm">
          Try again
        </button>
      )}
    </div>
  );
}
