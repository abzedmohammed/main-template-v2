import toast from "react-hot-toast";
import { CloseSvg, ErrorSvg, SuccessSvg } from "../../svgs";

export const successNotification = (toastObj) => {
    toast.custom(
        (t) => (
            <div key={t.id} className="toast_bar bg-[#22C55E]">
                <SuccessSvg />
                <div className="fx gap-6 items-start">
                    {toastObj?.message || "Operation completed successfully."}
                </div>
                <CloseSvg
                    width={16}
                    height={16}
                    color="#FFF"
                    className="pointer"
                    onClick={() => toast.dismiss(t.id)}
                />
            </div>
        ),
        {
            id: toastObj?.id,
        }
    );
};

export const errorNotification = (toastObj) => {
    toast.custom(
        (t) => (
            <div key={t.id} className="toast_bar bg-[#EE1D52]">
                <ErrorSvg />
                <div className="fx gap-[.75rem] items-start">
                    {toastObj?.message ||
                        "An error occurred. Please try again later"}
                </div>
                <CloseSvg
                    width={16}
                    height={16}
                    color="#FFF"
                    className="pointer"
                    onClick={() => toast.dismiss(t.id)}
                />
            </div>
        ),
        {
            id: toastObj?.id,
        }
    );
};
