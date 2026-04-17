import useFormMutation from '../../useFormMutation';

export default function useAuthFormMutation(actionOrConfig, options = {}) {
    const isDirectAction =
        typeof actionOrConfig === 'function' || Boolean(actionOrConfig?.mutationFn);

    const config = isDirectAction
        ? {
              action: actionOrConfig,
              options,
          }
        : (actionOrConfig ?? {});

    return useFormMutation(config);
}
