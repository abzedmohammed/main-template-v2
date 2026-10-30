import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '../theme';

export default function HomeLayout() {
    return (
        <div className="w-full min-h-dvh fx_col p-4 md:p-8">
            <header className="w-full fx justify-end">
                <ThemeSwitcher />
            </header>

            <div className="w-full fx_1 fx_center">
                <Outlet />
            </div>
        </div>
    );
}
