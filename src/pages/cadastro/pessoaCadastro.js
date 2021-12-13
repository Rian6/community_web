import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { saveProduto } from '../../service/produtoService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { savePessoa } from '../../service/pessoaService';

export const PessoaCadastro = () => {

    const [nome, setNome] = useState("")
    const [dataNascimento, setDataNascimento] = useState("")

    const salvarPessoa = async () => {
        let pessoa = {}

        pessoa["nome"] = nome
        savePessoa(pessoa)
    }

    return (
        <div className="p-grid">
            <div className="p-col-12">
                <div className="card p-shadow-4">
                    <h5>Cadastro de Pessoa</h5>
                    <Fieldset legend="Dados Gerais">
                        <div className="p-grid p-col-8" style={{ margin: 10 }}>
                            <span className="p-float-label" style={{ marginRight: 10 }}>
                                <InputText
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)} />
                                <label htmlFor="nome">Nome</label>
                            </span>

                            <span className="p-float-label" style={{ marginRight: 10 }}>

                                <Calendar
                                    id="data"
                                    value={dataNascimento}
                                    onChange={(e) => setDataNascimento(e.value)}
                                    showIcon />
                                <label htmlFor="data">Data Nascimento</label>
                            </span>
                        </div>
                    </Fieldset>
                    <div className="p-grid" style={{ margin: 10 }}>
                        <Button
                            onClick={(e) => {
                                salvarPessoa()
                            }}
                            style={{ width: 120, border: 0, marginRight: 10 }}
                            className="p-button-raised p-button-success">
                            <span className="pi pi-save" style={{ marginRight: 10 }} />
                            Salvar
                        </Button>
                        <Button
                            onClick={(e) => {
                                window.location.href = '/pessoa'
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
