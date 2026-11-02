import { Spin } from 'antd';

// Shown while a lazy page chunk loads on first visit (React Router `HydrateFallback`).
export default function RouteFallback() {
    return (
        <div
            className="w-full min-h-dvh fx_center"
            role="status"
            aria-label="Loading page"
        >
            <Spin size="large" />
        </div>
    );
}
