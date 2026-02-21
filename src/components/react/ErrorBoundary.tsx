import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    componentName?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Premium Error Boundary for React Islands
 * Prevents a single component failure from breaking the entire page.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`Error in component ${this.props.componentName || 'React Island'}:`, error, errorInfo);

        // Optional: Log to Sentry if available
        if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, { extra: errorInfo as any });
        }
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="glass-card p-8 text-center border-red-500/20 bg-red-500/5">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">Ups! Niečo sa pokazilo</h3>
                    <p className="text-chrome-gray text-sm mb-6">
                        Komponent sa nepodarilo načítať. Skúste prosím obnoviť stránku.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-glass text-xs py-2 px-4"
                    >
                        Obnoviť stránku
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
