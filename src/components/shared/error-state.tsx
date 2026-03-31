interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="p-6 text-sm text-center">
      <p className="text-red-500 mb-2">
        {message ?? "Something went wrong"}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs underline text-muted-foreground hover:text-foreground transition"
        >
          Try again
        </button>
      )}
    </div>
  );
}