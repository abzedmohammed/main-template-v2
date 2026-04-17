import { Form } from 'antd';
import { useCallback } from 'react';
import { useDynamicMutation } from 'abzed-utils';

export default function useFormMutation({
    action,
    options = {},
    beforeSubmit = () => true,
}) {
    const { mapValues, onSuccess: defaultOnSuccess, onError: defaultOnError } = options;
    const [form] = Form.useForm();
    const saveMutation = useDynamicMutation(action);

    const onFinish = useCallback(
        (values, mutationOptions = {}) => {
            const canSubmit = beforeSubmit(values, { form });

            if (canSubmit === false) {
                return;
            }

            const payload = mapValues ? mapValues(values, { form }) : values;

            if (payload === null || payload === undefined) {
                return;
            }

            const {
                onSuccess: customOnSuccess,
                onError: customOnError,
                ...restMutationOptions
            } = mutationOptions ?? {};
            const nextMutationOptions = { ...restMutationOptions };

            if (defaultOnSuccess || customOnSuccess) {
                nextMutationOptions.onSuccess = (data, variables, context) => {
                    const result = {
                        data,
                        variables,
                        context,
                        payload,
                        form,
                    };

                    defaultOnSuccess?.(result);
                    customOnSuccess?.(result);
                };
            }

            if (defaultOnError || customOnError) {
                nextMutationOptions.onError = (error, variables, context) => {
                    const result = {
                        error,
                        variables,
                        context,
                        payload,
                        form,
                    };

                    defaultOnError?.(result);
                    customOnError?.(result);
                };
            }

            saveMutation.mutate(payload, nextMutationOptions);
        },
        [beforeSubmit, defaultOnError, defaultOnSuccess, form, mapValues, saveMutation]
    );

    return {
        form,
        onFinish,
        isProcessing: saveMutation.isPending,
        saveMutation,
    };
}
