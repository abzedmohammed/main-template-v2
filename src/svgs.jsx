export const GoogleSvg = ({props, color = '#53565B'}) => (
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

export const CloseSvg = ({ color = '#53565B', ...props } = {}) => (
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

export const ToastSuccessMarkSvg = ({color='white',...props}) => (
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

export const InfoSvg = ({color = 'white', ...props}) => (
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

export const ToastErrorMarkSvg = ({color = 'white', ...props}) => (
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
