import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { saveProduto } from '../../service/produtoService';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';

export const ProdutoCadastro = () => {
    const toast = useRef();
    const toastTL = useRef();

    const [nome, setNome] = useState("")
    const [codigoBarra, setCodigoBarra] = useState("")
    const [preco, setPreco] = useState(null)
    const [descricao, setDescricao] = useState("")
    const [status, setStatus] = useState("")
    const [imagemProduto, setImagemProduto] = useState("assets/layout/images/upload_image.png")
    const [modalImage, setModalImage] = useState(false);
    const [imagemConteudoCompletoProduto, setImagemConteudoCompletoProduto] = useState();

    const exibirMensagemSucesso = (titulo, mensagem) => {
        toast.current.show({ severity: 'success', summary: titulo, detail: mensagem, life: 3000 });
    }

    const criarNovoProduto = () => {
        toastTL.current.clear()
        setNome("")
        setCodigoBarra("")
        setPreco(null)
        setDescricao("")
        setStatus("")
    }
    const exibirMensagemConfirmacao = () => {
        toastTL.current.show({
            severity: 'warn', sticky: true, content: (
                <div className="p-flex p-flex-column " style={{ flex: '1' }}>
                    <div className="p-text-center">
                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
                        <h4>Deseja cadastrar um novo produto?</h4>
                        <p>Confirme para limpar os dados e criar um novo produto</p>
                    </div>
                    <div className="p-grid p-fluid">
                        <div className="p-col-6">
                            <Button
                                type="button"
                                label="Sim"
                                onClick={(e) => {
                                    criarNovoProduto()
                                }}
                                className="p-button-success" />
                        </div>
                        <div className="p-col-6">
                            <Button type="button" label="Não" onClick={() => window.location.href = '/produto'} className="p-button-secondary" />
                        </div>
                    </div>
                </div>
            )
        });
    }

    const subirImagem = (event) => {
        setImagemProduto(event.files[0].objectURL)
        setImagemConteudoCompletoProduto(event.files[0])
        setModalImage(false)
        console.log(event.files)
    }

    const salvarProduto = async () => {

        let produto = await formatarProduto()

        saveProduto(produto)
        console.log("produto salvo: " + JSON.stringify(produto))
        exibirMensagemSucesso("Produto Salvo", "Produto \"" + nome + "\" salvo com sucesso!")
    }

    async function formatarProduto() {
        let produto = {}

        produto["produtoImagem"] = {}
            
        if (imagemConteudoCompletoProduto) {
            await gerarImagemProduto().then(
                data => produto["produtoImagem"].arquivoBase64 = data
            )
            produto["produtoImagem"].nomeArquivo = imagemConteudoCompletoProduto.name
            produto["produtoImagem"].tamanho = imagemConteudoCompletoProduto.size
            produto["produtoImagem"].tipo = imagemConteudoCompletoProduto.type
        }

        produto["nome"] = nome
        produto["codigoBarra"] = codigoBarra
        produto["preco"] = preco
        produto["descricao"] = descricao

        return produto
    }

    function gerarImagemProduto() {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imagemConteudoCompletoProduto);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function _arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += await String.fromCharCode(bytes[i]);
        }
        let b64 = await window.btoa(binary);

        return b64
    }

    const statusType = [
        { status: 'ATIVO' },
        { status: 'INATIVO' },
    ];

    return (
        <div className="p-grid">
            <Dialog
                header="Imagem do Produto"
                visible={modalImage}
                style={{ width: '50vw' }}
                onHide={() => setModalImage(false)}>

                <FileUpload
                    name="demo[]"
                    auto
                    customUpload
                    uploadHandler={subirImagem}
                    url="https://primefaces.org/primereact/showcase/upload.php"
                    accept="image/*"
                    maxFileSize={1000000}
                    emptyTemplate={<p className="p-m-0">Solte uma imagem aqui.</p>} />
            </Dialog>

            <Toast ref={toast} />

            <Toast ref={toastTL} position="bottom-center" />
            <div className="p-col-12">
                <div className="card p-shadow-4">
                    <h5>Cadastro de Produto</h5>
                    <Fieldset legend="Dados Gerais">
                        <div className="p-grid p-col-8 p-shadow-4"
                            style={{
                                backgroundColor: '#e8e5c2',
                                borderColor: 'white',
                                borderRadius: 10,
                                padding: 0,
                                width: 110,
                                margin: 10
                            }}>
                            <Button
                                style={{
                                    padding: 0,
                                    backgroundColor: '#e8e5c2', borderColor: 'white', borderRadius: 10
                                }}
                                onClick={(e) => {
                                    setModalImage(true)
                                }}>
                                <img
                                    width='110'
                                    src={imagemProduto} />
                            </Button>
                        </div>
                        <div className="p-grid p-col-8" style={{ margin: 10, marginTop:30 }}>
                            <span className="p-float-label" style={{ marginRight: 10, marginBottom: 20 }}>
                                <InputText
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)} />
                                <label htmlFor="nome">Nome</label>
                            </span>

                            <span className="p-float-label" style={{ marginRight: 10, marginBottom: 20 }}>
                                <InputText
                                    id="codBar"
                                    value={codigoBarra}
                                    onChange={(e) => setCodigoBarra(e.target.value)} />
                                <label
                                    htmlFor="codBar">Codigo de barra</label>
                            </span>

                            <span className="p-float-label" style={{ marginRight: 10, marginBottom: 20 }}>
                                <InputText
                                    id="desc"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)} />
                                <label
                                    htmlFor="desc">Descrição</label>
                            </span>
                            <span className="p-float-label" style={{ marginRight: 10, marginBottom: 20 }}>
                                <Dropdown
                                    style={{ minWidth: 160 }}
                                    value={status}
                                    options={statusType}
                                    onChange={(e) => setStatus(e.target.value)}
                                    optionLabel="status"
                                    placeholder="Selecione um status" />
                            </span>
                            <span >
                                <InputNumber
                                    inputId="preco"
                                    value={preco}
                                    placeholder="Preço"
                                    onValueChange={(e) => setPreco(e.value)}
                                    mode="decimal"
                                    minFractionDigits={2} />
                            </span>
                        </div>
                    </Fieldset>
                    <div className="p-grid" style={{ margin: 10 }}>
                        <Button
                            onClick={(e) => {
                                salvarProduto()
                            }}
                            style={{ width: 120, border: 0, marginRight: 10 }}
                            className="p-button-raised p-button-success">
                            <span className="pi pi-save" style={{ marginRight: 10 }} />
                            Salvar
                        </Button>
                        <Button
                            onClick={(e) => {
                                window.location.href = '/produto'
                            }}
                            style={{ width: 120, border: 0 }}
                            className="p-button-raised p-button-danger">
                            <span className="pi pi-arrow-left" style={{ marginRight: 10 }} />
                            Sair
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
