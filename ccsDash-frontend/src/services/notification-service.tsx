import { VariantType } from 'notistack'
import { Subject } from 'rxjs';

const subject = new Subject <{type: VariantType, message: string}>();

export const notificationService = {
    sendNotification: (type: VariantType, message: string) => subject.next({type, message}),
    getNotification: () => subject.asObservable(),
    clearNotification: () => subject.next({type: 'default', message: ''})
}