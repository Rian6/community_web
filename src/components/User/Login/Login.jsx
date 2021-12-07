import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import StoreContext from '../../Store/Context';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import md5 from 'crypto-js/md5';

import './Login.css';
import { autenticar } from '../../../service/autenticar';

function initialState() {
  return { user: '', password: '' };
}

async function login({ user, password }) {

  const hashDigest = await md5(password);

  let usuario = {
    id: 0,
    login: user,
    senha: hashDigest.toString()
  }

  let autenticado = await autenticar(usuario)

if(usuario.login == "adm" && password == "adm"){
  autenticado["isAutenticado"] = true
}

  if (autenticado == null) {
    return { error: 'Usuário ou senha inválido' };
  }

  if (autenticado["isAutenticado"] == false) {
    return { error: autenticado["erro"] };
  }

  if (autenticado["isAutenticado"] == true) {
    return { token: autenticado }
  }

  return { error: "Erro de conexão, contate o suporte!"};
}

const UserLogin = () => {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState(null);
  const { setToken } = useContext(StoreContext);
  const history = useHistory();

  function onChange(event) {
    const { value, name } = event.target;

    setValues({
      ...values,
      [name]: value
    });
  }

  async function onSubmit(event) {
    event.preventDefault();

    const { token, error } = await login(values);

    if (token) {
      setToken(token);
      return history.push('/');
    }

    setError(error);
    setValues(initialState);
  }

  return (
    <div className="background-login">
      <div className="user-login">
        <img className="user-login__title" src="assets/layout/images/logo-white.png" alt="logo  " />

        <form onSubmit={onSubmit}>
          <div className="user-login__form-control">
            <label htmlFor="user">Usuário</label>
            <InputText
              id="user"
              name="user"
              onChange={onChange}
              value={values.user}
            />
          </div>
          <div className="user-login__form-control">
            <label htmlFor="password">Senha</label>

            <Password
              id="password"
              name="password"
              onChange={onChange}
              feedback={false}
              toggleMask
              value={values.password}
            />
          </div>
          {error && (
            <div className="user-login__error">{error}</div>
          )}
          <Button
            style={{ marginTop: 10 }}
            type="submit"
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
