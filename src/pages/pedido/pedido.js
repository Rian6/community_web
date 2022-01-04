import React, { useEffect, useState, useRef } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';

import { getAllPedidos, removePedido } from '../../service/pedidoService';

export const Pedido = () => {

    const [pedidos, setPedidos] = useState(null);
    const [pedido, setPedido] = useState(null);

    const toast = useRef(null);

    <Toast ref={toast}></Toast>

    useEffect(() => {
        pesquisarPedidos()
    }, []);

    const pesquisarPedidos = async () => {
        setPedidos(await getAllPedidos())
    }

    const leftActions = () => {
        return (
            <React.Fragment>
                <Button
                    onClick={(e) => {
                        window.location.href = '/pedidoCadastro'
                    }}
                    label="Novo Pedido"
                    icon="pi pi-plus"
                    className="p-button-raised p-button-success">

                </Button>
            </React.Fragment>
        )
    }

    const acoes = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-mr-2" />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-mb-0" style={{ fontFamily: 'Sans-serif' }}   >Pedidos</h5>
        </div>
    );


    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card p-shadow-4 ">
                <h2 className="p-mb-2">Cadastro de Pedidos</h2>
                    <div className="p-col-12 " >
                        <Toolbar className="p-mb-4" left={leftActions} ></Toolbar>
                        <DataTable
                            dataKey="id"
                            paginator
                            header={header}
                            rows={10}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} produtos"
                            className="p-datatable-customers"
                            showGridlines
                            value={pedidos}
                            style={{ marginBottom: '20px' }}
                            paginator>
                            <Column style={{ width: '15%' }} field="id" header="Codigo" sortable></Column>
                            <Column style={{ width: '20%' }} field="vendedor.nome" header="Vendedor" sortable></Column>
                            <Column style={{ width: '20%' }} field="cliente.nome" header="Cliente" sortable></Column>
                            <Column body={acoes}></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>

    );
}