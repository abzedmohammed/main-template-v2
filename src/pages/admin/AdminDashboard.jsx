import { PageHeader } from "../../components/navigation";

export default function AdminDashboard() {
	return (
		<PageHeader
			header='Dashboard'
			body='Summary of events, payments, and more'
			btnFn={() => { }}
			btnText='Action'
		/>
	);
}
