import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { DynamicBtn, TextDynamic } from 'abzed-utils';
import { authService } from '../services/authService';
import { tokenService } from '../services/tokenService';

// Shown by useTokenExpiryChecker when the rolling/absolute time cap is reached.
// The template unlocks client-side: "Continue working" resets the session
// window and resumes. Projects that need a hard cap should replace
// handleContinue with a backend re-auth (verify password / PIN) before
// unlocking — see the "Lock unlock" options in useTokenExpiryChecker.
export default function SessionLockScreen({ onUnlocked }) {
    const dispatch = useDispatch();

    const handleContinue = () => {
        tokenService.refreshSession();
        onUnlocked?.();
    };

    const handleLogout = () => {
        authService.logout({ dispatch });
    };

    return (
        <Modal
            open
            closable={false}
            maskClosable={false}
            keyboard={false}
            centered
            footer={null}
            width={430}
            className="session_lock_modal"
        >
            <div className="session_expiry_content">
                <div className="session_expiry_icon">!</div>
                <div className="session_expiry_copy">
                    <TextDynamic
                        tagName="h2"
                        text="Session secured"
                        color="#121212"
                        className="font_heading txt_1_25_medium"
                    />
                    <TextDynamic
                        tagName="p"
                        text="Your secure session reached its time limit and was paused. Continue to keep working, or log out."
                        color="#697077"
                        className="txt_875"
                    />
                </div>

                <div className="session_expiry_actions">
                    <DynamicBtn
                        type="button"
                        text="Log out"
                        className="cancel_btn session_expiry_btn"
                        onClick={handleLogout}
                    />
                    <DynamicBtn
                        type="button"
                        text="Continue working"
                        className="primary_btn session_expiry_btn"
                        onClick={handleContinue}
                    />
                </div>
            </div>
        </Modal>
    );
}
