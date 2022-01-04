import React, { useState, useRef, useContext } from 'react';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { AutoComplete } from 'primereact/autocomplete';
import { buscarPorCodigo, filtrarProdutoPorNome } from '../../service/produtoService';
import { filtrarPessoaPorNome } from '../../service/pessoaService';
import { salvarPedido, gerarRelatorioPedido } from '../../service/pedidoService';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Link } from 'react-router-dom';
import { Divider } from 'primereact/divider';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import StoreContext from '../../components/Store/Context';

export const FrenteCaixa = () => {
    const toast = useRef();
    const toastTL = useRef();

    const [displayBasic, setDisplayBasic] = useState(false);
    const [produtosSelecionados, setProdutosSelecionados] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState();
    const [produto, setProduto] = useState(null);
    const [codigo, setCodigo] = useState("");
    const [productError, setProductError] = useState(false);

    const [pessoasFiltradas, setPessoasFiltradas] = useState([]);
    const [pessoa, setPessoa] = useState();
    const [totalProdutos, setTotalProdutos] = useState(0);
    const [qtd, setQtd] = useState(0);

    const { setToken, token } = useContext(StoreContext);

    const savePedido = async () => {

        let pedido = {}
        pedido["cliente"] = pessoa

        await salvarPedido(pedido, produtosSelecionados)
        window.location.href = '/pedido'
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button
                    className="p-button-raised p-button-danger"
                    label="Cancelar"
                    icon="pi pi-times"
                    onClick={() => onHide(name)} />
                <Button
                    className="p-button-raised p-button-success"
                    label="Adicionar" icon="pi pi-plus" onClick={() => adicionarProduto(name)} autoFocus />
            </div>
        );
    }

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }

    const buscarProdutoPorCodigo = async () => {
        let prod = await buscarPorCodigo(codigo)

        console.log(prod)

        if (prod !== null) {
            setProduto(prod)
            produtosSelecionados.push(prod)

            let prodSelect = produtosSelecionados

            setProdutosSelecionados(prodSelect)

            calcularTotalProdutos()
            setProductError(false)
        }else{
            setProductError(true)
        }

        setProduto(null)
    }

    const adicionarProduto = async (name) => {

        onHide(name)

        if (produto != null) {
            setProduto(produto)
            produtosSelecionados.push(produto)

            let prodSelect = produtosSelecionados

            setProdutosSelecionados(prodSelect)

            calcularTotalProdutos()
        }

        setProduto(null)
        setProductError(false)
    }

    const salvarPdf = (response) => {

        var blob = new Blob([response], {
            type: 'application/pdf'
        });

        var url = window.URL.createObjectURL(blob)
        window.open(url);

    }

    const itemTemplate = (item) => {
        return (
            <div >
                <div>{item.nome}</div>
            </div>
        );
    }

    const buscarProdutosFiltrados = async () => {
        let produtosTemp = await filtrarProdutoPorNome(produto)

        console.log(produtosTemp)
        setProdutosFiltrados(produtosTemp)
    }

    const calcularTotalProdutos = async () => {
        produtosSelecionados.map(produto => {
            let valor = produto ? produto.preco : 0
            setQtd(qtd + 1)
            setTotalProdutos(totalProdutos + valor)
        })
    }

    const buscarPessoasFiltradas = async () => {
        let pessoasTemp = await filtrarPessoaPorNome(pessoa)

        setPessoasFiltradas(pessoasTemp)
    }


    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);
    }

    const statusType = [
        { status: 'ATIVO' },
        { status: 'INATIVO' },
    ];

    const imageBodyTemplate = (rowData) => {
        return <img
            height={50}
            width={50}
            src={rowData ? rowData.produtoImagem.arquivoBase64 : null} />;
    }


    const footerTemplate =
        <ColumnGroup>
            <Row>
                <Column footer={"Total: " + totalProdutos} colSpan={4}
                    footerStyle={{ textAlign: 'right' }} />
            </Row>
        </ColumnGroup>;


    return (
        <div className="p-d-flex p-jc-center ">
            <Toast ref={toast} />
            <Dialog
                header="Novo Produto"
                visible={displayBasic}
                style={{ width: '50vw' }}
                footer={renderFooter('displayBasic')}
                onHide={() => onHide('displayBasic')}>
                <div style={{ height: '150px' }}>
                    <span className="p-float-label">
                        <AutoComplete
                            id="nome_prod"
                            value={produto}
                            suggestions={produtosFiltrados}
                            completeMethod={buscarProdutosFiltrados}
                            onChange={(e) => setProduto(e.value)}
                            field="nome"
                            itemTemplate={itemTemplate} />

                        <label htmlFor="nome_prod">Produto</label>
                    </span>
                </div>
            </Dialog>
            <Toast ref={toastTL} position="bottom-center" />
            <div className="card p-shadow-4 " style={{ marginRight: 10, width: 800 }}>
                <h2>Frente de Caixa</h2>
                <div className="p-grid" style={{ margin: 10 }}>
                    <Button
                        className="p-button-raised p-button-info"
                        onClick={() => onClick('displayBasic')}
                        style={{ width: 120, border: 0, marginRight: 10 }}>
                        <span className="pi pi-plus" style={{ marginRight: 10 }} />
                        Produto
                    </Button>
                </div>
                <div className="card">
                    <ScrollPanel style={{ width: '100%', height: '600px' }}>

                        <DataTable
                            footerColumnGroup={footerTemplate}
                            scrollable
                            emptyMessage="Nenhum produto foi selecionado"
                            value={produtosSelecionados} responsiveLayout="scroll">
                            <Column body={imageBodyTemplate}></Column>
                            <Column field="codigoBarra" header="Codigo"></Column>
                            <Column field="nome" header="Nome"></Column>
                            <Column field="preco" header="Preço"></Column>
                        </DataTable>
                    </ScrollPanel>
                </div>
                <div className="p-d-flex p-flex-wrap">

                    <div className="p-field">
                        <div className="p-inputgroup"
                            style={{ width: 500 }}>
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-search"></i>
                            </span>
                            <InputText
                                className={productError ? 'p-invalid p-d-block': ''}
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                placeholder='Codigo do produto' />
                        </div>
                        {productError ?
                            <small id="username2-help" className="p-error p-d-block">Produto não encontrado.</small>
                            : null
                        }
                    </div>

                    <div>
                        <Button
                            className="p-button-raised p-button-secondary"
                            onClick={(e) => {
                                buscarProdutoPorCodigo()
                            }}
                            style={{ width: 120, border: 0, marginLeft: 10 }}>
                            <span className="pi pi-plus" style={{ marginRight: 10 }} />
                            Adicionar
                        </Button>
                    </div>
                </div>
                <div className="p-d-flex p-jc-left" style={{ marginTop: 30 }}>
                    <Button
                        className="p-button-raised p-button-success"
                        onClick={(e) => {
                            savePedido()
                        }}
                        style={{ width: 120, border: 0, marginRight: 10 }}>
                        <span className="pi pi-save" style={{ marginRight: 10 }} />
                        Finalizar
                    </Button>
                </div>
            </div>

            <div className="card p-shadow-4" style={{ marginLeft: 10, width: 480 }}>
                <div className="card">
                    <h4>Detalhes</h4>
                    <h6 style={{ marginTop: 30 }}>Dados gerais</h6>
                    <Divider align="center" />
                    <div className="p-d-flex p-flex-wrap">
                        <span className="p-float-label" style={{ marginTop: 30, marginRight: 10 }}>
                            <InputText value={'Consumidor Final'} disabled />
                            <label>Cliente</label>
                        </span>
                        <span className="p-float-label" style={{ marginTop: 30, marginRight: 10 }}>
                            <InputText value={token.nome} disabled />
                            <label>Vendedor</label>
                        </span>
                    </div>

                    <h6 style={{ marginTop: 30 }}>Produtos</h6>
                    <Divider align="center" />
                    <div className="p-d-flex p-flex-wrap">
                        <span className="p-float-label" style={{ marginTop: 30, marginRight: 10 }}>
                            <InputText value={qtd} disabled />
                            <label>Quantidade</label>
                        </span>
                        <span className="p-float-label" style={{ marginTop: 30, marginRight: 10 }}>
                            <InputText value={totalProdutos} disabled />
                            <label>Total</label>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
