import { DynamicBtn, TextDynamic } from 'abzed-utils';

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
        <div className="w-full fx_btwn_center flex-wrap gap-5 border-b border-[#E7E7E7] pb-3">
            <div className="fx_col gap-3.5">
                <div className="fx_col gap-1">
                    {showIcon ? (
                        <button
                            type="button"
                            onClick={iconClick}
                            className="fx_item_center gap-2.5"
                        >
                            {icon}

                            <TextDynamic
                                text={header}
                                className={'txt_1_5_semi'}
                                tagName="h1"
                            />
                        </button>
                    ) : (
                        <TextDynamic
                            text={header}
                            className={'txt_1_5_semi'}
                            tagName="h1"
                        />
                    )}

                    <TextDynamic color="#545454" text={body} className={'txt_75'} />
                </div>
            </div>

            {showBtn && (
                <DynamicBtn {...btnProps} onClick={btnFn} text={btnText} />
            )}
        </div>
    );
}
