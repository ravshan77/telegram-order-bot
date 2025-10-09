import { useCallback } from 'react'
import { TypeAttributes } from '@/shared/ui/kit/@types/common'
import { Notification, toast, ToastProps } from '@/shared/ui/kit'

type NotificationProps = {
    type: TypeAttributes.Status;
    placement: ToastProps["placement"];
    message?: string;
    title: string;
    duration?: number;
    closable: boolean;
}

export const useNotification = () => {
    return useCallback(
        ({closable, placement, type, message, title, duration = 2000}: NotificationProps) => {
            toast.push(
                <Notification closable={closable} type={type} title={title} duration={duration}>
                {message}
                </Notification>,
                {placement: placement}
            );
        },
        []
    );
};
