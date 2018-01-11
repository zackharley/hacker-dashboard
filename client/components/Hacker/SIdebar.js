import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import { Sidebar, SidebarItem } from '../Dashboard';

export default ({ ...props }) => (
    <Sidebar {...props}>
        <SidebarItem name="home"
                     to="/">
            <Icon name="home"/>
            Home
        </SidebarItem>
    </Sidebar>
);