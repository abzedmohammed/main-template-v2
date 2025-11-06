import { TextDynamic } from 'abzed-utils';

export const eventInfoItems = () => [
	{
		key: '1',
		label: (
			<TextDynamic
				text={'Event Title:'}
				className={
					'txt_75_medium !text-[#545454] max-w-full w-[4.875rem]'
				}
			/>
		),
		children: (
			<TextDynamic
				text={'Soccer Match – Grade 1 & 2'}
				className={'txt_75'}
			/>
		),
	},
	{
		key: '2',
		label: (
			<TextDynamic
				text={'Date & Time:'}
				className={
					'txt_75_medium !text-[#545454] max-w-full w-[4.875rem]'
				}
			/>
		),
		children: (
			<TextDynamic
				text={'March 15, 2025 · 10:00 AM – 12:00 PM'}
				className={'txt_75'}
			/>
		),
	},
	{
		key: '3',
		label: (
			<TextDynamic
				text={'Location:'}
				className={
					'txt_75_medium !text-[#545454] max-w-full w-[4.875rem]'
				}
			/>
		),
		children: (
			<TextDynamic
				text={'Main Sports Field, Riara Primary Campus'}
				className={'txt_75'}
			/>
		),
	},
	{
		key: '4',
		label: (
			<TextDynamic
				text={'Group:'}
				className={
					'txt_75_medium !text-[#545454] max-w-full w-[4.875rem]'
				}
			/>
		),
		children: <TextDynamic text={'Grade 1 and 2'} className={'txt_75'} />,
	},
	{
		key: '5',
		label: (
			<TextDynamic
				text={'Description:'}
				className={
					'txt_75_medium !text-[#545454] max-w-full w-[4.875rem]'
				}
			/>
		),
		children: (
			<TextDynamic
				text={
					'A friendly soccer match aimed at encouraging teamwork and physical activity among the junior students. Parents are welcome to attend and cheer.'
				}
				className={'txt_75'}
			/>
		),
	},
];

export const paymentSuccessItems = () => [
	{
		key: '1',
		label: 'Reference No',
		children: 'OEJHDVDSFV6',
	},
	{
		key: '2',
		label: 'Amount Paid',
		children: 'KES 35,000',
	},
	{
		key: '4',
		label: 'Student',
		children: 'John Doe Kamau',
	},
	{
		key: '5',
		label: 'Transport',
		children: 'No',
	},
	{
		key: '6',
		label: 'Activity',
		children: 'Science Fair Competition',
	},
	{
		key: '7',
		label: 'Date',
		children: 'March 10, 2024',
	},
];
