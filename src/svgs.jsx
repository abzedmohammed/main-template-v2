export const GoogleSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={15}
        height={15}
        viewBox="0 0 15 15"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        {...props}
    >
        <path
            d="M13.6284 6.27594H13.125V6.25H7.5V8.75H11.0322C10.5169 10.2053 9.13219 11.25 7.5 11.25C5.42906 11.25 3.75 9.57094 3.75 7.5C3.75 5.42906 5.42906 3.75 7.5 3.75C8.45594 3.75 9.32563 4.11063 9.98781 4.69969L11.7556 2.93188C10.6394 1.89156 9.14625 1.25 7.5 1.25C4.04844 1.25 1.25 4.04844 1.25 7.5C1.25 10.9516 4.04844 13.75 7.5 13.75C10.9516 13.75 13.75 10.9516 13.75 7.5C13.75 7.08094 13.7069 6.67188 13.6284 6.27594Z"
            fill={color}
        />
        <path
            d="M1.97058 4.59094L4.02402 6.09688C4.57964 4.72125 5.92527 3.75 7.49996 3.75C8.45589 3.75 9.32558 4.11062 9.98777 4.69969L11.7556 2.93187C10.6393 1.89156 9.14621 1.25 7.49996 1.25C5.09933 1.25 3.01746 2.60531 1.97058 4.59094Z"
            fill={color}
        />
        <path
            d="M7.49998 13.7502C9.11435 13.7502 10.5812 13.1324 11.6903 12.1277L9.75591 10.4908C9.10733 10.9841 8.31481 11.2509 7.49998 11.2502C5.87435 11.2502 4.49404 10.2137 3.97404 8.76709L1.93591 10.3374C2.97029 12.3615 5.07091 13.7502 7.49998 13.7502Z"
            fill={color}
        />
        <path
            d="M13.6284 6.27594H13.125V6.25H7.5V8.75H11.0322C10.7857 9.44263 10.3417 10.0479 9.755 10.4909L9.75594 10.4903L11.6903 12.1272C11.5534 12.2516 13.75 10.625 13.75 7.5C13.75 7.08094 13.7069 6.67188 13.6284 6.27594Z"
            fill={color}
        />
    </svg>
);

export const CloseSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        {...props}
    >
        <path
            d="M0.75 0.75L10.75 10.75M0.75 10.75L10.75 0.75"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ToastSuccessMarkSvg = ({ color = 'currentColor', ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        {...props}
    >
        <path
            d="M10.25 3.75L5.5 8.5L3 6"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const InfoSvg = ({ color = 'currentColor', ...props }) => (
    <svg
        className="fx flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z"
            fill={color}
            fillOpacity="0.25"
        />
        <path
            d="M11 10.5H11.5C11.6326 10.5 11.7598 10.5527 11.8536 10.6464C11.9473 10.7402 12 10.8674 12 11V15C12 15.1326 12.0527 15.2598 12.1464 15.3536C12.2402 15.4473 12.3674 15.5 12.5 15.5H13M12 8.5H12.01"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ToastErrorMarkSvg = ({ color = 'currentColor', ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        {...props}
    >
        <path
            d="M6.5 3.35V7.1M6.5 9.3V9.35"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const LockSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        {...props}
    >
        <rect
            x="2.75"
            y="6.25"
            width="8.5"
            height="6"
            rx="1.5"
            stroke={color}
            strokeWidth="1.5"
        />
        <path
            d="M4.75 6.25V4.75a2.25 2.25 0 0 1 4.5 0v1.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const MailSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        {...props}
    >
        <rect
            x="2.75"
            y="4.75"
            width="14.5"
            height="10.5"
            rx="1.75"
            stroke={color}
            strokeWidth="1.5"
        />
        <path
            d="m3.5 6 6.5 4.5L16.5 6"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const UserSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        {...props}
    >
        <path
            d="M10 10a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM4 16.5a6 6 0 0 1 12 0"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const KeySvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        {...props}
    >
        <circle cx="7" cy="7" r="3.25" stroke={color} strokeWidth="1.5" />
        <path
            d="M9.3 9.3 16 16M13.5 13.5l1.75-1.75M15.25 15.25 17 13.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ArrowRightSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        {...props}
    >
        <path
            d="M3.75 9h10.5M9.75 4.5 14.25 9l-4.5 4.5"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ShieldLockSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        {...props}
    >
        <path
            d="M16 3 6 7v8c0 6 4.2 10.9 10 12.5C21.8 25.9 26 21 26 15V7L16 3Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <rect
            x="12"
            y="14.5"
            width="8"
            height="6"
            rx="1.5"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M13.5 14.5v-1.5a2.5 2.5 0 0 1 5 0v1.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export const RefreshSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
    >
        <path
            d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2v2.5H11"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const CheckCircleSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
    >
        <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.4" />
        <path
            d="M5.5 8.2 7.1 9.8 10.6 6"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ShieldCheckSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
    >
        <path
            d="M8 1.5 3 3.5v3.75c0 3 2.1 5.45 5 6.25 2.9-.8 5-3.25 5-6.25V3.5L8 1.5Z"
            stroke={color}
            strokeWidth="1.4"
            strokeLinejoin="round"
        />
        <path
            d="M6 7.75 7.4 9.15 10.25 6.3"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SunSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
    >
        <circle cx="8" cy="8" r="3.25" stroke={color} strokeWidth="1.4" />
        <path
            d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
        />
    </svg>
);

export const MoonSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
    >
        <path
            d="M13.5 10.35A5.75 5.75 0 0 1 5.65 2.5a6 6 0 1 0 7.85 7.85Z"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const ScreenSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        {...props}
    >
        <rect
            x="1.75"
            y="2.75"
            width="12.5"
            height="8.5"
            rx="1.25"
            stroke={color}
            strokeWidth="1.4"
        />
        <path
            d="M5.75 13.75h4.5"
            stroke={color}
            strokeWidth="1.4"
            strokeLinecap="round"
        />
    </svg>
);

export const CheckSvg = ({ color = 'currentColor', ...props } = {}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        {...props}
    >
        <path
            d="M2.5 7.25 5.5 10.25 11.5 4.25"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
