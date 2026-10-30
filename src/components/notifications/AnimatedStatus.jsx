const statusConfig = {
    success: { color: 'var(--color-success)', label: 'Success' },
    info: { color: 'var(--color-info)', label: 'Info' },
    error: { color: 'var(--color-danger)', label: 'Error' },
};

export default function AnimatedStatus({ type = 'success', size = 64 }) {
    const config = statusConfig[type] ?? statusConfig.success;

    return (
        <svg
            key={type}
            width={size}
            height={size}
            viewBox="0 0 64 64"
            role="img"
            aria-label={config.label}
            style={{ color: config.color }}
        >
            <circle
                className="status-circle"
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
            />

            {type === 'success' && (
                <path
                    className="status-symbol status-tick"
                    d="M19 33 L28 42 L46 23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}

            {type === 'info' && (
                <g className="status-symbol status-info">
                    <circle cx="32" cy="21" r="2.5" fill="currentColor" />
                    <path
                        d="M32 29 V44"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </g>
            )}

            {type === 'error' && (
                <path
                    className="status-symbol status-cross"
                    d="M23 23 L41 41 M41 23 L23 41"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
}
