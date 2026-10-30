import { TextDynamic } from 'abzed-utils';
import { CheckCircleSvg } from '../../../svgs';

// Mirrors the abzed-utils `validatePassword` policy so users see each requirement.
const RULES = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'At least one number', test: (p) => /\d/.test(p) },
    {
        label: 'One special character',
        test: (p) => /[!@#$%^&*()_+\-=[\]{};':",./<>?`~]/.test(p),
    },
];

export default function PasswordChecklist({ password = '' }) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {RULES.map((rule) => {
                const met = rule.test(password);
                return (
                    <div
                        key={rule.label}
                        className={`fx_item_center gap-1.5 ${
                            met ? 'text-success-emerald' : 'text-text-muted'
                        }`}
                    >
                        {/* Icon and label both inherit the row's colour. */}
                        <CheckCircleSvg />
                        <TextDynamic text={rule.label} className="txt_75_medium" />
                    </div>
                );
            })}
        </div>
    );
}
