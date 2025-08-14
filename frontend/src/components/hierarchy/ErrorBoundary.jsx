import React from 'react';

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
      return <div className="min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-7rem)] flex justify-center items-center text-red-600">Something went wrong!</div>;
    }
    return this.props.children;
  }
}
