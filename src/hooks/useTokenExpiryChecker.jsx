import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DynamicBtn, TextDynamic } from 'abzed-utils';
import { authService } from '../services/authService';
import { subscribeSessionExpired } from '../services/sessionEvents';
import { tokenService } from '../services/tokenService';
import {
    sessionAbsoluteMaxMinutes,
    sessionExpiryCountdownSeconds,
    sessionIdleTimeoutMinutes,
    sessionMaxDurationMinutes,
    sessionWarningCountdownSeconds,
} from '../utils';
import SessionLockScreen from '../components/SessionLockScreen';

const ACTIVITY_EVENTS = [
    'pointerdown',
    'keydown',
    'input',
    'change',
    'scroll',
    'touchstart',
];

const WAKE_EVENTS = ['focus', 'pageshow'];
const SESSION_STORAGE_KEYS = [
    'token',
    'refreshToken',
    'app:last-activity-at',
    'app:session-started-at',
];

const IDLE_CHECK_INTERVAL_MS = 1000;
const ACTIVITY_WRITE_THROTTLE_MS = 10_000;

const MODE_IDLE_WARNING = 'idle-warning';
const MODE_MAX_WARNING = 'max-warning';
const MODE_EXPIRED = 'expired';
const MODE_FORCED_401 = 'forced-401';
const MODE_LOCKED = 'locked';

const toCountdownSeconds = (milliseconds) =>
    Math.max(1, Math.ceil(Number(milliseconds ?? 0) / 1000));

const getExpiredModeTitle = (reason) => {
    if (reason === 'idle-expired') return 'Session timed out';
    if (reason === 'max-expired') return 'Session ended';
    return 'Session expired';
};

