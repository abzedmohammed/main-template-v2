import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { notifyError } from '../utils';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { useDynamicMutation } from 'abzed-utils';
import { adminRefreshToken } from '../actions/adminActions';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';

const PROMPT_BEFORE_EXPIRY_SECONDS = 60;

export function useTokenExpiryChecker() {
    const dispatch = useDispatch();

    const { isActive } = useSelector((state) => state.auth);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleRedirect = useCallback(() => {
        authService.logout({ dispatch });
    }, [dispatch]);

    const refreshMutation = useDynamicMutation({
        mutationFn: adminRefreshToken.mutationFn,
        onError: (message) => {
            if (message) {
                notifyError(message);
            }
            notifyError('A new session is required. You are being redirected to login.');
            handleRedirect();
        },
        onSuccess: ({ response }) => {
            const refreshedToken = response?.token || response?.data?.token;
            if (refreshedToken) {
                tokenService.set(refreshedToken);
            }

            setIsModalVisible(false);
        },
    });

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        let timeoutId;

        const clearTokenTimer = () => {
            clearTimeout(timeoutId);
        };

        const openModal = (delay = 0) => {
            clearTokenTimer();
            timeoutId = setTimeout(() => {
                setIsModalVisible(true);
            }, delay);
        };

        const scheduleTokenCheck = (token) => {
            if (!token) {
                openModal();
                return;
            }

            try {
                const decoded = jwtDecode(token);

                if (!decoded?.exp) {
                    openModal();
                    return;
                }

                const currentTime = Math.floor(Date.now() / 1000);
                const timeLeft = decoded.exp - currentTime;

                if (timeLeft <= 0) {
                    openModal();
                    return;
                }

                const timeBeforePrompt = Math.max(
                    timeLeft - PROMPT_BEFORE_EXPIRY_SECONDS,
                    1
                );
                openModal(timeBeforePrompt * 1000);
            } catch {
                openModal();
            }
        };

        scheduleTokenCheck(tokenService.get());

        const unsubscribe = tokenService.subscribe((nextToken) => {
            setIsModalVisible(false);
            scheduleTokenCheck(nextToken);
        });

        return () => {
            clearTokenTimer();
            unsubscribe();
        };
    }, [isActive]);

    const handleRefresh = () => {
        refreshMutation.mutate({});
    };

    return (
        <Modal
            open={isModalVisible}
            // open
            title="Session Expired"
            closable={false}
            centered
            cancelText="Logout"
            okText="Keep me logged in"
            okButtonProps={{
                className: 'secondary_btn',
            }}
            cancelButtonProps={{
                className: 'cancel_btn',
            }}
            onCancel={handleRedirect}
            onOk={handleRefresh}
        >
            <p className="mb-5">Your session has expired.</p>
        </Modal>
    );
}
