// hooks/useTokenExpiryChecker.js
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { logoutUrl, notifyError } from "../utils";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { logoutStateFn } from "../features/auth/authSlice";
import { useDynamicMutation } from "abzed-utils";
import { adminRefreshToken } from "../actions/adminActions";

let externalShowModal = null;

export const showTokenExpiryModal = () => {
    if (externalShowModal) externalShowModal(true);
};

export function useTokenExpiryChecker() {
    const dispatch = useDispatch();

    const { initLoading } = useSelector((state) => state.global);
    const { token } = useSelector((state) => state.auth);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const refreshMutation = useDynamicMutation({
        mutationFn: adminRefreshToken.mutationFn,
        onError: () => {
            notifyError("A new session is required. You are being redirected to login.");
            handleRedirect();
        },
        onSuccess: () => {
            setIsModalVisible(false);
        },
    });

    useEffect(() => {
        externalShowModal = setIsModalVisible;
        return () => {
            externalShowModal = null;
        };
    }, []);

    useEffect(() => {
        if (initLoading) {
            setIsModalVisible(false);
            return;
        }

        let timeoutId;

        if (!token) {
            timeoutId = setTimeout(() => {
                // setIsModalVisible(true);
            }, 2000);
            return () => clearTimeout(timeoutId);
        }

        const checkToken = () => {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decoded.exp < currentTime) {
                    // setIsModalVisible(true);
                } else {
                    const timeLeft = decoded.exp - currentTime;
                    timeoutId = setTimeout(
                        checkToken,
                        Math.max(timeLeft - 60, 1) * 1000
                    );
                }
            } catch (error) {
                console.error("Token decode error:", error);
                // setIsModalVisible(true);
            }
        };

        checkToken();

        return () => clearTimeout(timeoutId);
    }, [initLoading, token]);

    const handleRedirect = () => {
        dispatch(logoutStateFn());
        window.location.href = logoutUrl;
    };

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
                className: "secondary_btn",
            }}
            cancelButtonProps={{
                className: "cancel_btn",
            }}
            onCancel={handleRedirect}
            onOk={handleRefresh}
        >
            <p className="mb-5">Your session has expired.</p>
        </Modal>
    );
}
