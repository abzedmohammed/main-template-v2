import { Card } from 'antd';
import { TextDynamic } from 'abzed-utils';

export default function StatCard({ title, value }) {
    return (
        <Card>
            <div className="fx_col gap-1">
                <TextDynamic text={title} color="#6B7280" className="txt_875_medium" />
                <TextDynamic text={value} color="#111827" className="txt_1_5_bold" />
            </div>
        </Card>
    );
}
