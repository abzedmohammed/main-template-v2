import { LogoutOutlined, PieChartOutlined } from '@ant-design/icons';
import { Breadcrumb, Grid, Layout, Menu, theme } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { sideBarOpenFn } from '../../features/global/globalSlice';
import { SideDrawer } from '../navigation';
import { useTokenExpiryChecker } from '../../hooks/useTokenExpiryChecker';
import MainLayoutHeader from './MainLayoutHeader';

const { Content, Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [getItem('Dashboard', '/dashboard', <PieChartOutlined />)];

export default function MainLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { sideBarOpen } = useSelector((state) => state.global);
    const { user } = useSelector((state) => state.auth);

    const tokenModal = useTokenExpiryChecker();
    const location = useLocation();

    const screens = Grid.useBreakpoint();
    const isSmallScreen = !screens.md;

    const selectedMenuItem = items.find(
        (item) =>
            location.pathname === item.key || location.pathname.startsWith(`${item.key}/`)
    );
    const selectedMenuKeys = selectedMenuItem ? [selectedMenuItem.key] : [];

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
        authService.logout({ dispatch });
    };

    const avatarItems = [
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
            key: '1',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideDrawer
                handleSidebarDrawer={handleSidebarDrawer}
                open={sideBarOpen && isSmallScreen}
                items={items}
                selectedKeys={selectedMenuKeys}
            />
            {isSmallScreen ? null : (
                <Sider className="w-50!" collapsible>
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
                    <Breadcrumb style={{ margin: '16px 0' }} items={[]} />
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
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
