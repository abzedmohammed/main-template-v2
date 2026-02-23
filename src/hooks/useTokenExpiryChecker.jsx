import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { logoutUrl, notifyError } from '../utils';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { logoutStateFn } from '../features/auth/authSlice';
import { useDynamicMutation } from 'abzed-utils';
import { adminRefreshToken } from '../actions/adminActions';

const PROMPT_BEFORE_EXPIRY_SECONDS = 60;

export function useTokenExpiryChecker() {
    const dispatch = useDispatch();

    const { isActive } = useSelector((state) => state.auth);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleRedirect = useCallback(() => {
        localStorage.removeItem('token');
        dispatch(logoutStateFn());
        window.location.assign(logoutUrl);
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
                localStorage.setItem('token', refreshedToken);
            }

            setIsModalVisible(false);
        },
    });

    useEffect(() => {
        if (!isActive) {
            return undefined;
        }

        let timeoutId;
        const openModal = (delay = 0) => {
            timeoutId = setTimeout(() => {
                setIsModalVisible(true);
            }, delay);
        };

        const token = localStorage.getItem('token');
        if (!token) {
            openModal();
            return () => clearTimeout(timeoutId);
        }

        const scheduleTokenCheck = () => {
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
                } else {
                    const timeBeforePrompt = Math.max(
                        timeLeft - PROMPT_BEFORE_EXPIRY_SECONDS,
                        1
                    );
                    openModal(timeBeforePrompt * 1000);
                }
            } catch {
                openModal();
            }
        };

        scheduleTokenCheck();

        return () => clearTimeout(timeoutId);
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
