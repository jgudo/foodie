import { HIDE_MODAL, SHOW_MODAL } from "~/constants/actionType";
import { EModalType } from "~/types/types";

export const showModal = (modalType: EModalType) => (<const>{
    type: SHOW_MODAL,
    payload: modalType
});

export const hideModal = (modalType: EModalType) => (<const>{
    type: HIDE_MODAL,
    payload: modalType
});


export type modalActionType =
    | ReturnType<typeof showModal>
    | ReturnType<typeof hideModal>