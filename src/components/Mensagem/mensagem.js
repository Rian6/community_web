import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

export default function Mensagem() {
    const toast = useRef();


    const exibirMensagemSucesso = (titulo, mensagem) => {
        toast.current.show({ severity: 'success', summary: titulo, detail: mensagem, life: 3000 });
    }

    const exibirMensagemInformacao = (titulo, mensagem) => {
        toast.current.show({ severity: 'info', summary: titulo, detail: mensagem, life: 3000 });
    }

    const exibirMensagemAlerta = (titulo, mensagem) => {
        toast.current.show({ severity: 'warn', summary: titulo, detail: mensagem, life: 3000 });
    }

    const exibirMensagemErro = (titulo, mensagem) => {
        toast.current.show({ severity: 'error', summary: titulo, detail: mensagem, life: 3000 });
    }

    return (
        <Toast ref={toast} />
    )
}
