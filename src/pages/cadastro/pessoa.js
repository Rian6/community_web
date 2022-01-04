import React, { useEffect, useState, useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';

import { getAllProdutos, removeProduto } from '../../service/produtoService';
import { getAllPessoas } from '../../service/pessoaService';

export const Pessoa = () => {

    const [pessoas, setPessoas] = useState(null);
    const [produto, setProduto] = useState(null);

    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const toast = useRef(null);

    <Toast ref={toast}></Toast>

    useEffect(() => {
        pesquisarProdutos()
    }, []);

    const pesquisarProdutos = async () => {
        setPessoas(await getAllPessoas())
    }

    const deletarProduto = async () => {
        hideDeleteProductDialog()
        await removeProduto(produto)
        await pesquisarProdutos()
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const confirmDeleteProduct = (produto) => {
        setProduto(produto);
        setDeleteProductDialog(true);
    }

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deletarProduto} />
        </React.Fragment>
    );

    const leftActions = () => {
        return (
            <React.Fragment>
                <Button
                    onClick={(e) => {
                        window.location.href = '/pessoaCadastro'
                    }}
                    label="Nova Pessoa"
                    icon="pi pi-plus"
                    className="p-button-raised p-button-success">

                </Button>
            </React.Fragment>
        )
    }

    const status = (rowData) => {
        return <span className={`customer-badge status-${rowData.status}`}>{rowData.status}</span>;
    }

    const acoes = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-mr-2" />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-warning"
                    onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0" style={{ fontFamily: 'Sans-serif' }}>Pessoas</h5>
        </div>
    );


    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card p-shadow-4">
                <h2>Cadastro de Pessoa</h2>
                    <div className="p-col-12 " >

                        <Toolbar className="p-mb-4" left={leftActions} ></Toolbar>
                        <DataTable
                            dataKey="id"
                            paginator
                            rows={10}
                            header={header}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} pessoas"
                            className="p-datatable-customers"
                            showGridlines
                            value={pessoas}
                            style={{ marginBottom: '20px' }}
                            paginator>
                            <Column style={{ width: '20%' }} field="id" header="Numero" sortable></Column>
                            <Column style={{ width: '25%' }} field="nome" header="Nome" sortable></Column>
                            <Column body={acoes}></Column>
                        </DataTable>

                    </div>
                </div>
            </div>
            <Dialog
                visible={deleteProductDialog}
                style={{ width: '450px' }}
                header="Confirmar"
                modal
                footer={deleteProductDialogFooter}
                onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    {produto && <span>Deseja realmente deletar o produto: <b>{produto.nome}</b>?</span>}
                </div>
            </Dialog>
        </div>

    );
}