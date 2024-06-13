/* eslint-disable */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import Tree from "rc-tree";
import assign from "object-assign";
import { ClickAwayListener } from "@material-ui/core";

const CustomIcon = ({ props, type }) => {
    if (!props.isIcon) {
        return null;
    }

    return (
        <img
            style={{ width: 15, padding: 1 }}
            src={
                props.isActive ? "/img/icon/green_icon.png" : "/img/icon/grey_icon.png"
            }
            alt="Custom Icon"
        />
    );
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
    const [expandedNodes, setExpandedNodes] = useState([]);

    useEffect(() => {
        for (let i = 0; i < treeData.length; i++) {
            const nodeObj = treeData[i];

            if (expandedNodes.indexOf(nodeObj.key) < 0) {
                setExpandedNodes([...expandedNodes, nodeObj.key]);
            }
            if (nodeObj.children && nodeObj.children.length > 0) {
                for (let c = 0; c < nodeObj.children.length; c++) {
                    const childNode = nodeObj.children[c];
                    if (expandedNodes.indexOf(childNode.key) < 0) {
                        setExpandedNodes([...expandedNodes, childNode.key]);
                    }
                }
            }
        }
        getContainer();
    }, []);

    const getContainer = () => {
        const id = "tree-contextmenu-wrapper";
        const domContainer = document.getElementById(id);

        if (!domContainer) {
            const domContainer = document.createElement("div");
            domContainer.id = id;
            document.body.appendChild(domContainer);
        }

        return domContainer;
    };

    const unMountContextMenus = () => {
        const wrapper = getContainer();
        if (wrapper) {
            ReactDOM.unmountComponentAtNode(wrapper);
        }
    };

    const onRightClick = (info) => {
        if (info) {
            if (!info.node?.disableContextMenu) {
                if (
                    contextMenus &&
                    (contextMenus.length > 0 || Object.values(contextMenus).length > 0)
                ) {
                    if (info.node && info.node.key && info.node.key in contextMenus) {
                        contextMenus = contextMenus[info.node.key];
                    }

                    let tooltipVisible = true;
                    let availableContextMenus = [];

                    if (individualContextMenus) {
                        if (
                            contextMenus[contextMenuKey].length &&
                            info.node.contextMenuKeys?.length
                        ) {
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
                                <div className="react-contextmenu">
                                    {availableContextMenus.map((menu) => {
                                        return (
                                            <div
                                                key={"cm_" + info.node.key + "_item_" + menu.key}
                                                className="react-contextmenu-item"
                                                role="menuitem"
                                                onClick={() => {
                                                    tooltipVisible = false;
                                                    contextMenuClickHandler(info.node.key, menu.key);
                                                    unMountContextMenus();
                                                }}
                                            >
                                                <i
                                                    className={"m-nav__link-icon " + menu.iconClassName}
                                                />
                                                <span className="m-nav__link-text">{menu.text}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ClickAwayListener>
                        );

                        const container = getContainer();
                        assign(container.style, {
                            position: "absolute",
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

    const contextMenuClickHandler = (key, menuKey) => {
        onContextMenuClick(key, menuKey);
    };

    if (treeData?.length) {
        return (
            <Tree
                onRightClick={onRightClick}
                showIcon={false}
                showLine
                treeData={treeData}
                defaultExpandedKeys={expandedNodes}
                selectedKeys={selectedNodes}
                autoExpandParent
                defaultExpandParent
                onSelect={onSelect}
                defaultExpandAll={defaultExpandAll}
                className={className}
                defaultSelectedKeys={["0-0-1"]}
                {...rest}
                switcherIcon={(props, type) => <CustomIcon props={props} type={type} />}
            />
        );
    }

    return "...";
};

export default TreeView;
