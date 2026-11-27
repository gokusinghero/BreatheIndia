import React from "react";

/**
 * Error boundary preventing uncaught render exceptions from leaking stack traces.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen bg-[#0E1110] text-zinc-100 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#161B19] border border-zinc-800 text-center space-y-4">
            <h1 className="font-display text-xl font-bold text-zinc-100">Something went wrong</h1>
            <p className="text-sm text-zinc-300">
              BreatheSafe India encountered an unexpected display error. Your local preferences are safe.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
