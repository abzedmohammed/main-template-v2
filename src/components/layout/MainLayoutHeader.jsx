import { RightCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Header } from 'antd/es/layout/layout';
import { defaultDropdownOverlayStyle, PrimaryDropdown, TextDynamic } from 'abzed-utils';
import { Avatar } from 'antd';

export default function MainLayoutHeader({
    user,
    avatarItems,
    colorBgContainer,
    handleSidebarDrawer,
}) {
    return (
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex' }}>
            <div className="w-full fx_btwn_center px-6">
                <div className="flex md:hidden">
                    <button
                        onClick={handleSidebarDrawer}
                        type="button"
                        aria-label="Open menu"
                    >
                        <RightCircleOutlined className="text-[1.7rem]" />
                    </button>
                </div>
                <div className="ml-auto fx_item_center gap-4">
                    {/* <NotificationBellButton /> */}
                    <PrimaryDropdown
                        items={avatarItems}
                        triggerButton={
                            <div className="fx_item_center gap-[.35rem]">
                                <Avatar size={31} icon={<UserOutlined />} />
                                <div className="fx_col">
                                    <TextDynamic
                                        className={'txt_75_medium'}
                                        text={user?.usrFullName}
                                    />
                                    <TextDynamic
                                        className={'txt_625'}
                                        text={user?.usrEmail}
                                    />
                                </div>
                            </div>
                        }
                        overlayStyle={defaultDropdownOverlayStyle}
                    />
                </div>
            </div>
        </Header>
    );
}