export function useTokenExpiryChecker() {
    const dispatch = useDispatch();
    const { isActive } = useSelector((state) => state.auth);

    const [mode, setMode] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [expiredReason, setExpiredReason] = useState(null);

    const isLoggingOutRef = useRef(false);
    const lastActivityWriteRef = useRef(0);

    const maxDurationMs = sessionMaxDurationMinutes * 60 * 1000;
    const absoluteMaxMs = sessionAbsoluteMaxMinutes * 60 * 1000;
    const idleThresholdMs = sessionIdleTimeoutMinutes * 60 * 1000;
    const warningCountdownMs = sessionWarningCountdownSeconds * 1000;

    const getClientSessionStatus = useCallback(
        () =>
            tokenService.getSessionStatus({
                idleTimeoutMs: idleThresholdMs,
                maxDurationMs,
                absoluteMaxMs,
                warningCountdownMs,
            }),
        [idleThresholdMs, maxDurationMs, absoluteMaxMs, warningCountdownMs]
    );

    const openLocked = useCallback(() => {
        setExpiredReason('locked');
        setCountdown(0);
        setMode((current) => {
            if (current === MODE_FORCED_401) return current;
            return MODE_LOCKED;
        });
    }, []);

    const forceLogout = useCallback(() => {
        if (isLoggingOutRef.current) {
            return;
        }
        isLoggingOutRef.current = true;
        setMode(null);
        setCountdown(0);
        setExpiredReason(null);
        authService.logout({ dispatch });
    }, [dispatch]);

    const openForced401 = useCallback(() => {
        setExpiredReason('forced-401');
        setMode(MODE_FORCED_401);
        setCountdown(sessionExpiryCountdownSeconds);
    }, []);

    const openExpired = useCallback((reason = 'expired') => {
        setExpiredReason(reason);
        setMode((current) => {
            if (current === MODE_FORCED_401) return current;
            setCountdown(sessionExpiryCountdownSeconds);
            return MODE_EXPIRED;
        });
    }, []);

    const evaluateSession = useCallback(() => {
        if (!isActive || isLoggingOutRef.current) {
            return;
        }

        if (!tokenService.get()) {
            openExpired('missing-token');
            return;
        }

        const status = getClientSessionStatus();

        if (status.state === 'expired') {
            // The rolling/absolute cap ending shouldn't kick the user out —
            // instead pause them behind a lock screen until they re-auth
            // with their transaction PIN. Idle expiry keeps the logout path.
            if (status.reason === 'max-expired' || status.reason === 'absolute-expired') {
                openLocked();
                return;
            }
            openExpired(status.reason);
            return;
        }

        if (status.state === 'warning') {
            // Both warnings use the same actionable modal — Continue records
            // activity, which also bumps the rolling-cap anchor, extending
            // the session.
            setExpiredReason(status.reason);
            setMode((current) => {
                if (
                    current === MODE_FORCED_401 ||
                    current === MODE_EXPIRED ||
                    current === MODE_LOCKED
                ) {
                    return current;
                }
                return MODE_IDLE_WARNING;
            });
            setCountdown(toCountdownSeconds(status.remainingMs));
            return;
        }

        setMode((current) => {
            if (current === MODE_IDLE_WARNING || current === MODE_MAX_WARNING) {
                setCountdown(0);
                setExpiredReason(null);
                return null;
            }
            return current;
        });
    }, [getClientSessionStatus, isActive, openExpired, openLocked]);

    useEffect(() => {
        if (isActive) {
            tokenService.ensureSessionStarted();
            isLoggingOutRef.current = false;
            const checkId = window.setTimeout(evaluateSession, 0);
            return () => window.clearTimeout(checkId);
        }

        const clearId = window.setTimeout(() => {
            setMode(null);
            setCountdown(0);
            setExpiredReason(null);
        }, 0);

        return () => window.clearTimeout(clearId);
    }, [evaluateSession, isActive]);

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        return subscribeSessionExpired((reason) => {
            if (reason === 'forced-401') {
                openForced401();
                return;
            }
            openExpired(reason);
        });
    }, [isActive, openExpired, openForced401]);

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        const recordActivity = () => {
            if (isLoggingOutRef.current) return;
            if (mode) return;

            const now = Date.now();
            if (now - lastActivityWriteRef.current < ACTIVITY_WRITE_THROTTLE_MS) {
                return;
            }

            lastActivityWriteRef.current = now;
            tokenService.touchActivity(now);
            // Slide the rolling-cap forward — capped at the absolute ceiling
            // so heavy users still re-authenticate at the 4-hour mark.
            tokenService.bumpMaxAnchor(now, absoluteMaxMs);
        };

        ACTIVITY_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, recordActivity, { passive: true });
        });

        return () => {
            ACTIVITY_EVENTS.forEach((eventName) => {
                window.removeEventListener(eventName, recordActivity);
            });
        };
    }, [absoluteMaxMs, isActive, mode]);

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        const handleWake = () => {
            evaluateSession();
        };

        WAKE_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, handleWake);
        });

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                evaluateSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            WAKE_EVENTS.forEach((eventName) => {
                window.removeEventListener(eventName, handleWake);
            });
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [evaluateSession, isActive]);

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        const handleStorage = (event) => {
            if (!SESSION_STORAGE_KEYS.includes(event.key)) {
                return;
            }

            if (event.key === 'token' && !event.newValue) {
                openExpired('missing-token');
                return;
            }

            evaluateSession();
        };

        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
        };
    }, [evaluateSession, isActive, openExpired]);

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        const intervalId = window.setInterval(evaluateSession, IDLE_CHECK_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [evaluateSession, isActive]);

    useEffect(() => {
        if (mode !== MODE_EXPIRED && mode !== MODE_FORCED_401) {
            return undefined;
        }

        if (countdown <= 0) {
            forceLogout();
            return undefined;
        }

        const id = window.setTimeout(() => {
            setCountdown((current) => current - 1);
        }, 1000);

        return () => window.clearTimeout(id);
    }, [countdown, forceLogout, mode]);

    const handleContinue = () => {
        const status = getClientSessionStatus();

        if (status.state === 'expired') {
            if (status.reason === 'max-expired' || status.reason === 'absolute-expired') {
                openLocked();
                return;
            }
            openExpired(status.reason ?? 'expired');
            return;
        }

        const now = Date.now();
        tokenService.touchActivity(now);
        tokenService.bumpMaxAnchor(now, absoluteMaxMs);
        setMode(null);
        setCountdown(0);
        setExpiredReason(null);
    };

    const handleLogout = () => {
        forceLogout();
    };

    if (!isActive || !mode) {
        return null;
    }

    if (mode === MODE_LOCKED) {
        return (
            <SessionLockScreen
                onUnlocked={() => {
                    setMode(null);
                    setCountdown(0);
                    setExpiredReason(null);
                }}
            />
        );
    }

    const isForced = mode === MODE_FORCED_401;
    const isExpired = mode === MODE_EXPIRED;
    const isMaxWarning = mode === MODE_MAX_WARNING;
    const canContinue = mode === MODE_IDLE_WARNING;

    const title = isForced
        ? 'Session expired'
        : isExpired
          ? getExpiredModeTitle(expiredReason)
          : isMaxWarning
            ? 'Secure session ending soon'
            : 'Session about to expire';

    const description = isForced
        ? `For your security, you will be redirected to the login page in ${countdown}s. Please log in again to continue.`
        : isExpired
          ? `For your security, your session has ended. You will be redirected to the login page in ${countdown}s.`
          : isMaxWarning
            ? `Your secure session is reaching the ${sessionMaxDurationMinutes}-minute limit. Please save or submit any work now.`
            : `You have been inactive for a while. Continue within ${countdown}s to keep working.`;

    return (
        <Modal
            open
            closable={false}
            maskClosable={false}
            keyboard={false}
            centered
            footer={null}
            width={430}
            className="session_expiry_modal"
        >
            <div className="session_expiry_content">
                <div className="session_expiry_icon">!</div>
                <div className="session_expiry_copy">
                    <TextDynamic
                        tagName="h2"
                        text={title}
                        color="#121212"
                        className="font_heading txt_1_25_medium"
                    />
                    <TextDynamic
                        tagName="p"
                        text={description}
                        color="#697077"
                        className="txt_875"
                    />
                </div>

                <div className="session_expiry_actions">
                    <DynamicBtn
                        type="button"
                        text={isExpired || isForced ? 'Log in again' : 'Log out'}
                        className="cancel_btn session_expiry_btn"
                        onClick={handleLogout}
                    />
                    {canContinue ? (
                        <DynamicBtn
                            type="button"
                            text="Continue"
                            className="primary_btn session_expiry_btn"
                            onClick={handleContinue}
                        />
                    ) : null}
                </div>
            </div>
        </Modal>
    );
}
