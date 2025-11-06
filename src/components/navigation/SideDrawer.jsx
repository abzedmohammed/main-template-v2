import { LeftCircleOutlined } from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useNavigate } from 'react-router-dom';

export default function SideDrawer({ open, handleSibeDrawer, items }) {
	const navigate = useNavigate();

	const handleClick = ({ key }) => {
		navigate(key);
		handleSibeDrawer();
	};

	return (
		<Drawer
			className='primary_drawer'
			placement='left'
			size={'default'}
			onClose={handleSibeDrawer}
			open={open}>
			<div className='side_bar_open !w-full h-full'>
				<div className='w-full h-full'>
					<Sider className='!w-full !max-w-full !h-full'>
						<div className='w-full fx justify-end p-[.9rem] border-b border-[#E5E7EB]'>
							<button onClick={handleSibeDrawer} type='button'>
								<LeftCircleOutlined className='text-[1.7rem] !text-white' />
							</button>
						</div>
						<div className='demo-logo-vertical' />
						<Menu
							theme='dark'
							defaultSelectedKeys={['1']}
							mode='inline'
							items={items}
							onClick={handleClick}
						/>
					</Sider>
				</div>
			</div>
		</Drawer>
	);
}
