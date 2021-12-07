import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { salvarUsuario } from '../../service/autenticar';
import md5 from 'crypto-js/md5';

export const UsuarioCadastro = () => {

    const [cor, setCor] = useState('blue');
    const [frase, setFrase] = useState('');
    const [senha, setSenha] = useState('');
    const [login, setLogin] = useState('');
    const [nome, setNome] = useState('');

    const salvarNovoUsuario = async () => {

        const hashDigest = await md5(senha);

        let usuario = {
            login: login,
            nome: nome,
            senha: hashDigest.toString()
        }

        let isUsuarioExiste = await salvarUsuario(usuario)
        
        if (nome === "") {
            setFrase('O nome do usuario esta vazio')
            setCor('red')
            console.log("existe")
            return
        }
        if (login === '') {
            setFrase('O login esta vazio')
            setCor('red')
            return
        }
        if (senha === '') {
            setFrase('A senha esta vazia')
            setCor('red')
            return
        }
        if (isUsuarioExiste.usuarioExiste) {
            setFrase('Esse nome de login ja existe')
            setCor('red')
            return
        } else {
            setFrase('Usuario cadastrado com sucesso!')
            setCor('blue')
        }
    }

    return (
        <div className="card">
            <h5>Novo Usuario</h5>

            <h6 style={{ color: cor }}>{frase}</h6>
            <div className="p-formgroup-inline">
                <div className="p-field">
                    <label htmlFor="nome" className="p-sr-only">Nome</label>
                    <InputText
                        id="nome"
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)} />
                </div>
                <div className="p-field">
                    <label htmlFor="login" className="p-sr-only">Login</label>
                    <InputText
                        id="login"
                        type="text"
                        placeholder="Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)} />
                </div>
            </div>
            <div className="p-field">
                <Password
                    id="senha"
                    placeholder="Senha"
                    toggleMask
                    feedback={false}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)} />
            </div>
            <Button
                label="Cadastrar"
                onClick={(e) => {
                    salvarNovoUsuario()
                }}
            ></Button>
        </div>
    );
}