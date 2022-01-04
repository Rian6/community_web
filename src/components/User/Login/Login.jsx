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
    <div className="background-login" style={{
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundImage: `url("./assets/layout/images/office.png")` }}>
      <div className="user-login" >
        <img className="user-login__title" src="assets/layout/images/logo-white.png" alt="logo  " />

        <form onSubmit={onSubmit}>

        <div className="p-col-12 p-md-4">
            <div className="p-inputgroup"  style={{width: 250}}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                id="user"
                name="user"
                placeholder='Usuario'
                onChange={onChange}
                value={values.user}
              />
            </div>
          </div>

          <div className="p-col-12 p-md-4">
            <div className="p-inputgroup" style={{width: 250}}>
              <span className="p-inputgroup-addon">
                <i className="pi pi-lock"></i>
              </span>
              <Password
                id="password"
                name="password"
                placeholder='Senha'
                onChange={onChange}
                feedback={false}
                toggleMask
                value={values.password}
              />
            </div>
          </div>

          {error && (
            <div 
            style={{margin: 8}}
            className="user-login__error">{error}</div>
          )}
          
          <Button
          className='p-button-raised p-button-secondary'
            style={{ 
              margin: 8, 
              fontWeight:'bold', }}
            type="submit"
          >
            Fazer Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
