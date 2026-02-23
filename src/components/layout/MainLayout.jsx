import {
    BankOutlined,
    DesktopOutlined,
    LogoutOutlined,
    PieChartOutlined,
    RightCircleOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Breadcrumb, Grid, Layout, Menu, notification, theme } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logoutStateFn } from '../../features/auth/authSlice';
import { logoutUrl } from '../../utils';
import {
    TextDynamic,
    PrimaryDropdown,
    useAllCachedResults,
    usePaginatedQuery,
    useDynamicMutation,
    defaultDropdownOverlayStyle,
} from 'abzed-utils';
import { sideBarOpenFn } from '../../features/global/globalSlice';
import { SideDrawer } from '../navigation';
import { useTokenExpiryChecker } from '../../hooks/useTokenExpiryChecker';
import {
    adminFetchInAppNotification,
    updateInAppNotification,
} from '../../actions/adminActions';
const { Header, Content, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem('Dashboard', '/dashboard', <PieChartOutlined />),
    getItem('Events', '/events', <DesktopOutlined />),
    getItem('Casual Users', '/casual-users', <TeamOutlined />),
    getItem('Payments', '/payments', <BankOutlined />),
    getItem('Profile', '/profile', <SettingOutlined />),
];

export default function MainLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();
    const screens = Grid.useBreakpoint();
    const isSmallScreen = !screens.md;

    const tokenModal = useTokenExpiryChecker();

    const { refetch } = usePaginatedQuery({
        queryConfig: adminFetchInAppNotification,
        extraParams: {
            limit: null,
        },
    });

    const processedNotifications = useRef(new Set());

    const allNotificationsData = useAllCachedResults({
        baseKey: adminFetchInAppNotification.queryKey[0],
    });

    const updateMutation = useDynamicMutation({
        mutationFn: updateInAppNotification.mutationFn,
        invalidateQueryKeys: [adminFetchInAppNotification.queryKey],
    });

    const openNotification = useCallback(
        (notification) => {
            if (
                !notification?.notId ||
                processedNotifications.current.has(notification.notId)
            ) {
                return;
            }

            const { notId, notMessage } = notification;

            api.info({
                message: 'New Notification',
                description: notMessage,
                duration: 9,
                key: notId,
            });

            processedNotifications.current.add(notId);

            updateMutation.mutate({
                notId,
                notStatus: 'UNREAD',
            });
        },
        [api, updateMutation]
    );

    const location = useLocation();

    const { sideBarOpen } = useSelector((state) => state.global);
    const { user } = useSelector((state) => state.auth);
    const selectedMenuItem = items.find(
        (item) =>
            location.pathname === item.key || location.pathname.startsWith(`${item.key}/`)
    );
    const selectedMenuKeys = selectedMenuItem ? [selectedMenuItem.key] : [];

    const locationText =
        location.pathname
            .split('/')
            .slice(1)
            .join(' / ')
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Dashboard';

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuClick = ({ key }) => {
        if (key.startsWith('/')) {
            navigate(key);
        }
    };

    const handleSidebarDrawer = () => {
        dispatch(sideBarOpenFn());
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(logoutStateFn());
        window.location.assign(logoutUrl);
    };

    const avatarItems = [
        {
            label: (
                <Link to="/profile" className="fx_item_center gap-2.5">
                    <SettingOutlined />
                    <span className="avatar_dropdown_text">Profile</span>
                </Link>
            ),
            key: '1',
        },
        {
            label: (
                <button
                    type="button"
                    onClick={handleLogout}
                    className="fx_item_center gap-2.5 pointer w-full text-left"
                >
                    <LogoutOutlined />
                    <span className="avatar_dropdown_text">Log out</span>
                </button>
            ),
            key: '2',
        },
    ];

    useEffect(() => {
        if (!allNotificationsData?.length) return;

        const newNotifications = allNotificationsData.filter(
            (item) =>
                item.notStatus === 'NEW' &&
                !processedNotifications.current.has(item.notId)
        );

        newNotifications?.forEach((notification) => {
            openNotification(notification);
        });
    }, [allNotificationsData, openNotification]);

    useEffect(() => {
        refetch();
    }, [location.pathname, refetch]);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideDrawer
                handleSidebarDrawer={handleSidebarDrawer}
                open={sideBarOpen && isSmallScreen}
                items={items}
                selectedKeys={selectedMenuKeys}
            />
            {isSmallScreen ? null : (
                <Sider
                    className="w-50!"
                    collapsible
                    // onCollapse={(value) => setCollapsed(value)}
                >
                    <div className="main_logo" />
                    <Menu
                        theme="dark"
                        selectedKeys={selectedMenuKeys}
                        mode="inline"
                        items={items}
                        onClick={handleMenuClick}
                    />
                </Sider>
            )}

            <Layout>
                <MainLayoutHeader
                    user={user}
                    avatarItems={avatarItems}
                    colorBgContainer={colorBgContainer}
                    handleSidebarDrawer={handleSidebarDrawer}
                />
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb
                        style={{ margin: '16px 0' }}
                        items={[
                            { title: 'Home' },
                            {
                                title: locationText,
                            },
                        ]}
                    />
                    {tokenModal}
                    <div
                        style={{
                            padding: 24,
                            minHeight: 'calc(100vh - 150px)',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                        {contextHolder}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

const MainLayoutHeader = ({
    user,
    avatarItems,
    colorBgContainer,
    handleSidebarDrawer,
}) => (
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
            <div className="ml-auto">
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
