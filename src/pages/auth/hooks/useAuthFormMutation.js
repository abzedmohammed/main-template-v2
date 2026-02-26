import { useCallback } from 'react';
import { Form } from 'antd';
import { useDynamicMutation } from 'abzed-utils';

export default function useAuthFormMutation(action, options = {}) {
    const { mapValues } = options;
    const [form] = Form.useForm();

    const saveMutation = useDynamicMutation(action);

    const onFinish = useCallback(
        (values) => {
            const payload = mapValues ? mapValues(values, { form }) : values;

            if (payload === null || payload === undefined) {
                return;
            }

            saveMutation.mutate(payload);
        },
        [mapValues, saveMutation, form]
    );

    return {
        form,
        onFinish,
        isProcessing: saveMutation.isPending,
        saveMutation,
    };
}
