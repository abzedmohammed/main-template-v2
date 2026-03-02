import { Card } from 'antd';

export default function StatCard({ title, value }) {
    return (
        <Card>
            <div className="fx_col gap-1">
                <span className="txt_875_medium text-[#6B7280]">{title}</span>
                <span className="txt_1_5_bold text-[#111827]">{value}</span>
            </div>
        </Card>
    );
}
