import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-7rem)] flex flex-col justify-center items-center text-red-600">
          <h2>Something went wrong.</h2>
          <p>{this.state.errorMessage}</p>
          <button onClick={this.handleReset} className="text-black">Try Again</button>
        </div>
      );
    }

    return this.props.children;
  }
}
