import {
    BankOutlined,
    DesktopOutlined,
    PieChartOutlined,
    RightCircleOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Layout, Menu, notification, theme } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logoutStateFn } from "../../features/auth/authSlice";
import { logoutUrl } from "../../utils";
import {
    TextDynamic,
    PrimaryDropdown,
    useAllCachedResults,
    usePaginatedQuery,
    useDynamicMutation,
    defaultDropdownOverlayStyle,
} from "abzed-utils";
import { avatarItemsFn } from "../../items_list/itemList";
import { sideBarOpenFn } from "../../features/global/globalSlice";
import { SideDrawer } from "../navigation";
import { useTokenExpiryChecker } from "../../hooks/useTokenExpiryChecker";
import {
    adminFetchInAppNotification,
    updateInAppNotification,
} from "../../actions/adminActions";
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
    getItem("Dashboard", "/dashboard", <PieChartOutlined />),
    getItem("Events", "/events", <DesktopOutlined />),
    getItem("Casual Users", "/casual-users", <TeamOutlined />),
    getItem("Payments", "/payments", <BankOutlined />),
    getItem("Profile", "/profile", <SettingOutlined />),
];

const content = <div className="loader" />;
const isSmallScreen = window.innerWidth < 768;

export default function MainLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [api, contextHolder] = notification.useNotification();

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
                message: "New Notification",
                description: notMessage,
                duration: 9,
                key: notId,
            });

            processedNotifications.current.add(notId);

            updateMutation.mutate({
                notId,
                notStatus: "UNREAD",
            });
        },
        [api, updateMutation]
    );

    const location = useLocation();

    const { sideBarOpen, initLoading } = useSelector((state) => state.global);
    const { user } = useSelector((state) => state.auth);

    const hasBadge = allNotificationsData?.some(
        (notification) => notification?.notStatus === "UNREAD"
    );

    const locationText =
        location.pathname
            .split("/")
            .slice(1)
            .join(" / ")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard";

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuClick = ({ key }) => {
        if (key.startsWith("/")) {
            navigate(key);
        }
    };

    const handleSibeDrawer = () => {
        dispatch(sideBarOpenFn());
    };

    const handleLogout = () => {
        dispatch(logoutStateFn());
        window.location.href = logoutUrl;
    };

    const avatarItems = avatarItemsFn(handleLogout);

    useEffect(() => {
        if (!allNotificationsData?.length) return;

        const newNotifications = allNotificationsData.filter(
            (item) =>
                item.notStatus === "NEW" &&
                !processedNotifications.current.has(item.notId)
        );

        newNotifications?.forEach((notification) => {
            openNotification(notification);
        });
    }, [allNotificationsData, openNotification]);

    useEffect(() => {}, [initLoading]);

    useEffect(() => {
        refetch();
    }, [location.pathname]);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <SideDrawer
                handleSibeDrawer={handleSibeDrawer}
                open={sideBarOpen && isSmallScreen}
                items={items}
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
                        defaultSelectedKeys={["1"]}
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
                    handleSibeDrawer={handleSibeDrawer}
                    navigate={navigate}
                    hasBadge={hasBadge}
                />
                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb
                        style={{ margin: "16px 0" }}
                        items={[
                            { title: "Home" },
                            {
                                title: locationText,
                            },
                        ]}
                    />
                    {tokenModal}
                    <div
                        style={{
                            padding: 24,
                            minHeight: "calc(100vh - 150px)",
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {initLoading ? (
                            <Spin tip="Loading">{content}</Spin>
                        ) : (
                            <Outlet />
                        )}
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
    handleSibeDrawer,
}) => (
    <Header
        style={{ padding: 0, background: colorBgContainer, display: "flex" }}
    >
        <div className="w-full fx_btwn_center px-6">
            <div className="flex md:hidden">
                <button onClick={handleSibeDrawer} type="button">
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
                                    className={"txt_75_medium"}
                                    text={user?.usrFullName}
                                />
                                <TextDynamic
                                    className={"txt_625"}
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
