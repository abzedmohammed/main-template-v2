import { LeftCircleOutlined } from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useNavigate } from 'react-router-dom';

export default function SideDrawer({
    open,
    handleSidebarDrawer,
    items,
    selectedKeys = [],
}) {
    const navigate = useNavigate();

    const handleClick = ({ key }) => {
        navigate(key);
        handleSidebarDrawer();
    };

    return (
        <Drawer
            className="primary_drawer"
            placement="left"
            size={'default'}
            onClose={handleSidebarDrawer}
            open={open}
        >
            <div className="side_bar_open !w-full h-full">
                <div className="w-full h-full">
                    <Sider className="!w-full !max-w-full !h-full">
                        <div className="w-full fx justify-end p-[.9rem] border-b border-[#E5E7EB]">
                            <button onClick={handleSidebarDrawer} type="button">
                                <LeftCircleOutlined className="text-[1.7rem] !text-white" />
                            </button>
                        </div>
                        <div className="demo-logo-vertical" />
                        <Menu
                            theme="dark"
                            selectedKeys={selectedKeys}
                            mode="inline"
                            items={items}
                            onClick={handleClick}
                        />
                    </Sider>
                </div>
            </div>
        </Drawer>
    );
}
