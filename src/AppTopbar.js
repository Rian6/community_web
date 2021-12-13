import React from 'react';

export const AppTopbar = (props) => {
    return (
        <div className="layout-topbar clearfix">
        <button className="p-link layout-menu-button" onClick={props.onToggleMenu}>
            <span className="pi pi-bars"/>
        </button>
        <div className="layout-topbar-icons">
            <button className="p-link">
                <span className="layout-topbar-item-text">Events</span>
                <span className="layout-topbar-icon pi pi-calendar"/>
                <span className="layout-topbar-badge">5</span>
            </button>
            <button className="p-link">
                <span className="layout-topbar-item-text">Settings</span>
                <span className="layout-topbar-icon pi pi-cog"/>
            </button>
            <button className="p-link">
                <span className="layout-topbar-item-text">User</span>
                <span className="layout-topbar-icon pi pi-user"/>
            </button>
        </div>
    </div>
    );
}
