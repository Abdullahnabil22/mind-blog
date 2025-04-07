import React from "react";
import { FiRefreshCw } from "react-icons/fi";
import { VscError } from "react-icons/vsc";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showStack: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  toggleStack = () => {
    this.setState((prev) => ({ showStack: !prev.showStack }));
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.MODE === "development";

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-red-200 to-red-500 text-center">
          <VscError className="text-error text-5xl mb-8" />
          <h1 className="text-text-primary mb-4 text-2xl font-bold">
            Something went wrong 🙁
          </h1>
          <p className="text-white mb-8 max-w-[500px] text-base leading-normal">
            {this.state.error?.message ||
              "An unexpected error occurred. Please try again."}{" "}
            {isDev && this.state.error?.stack && (
              <>
                <button
                  onClick={this.toggleStack}
                  className="bg-transparent border-none text-text-secondary underline cursor-pointer text-sm mt-2 hover:text-red-500"
                >
                  {this.state.showStack ? "Hide" : "Show"} Stack Trace
                </button>
                {this.state.showStack && (
                  <pre className="bg-white text-black p-4 rounded-sm overflow-x-auto w-full text-sm mt-4 text-left">
                    {this.state.error.stack}
                  </pre>
                )}
              </>
            )}
          </p>
          <button
            onClick={this.handleRefresh}
            className="flex items-center gap-2 px-8 py-2 bg-red-700  border-none rounded-md cursor-pointer text-base transition-colors hover:bg-red-900 "
          >
            <FiRefreshCw /> Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
