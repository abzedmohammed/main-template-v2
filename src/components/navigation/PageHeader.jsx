import { DynamicBtn, TextDynamic } from "abzed-utils";

export default function PageHeader({
    icon,
    header,
    body,
    showIcon = false,
    btnText,
    btnFn,
    showBtn = false,
    btnProps,
    iconClick,
}) {
    return (
        <div className="w-full fx_btwn_center flex-wrap gap-5 border-b-[.0625rem] border-[#E7E7E7] pb-[.75rem]">
            <div className="fx_col gap-[.88rem]">
                <div className="fx_col gap-[.25rem]">
                    {showIcon ? (
                        <button
                            type="button"
                            onClick={iconClick}
                            className="fx_item_center gap-[.62rem]"
                        >
                            {icon}

                            <TextDynamic
                                text={header}
                                className={"txt_h2"}
                                tagName="h1"
                            />
                        </button>
                    ) : (
                        <TextDynamic
                            text={header}
                            className={"txt_h2"}
                            tagName="h1"
                        />
                    )}

                    <TextDynamic
                        text={body}
                        className={"txt_75 text-[#545454]"}
                    />
                </div>
            </div>

            {showBtn && (
                <DynamicBtn {...btnProps} handleClick={btnFn} text={btnText} />
            )}
        </div>
    );
}
