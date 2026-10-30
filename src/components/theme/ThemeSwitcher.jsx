import { capitaliseFirstLetter, DynamicBtn, PrimaryDropdown } from 'abzed-utils';
import { THEME_MODE_META } from '../../data';
import { useThemeMode } from '../../hooks';
import { newThemeModeItems } from '../../lists';

export default function ThemeSwitcher({
    devOnly = true,
    showLabel = true,
    placement = 'bottomRight',
    className = 'plain_btn',
}) {
    const { mode, resolvedMode, setMode } = useThemeMode();

    if (devOnly && !import.meta.env.DEV) {
        return null;
    }

    const { Icon } = THEME_MODE_META[mode];
    const label =
        mode === 'system'
            ? `${THEME_MODE_META.system.label} (${resolvedMode})`
            : capitaliseFirstLetter(mode);

    return (
        <PrimaryDropdown
            items={newThemeModeItems(mode, { onSelect: setMode })}
            placement={placement}
            triggerButton={
                <DynamicBtn
                    text={showLabel ? `Theme: ${label}` : undefined}
                    icon={<Icon />}
                    className={className}
                    aria-label={`Theme: ${label}`}
                />
            }
        />
    );
}
