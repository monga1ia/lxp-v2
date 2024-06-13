import EditIcon from 'cs-line-icons/custom/EditIcon';
import TrashIcon from 'cs-line-icons/custom/Trash';
import ViewIcon from 'cs-line-icons/custom/ViewIcon';
import React, { useEffect } from 'react'
import { ClickAwayListener } from "@mui/material";
import CsLineIcons from "cs-line-icons/CsLineIcons";
import { Button } from "react-bootstrap";
import ReactDOM from "react-dom";
import { useTranslation } from 'react-i18next';
import "../../../modules/DataTable/datatable.scss"

const ContextMenu = ({
    contextMenus = null,
    onContextMenuItemClick = (key,row,event) => {},
    row = null,
    left = 125
}) => {
    const {t} = useTranslation()

    const defaultContextMenus = [
        {
            key: "view",
            icon: <ViewIcon />,
            title: t('action.view'),
        },
        {
            key: "edit",
            icon: <EditIcon />,
            title: t('action.edit'),
        },
        {
            key: "delete",
            icon: <TrashIcon />,
            title: t('action.delete')
        }
    ];

    const getWrapper = () => {
        const wrapperId = "datatable-contextmenu-wrapper";
        const cmWrapper = document.getElementById(wrapperId);
        if (cmWrapper) {
            return cmWrapper;
        } else {
            const cmWrapper = document.createElement("div");
            cmWrapper.id = wrapperId;
            document.body.appendChild(cmWrapper);
            return cmWrapper;
        }
    }

    const unMountContextMenus = () => {
        const wrapper = getWrapper();
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper);
        }
    };

    const onContextMenu = (e, row) => {
        e.preventDefault();
        unMountContextMenus();

        const availableContextMenus = contextMenus ? contextMenus : defaultContextMenus;

        if (availableContextMenus.length) {
            const wrapper = getWrapper();
            const menu = (
                <ClickAwayListener onClickAway={unMountContextMenus}>
                    <div className="dt-cm-wrapper" style={{ top: e.pageY, left: e.pageX - left }}>
                        {availableContextMenus.map((menu) => {
                            return (
                                <div
                                    className="dt-cm-item"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        unMountContextMenus();
                                        onContextMenuItemClick?.(menu.key, row, event);
                                    }}
                                    key={menu.key}
                                >
                                    <div className="mr-2">{menu.icon ? menu.icon : null}</div>
                                    <span className="black-color">{menu.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </ClickAwayListener>
            );

            ReactDOM.render(menu, wrapper);
        }
    };

    return (
        <Button
            onClick={e=>onContextMenu(e,row)}
            variant="outline-primary"
            className="btn-icon btn-icon-only position-relative ml-4"
            size="sm"
        >
            <CsLineIcons icon="more-vertical" />
        </Button>
    )
}

export default ContextMenu
