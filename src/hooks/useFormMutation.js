import { Form } from 'antd';
import { useCallback, useEffect, useRef } from 'react';
import { useDynamicMutation } from 'abzed-utils';
import { getEnvelopeMessage } from '../actions/shared';
import {
    errorToast as notifyError,
    infoToast as notifyInfo,
    successToast as notifySuccess,
} from '../utils';

const isAction = (value) => Boolean(value?.mutationFn);

export default function useFormMutation(actionOrConfig, shorthandOptions = {}) {
    const {
        action,
        options = {},
        beforeSubmit = () => true,
    } = isAction(actionOrConfig)
        ? { action: actionOrConfig, options: shorthandOptions }
        : (actionOrConfig ?? {});

    const [form] = Form.useForm();

    // Latest action/options/form, read at call time so the mutation config stays stable.
    const latest = useRef({ action, options, form });

    const saveMutation = useDynamicMutation({
        ...action,
        onSuccess: (context) => {
            const { action: act, options: opts, form: currentForm } = latest.current;
            const result = { ...context, payload: context.variables, form: currentForm };

            if (act?.successToast) {
                act.successToast(result);
            } else {
                notifySuccess(getEnvelopeMessage(context.response));
            }

            opts.successToast?.(result);
        },
        onError: (message, context = {}) => {
            const { action: act, options: opts, form: currentForm } = latest.current;
            const result = { ...context, payload: context.variables, form: currentForm };
            const envelope = context.response ?? context.error?.response?.data;
            const isInfo = (opts.infoWhen ?? act?.infoWhen)?.(envelope) === true;

            if (isInfo) {
                (act?.infoToast ?? notifyInfo)(message, result);
                opts.infoToast?.(message, result);
                return;
            }

            (act?.errorToast ?? notifyError)(message, result);
            opts.errorToast?.(message, result);
        },
    });
    const { mutate } = saveMutation;

    const onFinish = useCallback(
        (values) => {
            const { options: opts } = latest.current;

            if (beforeSubmit(values, { form }) === false) {
                return;
            }

            const payload = opts.mapValues ? opts.mapValues(values, { form }) : values;

            if (payload === null || payload === undefined) {
                return;
            }

            mutate(payload);
        },
        [beforeSubmit, form, mutate]
    );

    useEffect(() => {
        latest.current = { action, options, form };
    });

    return {
        form,
        onFinish,
        isProcessing: saveMutation.isPending,
        saveMutation,
    };
}
