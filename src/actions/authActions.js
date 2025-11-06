import axiosInstance from "../instance";
import { authStateFn, userIdStateFn } from "../features/auth/authSlice";
import { notifyError, notifySuccess } from "../utils";
import { jwtDecode } from "jwt-decode";

const handleLoginSuccess = ({ token, dispatch, successMessage }) => {
    if (token) {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);
        decoded.role = "ADMIN";
        notifySuccess(successMessage);
        dispatch(authStateFn(decoded));
        setTimeout(() => {
            window.location.replace(`/#/dashboard`);
        }, 50);
    } else {
        notifyError("Could not verify account");
    }
};

export const loginAction = {
    mutationFn: async (data) => await axiosInstance.post("/auth/sign_in", data),
    onSuccess: ({ response, navigate, dispatch }) => {
        notifySuccess("Please verify your account");
        dispatch(userIdStateFn(response?.data?.usrId));
        navigate("/auth/login/verification");
    },
};

export const registerAction = {
    mutationFn: async (data) => await axiosInstance.post("/auth/sign_up", data),
    onSuccess: ({ response, dispatch, navigate, form }) => {
        notifySuccess(
            "Registration successful.Please verify your phone number"
        );
        dispatch(userIdStateFn(response?.data?.usrId));
        form?.resetFields();
        navigate("/auth/registration/verification");
    },
};

export const accountVerification = {
    mutationFn: async (data) =>
        await axiosInstance.post("/auth/sign_in_otp", data),
    onSuccess: ({ response, dispatch }) => {
        let token = response?.token;
        handleLoginSuccess({
            token,
            dispatch,
            successMessage: "Account verification successful",
        });
    },
};

export const accountResendOtp = {
    mutationFn: async (body) =>
        await axiosInstance.post("/auth/resend_otp", body),
};

export const forgotPasswordAction = {
    mutationFn: async (data) =>
        await axiosInstance.post("/auth/reset_password", data),
    onSuccess: ({ response, dispatch, navigate }) => {
        console.log(response);
        dispatch(userIdStateFn(response?.data?.usrId));
        notifySuccess("OTP sent successfully");
        navigate("/auth/forgot-password/verification");
    },
};

export const forgotPasswordVerificationAction = {
    mutationFn: async (data) =>
        await axiosInstance.post("/auth/sign_in_otp", data),
    onSuccess: ({ response, navigate }) => {
        console.log(response);
        notifySuccess("Account verification successful");
        navigate("/auth/update-password");
    },
};

export const updatePasswordAction = {
    mutationFn: async (data) =>
        await axiosInstance.post("/auth/update_password", data),
    onSuccess: ({ navigate }) => {
        notifySuccess("Password updated successfully");
        navigate("/auth/login");
    },
};
