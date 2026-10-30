import { TextDynamic } from 'abzed-utils';
import { THEME_MODE_META } from '../data';
import { THEME_MODES } from '../features/global/globalSlice';
import { CheckSvg } from '../svgs';

export const newThemeModeItems = (activeMode, { onSelect }) =>
    THEME_MODES.map((themeMode) => {
        const { label, Icon } = THEME_MODE_META[themeMode];
        const isActive = themeMode === activeMode;

        return {
            key: themeMode,
            label: (
                <span className="fx_item_center gap-2 min-w-32">
                    <Icon />
                    <TextDynamic text={label} className="txt_8125_medium" />
                    {isActive && <CheckSvg className="ml-auto text-privacy-indigo" />}
                </span>
            ),
            onClick: () => onSelect(themeMode),
        };
    });
