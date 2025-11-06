import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const avatarItemsFn = (handleLogout) => [
    {
        label: (
            <Link
                to='/profile'
                className='fx_item_center gap-2.5'>
                <SettingOutlined />
                <span className='avatar_dropdown_text'>Profile</span>
            </Link>
        ),
        key: '1',
    },
    {
        label: (
            <div
                type='button'
                onClick={handleLogout}
                className='fx_item_center gap-2.5 pointer'>
                <LogoutOutlined />
                <span className='avatar_dropdown_text'>Log out</span>
            </div>
        ),
        key: '2',
    },
];