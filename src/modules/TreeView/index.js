/* eslint-disable */
import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";

import {ClickAwayListener} from "@mui/material";
import Tree from 'rc-tree';
import assign from 'object-assign';
// import {createRoot} from 'react-dom/client';

const CustomIcon = ({props, type}) => {
    if (props.isIcon) {
        if (props.isActive) {
            return (
                <img
                    style={{width: 15, padding: 1}} // some custom style to look good
                    src='/img/icon/green_icon.png' // use your imported .png or .jpg file instead
                    alt="Custom Icon"
                />
            )
        }
        return (
            <img
                style={{width: 15, padding: 1}} // some custom style to look good
                src='/img/icon/grey_icon.png' // use your imported .png or .jpg file instead
                alt="Custom Icon"
            />
        )
    }
    return null;
};

const TreeView = ({
                      treeData = [],
                      selectedNodes,
                      onSelect,
                      className,
                      defaultExpandAll,
                      contextMenus,
                      contextMenuKey,
                      onContextMenuClick,
                      individualContextMenus = false,
                      ...rest
                  }) => {
    let root = null;
    const [expandedNodes, setExpandedNodes] = useState([]);

    useEffect(() => {
        for (let i = 0; i < treeData.length; i++) {
            let nodeObj = treeData[i];

            if (expandedNodes.indexOf(nodeObj.key) < 0) {
                expandedNodes.push(nodeObj.key);
            }
            if (nodeObj.children && nodeObj.children.length > 0) {
                for (let c = 0; c < nodeObj.children.length; c++) {
                    let childNode = nodeObj.children[c];
                    if (expandedNodes.indexOf(childNode.key) < 0) {
                        expandedNodes.push(childNode.key);
                    }
                }
            }
        }
        getContainer()
    }, [expandedNodes]);

    const getContainer = () => {
        const id = 'tree-contextmenu-wrapper';
        const domContainer = document.getElementById(id);
        if (domContainer) {
            return domContainer;
        } else {
            const domContainer = document.createElement('div');
            domContainer.id = id;
            document.body.appendChild(domContainer);
            return domContainer;
        }
    }

    const unMountContextMenus = () => {
        const wrapper = getContainer();
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper);
        }
    }

    const onRightClick = (info) => {
        unMountContextMenus()
        if (info) {
            if (!info.node?.disableContextMenu) {
                if (contextMenus && (contextMenus.length > 0 || Object.values(contextMenus).length > 0)) {
                    if (info.node && info.node.key && info.node.key in contextMenus) {
                        contextMenus = contextMenus[info.node.key];
                    }

                    let tooltipVisible = true;
                    let availableContextMenus = [];

                    if (individualContextMenus) {
                        if (contextMenus[contextMenuKey].length && info.node.contextMenuKeys?.length) {
                            for (const menu of contextMenus[contextMenuKey]) {
                                if (info.node.contextMenuKeys.includes(menu.key)) {
                                    availableContextMenus.push(menu);
                                }
                            }
                        }
                    } else {
                        availableContextMenus = contextMenus[contextMenuKey];
                    }
                    if (availableContextMenus && availableContextMenus.length > 0) {
                        const menuRenderViews = (
                            <ClickAwayListener onClickAway={unMountContextMenus}>
                                <div
                                    className='react-contextmenu'
                                >
                                    {
                                        availableContextMenus.map(menu => {
                                            return (
                                                <div
                                                    key={"cm_" + info.node.key + "_item_" + menu.key}
                                                    className="react-contextmenu-item"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        tooltipVisible = false;
                                                        contextMenuClickHandler(info.node.key, menu.key, info.node);
                                                        unMountContextMenus()
                                                    }}
                                                >
                                                    {
                                                        menu.customIcon
                                                            ?
                                                            <span style={{marginRight: 10}}>{menu.customIcon}</span>
                                                            :
                                                            <i className={'m-nav__link-icon ' + menu.iconClassName}/>
                                                    }

                                                    <span className="m-nav__link-text">{menu.text}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </ClickAwayListener>
                        );

                        const container = getContainer();
                        assign(container.style, {
                            position: 'absolute',
                            left: `${info.event.pageX}px`,
                            top: `${info.event.pageY}px`,
                        });

                        ReactDOM.render(menuRenderViews, container);

                    }
                } else {
                    return null;
                }
            }
        }
    };

    const contextMenuClickHandler = (key, menuKey, option) => {
        onContextMenuClick(key, menuKey, option);
    }

    if (treeData?.length) {
        return (
            <Tree
                onRightClick={onRightClick}
                showIcon={false}
                showLine={true}
                treeData={treeData}
                defaultExpandedKeys={expandedNodes}
                selectedKeys={selectedNodes}
                autoExpandParent={true}
                defaultExpandParent={true}
                onSelect={onSelect}
                defaultExpandAll={defaultExpandAll}
                className={className}
                defaultSelectedKeys={['0-0-0']}
                {...rest}
                switcherIcon={(props, type) => <CustomIcon props={props} type={type}/>}
            />
        )
    }

    return (
        '...'
    )
}

export default TreeView;