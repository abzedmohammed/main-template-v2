export const statuses = [
    {
		status: 'ACTIVE',
		statusName: 'Active',
		background: '#D8CCF4',
		color: '#6226EF',
		dotColor: '#A46BF5',
	},
	{
		status: 'PENDING',
		statusName: 'Pending',
		background: '#D8CCF4',
		color: '#6226EF',
		dotColor: '#A46BF5',
	},
	{
		status: 'SUBMITTED',
		statusName: 'Submited',
		background: '#D8CCF4',
		color: '#6226EF',
		dotColor: '#A46BF5',
	},
	{
		status: 'COMPLETED',
		statusName: 'Completed',
		background: '#ECFDF3',
		color: '#027A48',
		dotColor: '#12B76A',
	},
	{
		status: 'REJECTED',
		statusName: 'Rejected',
		background: '#F4CFCC',
		color: '#EF3826',
		dotColor: '#E63625',
	}, 
];

export const statusData = [
	{ label: 'Active', value: 'ACTIVE' },
	{ label: <span className='text-[#F00]'>Suspend</span>, value: 'INACTIVE' },
];

export const viewAsData = [
	{ label: 'Event', value: 'EVENT' },
	{ label: 'Casual', value: 'CASUAL' },
];
