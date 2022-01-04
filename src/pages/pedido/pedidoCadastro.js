import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { AutoComplete } from 'primereact/autocomplete';
import { filtrarProdutoPorNome } from '../../service/produtoService';
import { filtrarPessoaPorNome } from '../../service/pessoaService';
import { salvarPedido, gerarRelatorioPedido } from '../../service/pedidoService';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Link } from 'react-router-dom';
import { Divider } from 'primereact/divider';

export const PedidoCadastro = () => {
    const toast = useRef();
    const toastTL = useRef();

    const [displayBasic, setDisplayBasic] = useState(false);
    const [produtosSelecionados, setProdutosSelecionados] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState();
    const [produto, setProduto] = useState();

    const [pessoasFiltradas, setPessoasFiltradas] = useState([]);
    const [pessoa, setPessoa] = useState();
    const [relatorio, setRelatorio] = useState("");

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

    const adicionarProduto = async (name) => {

        onHide(name)
        console.log("produto >>>>" + produto)

        setProduto(produto)
        produtosSelecionados.push(produto)

        let prodSelect = produtosSelecionados

        setProdutosSelecionados(prodSelect)

        console.log("produto selecionado >>>:" + JSON.stringify(produtosSelecionados))

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

    const gerarRelatorio = async () => {
        let pedido = {}

        let relatorio = await gerarRelatorioPedido(pedido, produtosSelecionados)

        let pdfWindow = window.open("")
        pdfWindow.document.write("<iframe width='100%' height='100%' src='" + encodeURI(relatorio.bloob) + "'></iframe>")
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
        return <img src={`showcase/demo/images/product/${rowData.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
    }

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
            <div className="card p-shadow-4 " style={{ marginRight: 10, width: 700 }}>
                <h2>Pedido</h2>
                <div className="p-grid" style={{ margin: 10 }}>
                    <Button
                        className="p-button-raised p-button-info"
                        onClick={() => onClick('displayBasic')}
                        style={{ width: 120, border: 0, marginRight: 10 }}>
                        <span className="pi pi-plus" style={{ marginRight: 10 }} />
                        Produto
                    </Button>
                </div>

                <Fieldset
                    legend="Informações do pedido"
                    toggleable
                    style={{
                        margin: 15
                    }}>
                    <div className="p-d-flex p-flex-wrap">
                        <span style={{ marginTop: 20 }} className="p-float-label p-mr-2 p-mb-2">

                            <AutoComplete
                                id={"nome_pess"}
                                value={pessoa}
                                suggestions={pessoasFiltradas}
                                completeMethod={buscarPessoasFiltradas}
                                onChange={(e) => setPessoa(e.value)}
                                field="nome"
                                itemTemplate={itemTemplate} />
                            <label htmlFor="nome_pess">Pessoa</label>
                        </span>
                        <span style={{ marginTop: 20 }} className="p-float-label p-mr-2 p-mb-2">
                            <AutoComplete
                                id={"nome_fantasia"}
                                disabled
                                value={pessoa}
                                field="nomeFantasia" />
                            <label htmlFor="nome_fantasia">Nome Fantasia</label>
                        </span>
                        <span style={{ marginTop: 20 }} className="p-float-label p-mr-2 p-mb-2">
                            <AutoComplete
                                id={"email"}
                                disabled
                                value={pessoa}
                                field="email" />
                            <label htmlFor="email">EMAIL</label>
                        </span>
                        <span style={{ marginTop: 20 }} className="p-float-label p-mr-2 p-mb-2">
                            <AutoComplete
                                id={"cpf_cnpj"}
                                disabled
                                value={pessoa}
                                field="cpfCnpj" />
                            <label htmlFor="cpf_cnpj">CPF / CNPJ</label>
                        </span>
                    </div>
                </Fieldset>
                <Fieldset
                    toggleable
                    legend="Informações de Pagamento" style={{ margin: 15 }}>
                    <div className="p-d-flex">
                        <Dropdown
                            style={{ margin: 5 }}
                            placeholder="Forma de Pagamento" />

                        <span className="p-float-label"
                            style={{ margin: 5 }}>
                            <InputText ></InputText>
                            <label>Descrição</label>
                        </span>
                    </div>
                </Fieldset>
                <div className="p-d-flex p-jc-center" style={{ margin: 10 }}>
                    <Button
                        className="p-button-raised p-button-success"
                        onClick={(e) => {
                            savePedido()
                        }}
                        style={{ width: 120, border: 0, marginRight: 10 }}>
                        <span className="pi pi-save" style={{ marginRight: 10 }} />
                        Salvar
                    </Button>
                    <Button
                        className="p-button-raised p-button-warning"
                        onClick={(e) => {
                            gerarRelatorio()
                        }}
                        style={{ color: 'white', width: 120, border: 0, marginRight: 10 }}>
                        <span className="pi pi-file-pdf" style={{ marginRight: 10 }} />
                        Relatório
                    </Button>
                    <Button
                        className="p-button-raised p-button-danger"
                        onClick={(e) => {
                            window.location.href = '/pedido'
                        }}
                        style={{ width: 120, border: 0, marginRight: 10 }}>
                        <span className="pi pi-arrow-left" style={{ marginRight: 10 }} />
                        Sair
                    </Button>
                </div>
            </div>

            <div className="card p-shadow-4" style={{ marginLeft: 10, width: 400 }}>
                <div className="card">
                    <h5>Produtos</h5>
                    <Divider align="center" />
                    <ScrollPanel
                        style={{ width: '100%', height: '450px', flexDirection: 'row' }}>
                        {produtosSelecionados.map((produto) => {
                            return (
                                <div>
                                    <div className="p-d-flex">
                                        <div>
                                            <img
                                                width='50'
                                                src={!produto.produtoImagem || !produto.produtoImagem.arquivoBase64 ? "assets/layout/images/produto.png" : produto.produtoImagem.arquivoBase64} />
                                        </div>
                                        <div style={{ marginLeft: '10px' }}>
                                            <h6 style={{ fontWeight: 'bold' }}>{produto.nome}</h6>
                                            <h6>{"Codigo: " + produto.codigoBarra}</h6>
                                            <h6 style={{ fontWeight: 'bold' }}>{"R$" + produto.preco}</h6>
                                        </div>
                                    </div>
                                    <Divider align="center" />
                                </div>
                            )
                        })}
                    </ScrollPanel>
                </div>
            </div>
        </div>
    );
}
