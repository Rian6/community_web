import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import StoreContext from './components/Store/Context';

export const AppProfile = () => {

    const [expanded, setExpanded] = useState(false);
    const { setToken, token } = useContext(StoreContext);

    const onClick = (event) => {
        setExpanded(prevState => !prevState);
        event.preventDefault();
    }

    return (
        <div className="layout-profile">
            <div>
                <img src="assets/layout/images/profile.png" alt="Profile" />
            </div>
            <button className="p-link layout-profile-link" onClick={onClick}>
                <span className="username">{token.nome}</span>
                <i className="pi pi-fw pi-cog" />
            </button>
            <CSSTransition classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={expanded} unmountOnExit>

                <ul className={classNames({ 'layout-profile-expanded': expanded })}>
                    <li>
                        <img
                            style={{
                                marginTop: 50,
                                width: 150,
                                borderRadius: 15,
                                height: 150
                            }}
                            src={token.qrcode} />
                        <h6 style={{ color: 'white' }}>Escaneie o codigo usando o app</h6>
                        <button
                            type="button"
                            className=" p-link"
                            onClick={() => setToken(null)}>
                            <i className="pi pi-fw pi-power-off" />
                            <span>
                                Sair
                            </span>
                        </button>
                    </li>
                </ul>
            </CSSTransition>
        </div>
    );

}
