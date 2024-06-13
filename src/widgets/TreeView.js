import React, {Component} from 'react'
import ReactDOM from 'react-dom';

import Tree from 'rc-tree';
import assign from 'object-assign';
import Tooltip from 'rc-tooltip'
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";

class TreeView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            treeDatas: [],
            hasContextMenus: false,
            expandedNodes: [],
            icon: props.icon ? props.icon : false
        };
        this.tooltipVisible = false;
        this.toolTipRef = React.createRef();
    }

    getContainer() {
        if (!this.cmContainer) {
            this.cmContainer = document.createElement('div');
            document.body.appendChild(this.cmContainer);
        }
        return this.cmContainer;
    }

    _onRightClick = (info) => {
        if (this.props.contextMenus && (this.props.contextMenus.length > 0 || Object.values(this.props.contextMenus).length > 0)) {
            let contextMenus = this.props.contextMenus;

            if (info.node && info.node.contextMenuKey && info.node.contextMenuKey in contextMenus) {
                contextMenus = contextMenus[info.node.contextMenuKey];
            }

            if (this.toolTip) {
                ReactDOM.unmountComponentAtNode(this.cmContainer);
                this.toolTip = null;
            }

            this.tooltipVisible = true;

            let menuItems = contextMenus;
            let menuRenderViews = [];

            if (menuItems.length > 0) {
                for (let i = 0; i < menuItems.length; i++) {
                    let menuObj = menuItems[i];

                    menuRenderViews.push(
                        <div key={"cm_" + info.node.key + "_item_" + menuObj.key} className="react-contextmenu-item"
                             role="menuitem" aria-disabled="true"
                             onClick={() => {
                                 this.tooltipVisible = false;
                                 this.props.onContextMenuClick(info.node.key, menuObj.key);

                                 ReactDOM.unmountComponentAtNode(this.cmContainer);
                             }}>
                            <i className={'m-nav__link-icon ' + menuObj.iconClassName}/>
                            <span className="m-nav__link-text">{menuObj.text}</span>
                        </div>
                    );
                }

                this.toolTip = <Tooltip
                    ref={(el) => this.toolTipRef = el}
                    trigger={'click'}
                    defaultVisible
                    visible={this.tooltipVisible}
                    placement="bottomLeft"
                    prefixCls="react-contextmenu"
                    overlay={menuRenderViews}
                    destroyTooltipOnHide={true}
                    overlayClassName={this.props.contextMenuWrapperClassName || ''}
                >
                    <span/>
                </Tooltip>
                ;

                const container = this.getContainer();
                assign(this.cmContainer.style, {
                    position: 'absolute',
                    left: `${info.event.pageX}px`,
                    top: `${info.event.pageY}px`,
                });

                ReactDOM.render(this.toolTip, container);

                this._outSideClickEvent()

                if (this.props.selectOnRightClick) {
                    let selectedNodes = [];
                    selectedNodes.push(info.node.key);
                    this.props.onSelect(selectedNodes)
                }
            }
        } else {
            return null;
        }
    };

    _outSideClickEvent = () => {
        let that = this;

        if (this.cmContainer) {
            $('body').on('click', function (e) {
                let el = $(e.target);
                if (el) {
                    if (!$(el).hasClass('react-contextmenu') && $(el).closest('.react-contextmenu').length === 0) {
                        ReactDOM.unmountComponentAtNode(that.cmContainer);
                    }
                }
            });
        }
    };

    render() {
        let treeDatas = this.props.treeDatas;
        let selectedNodes = this.props.selectedNodes;
        let expandedNodes = [];

        for (let i = 0; i < treeDatas.length; i++) {
            let nodeObj = treeDatas[i];

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

        return (
            <div>
                {
                    treeDatas && treeDatas.length > 0 && <Tree
                        onRightClick={this._onRightClick}
                        showIcon={this.state.icon}
                        showLine={true}
                        treeData={treeDatas}
                        defaultExpandedKeys={expandedNodes}
                        selectedKeys={selectedNodes}
                        autoExpandParent={true}
                        defaultExpandParent={true}
                        onSelect={this.props.onSelect}
                        defaultExpandAll={this.props.defaultExpandAll}
                        className={this.props.className || ''}
                    />
                }
            </div>
        )
    }
}

TreeView.displayName = 'ReactTreeView';

/**
 * Define defaultProps for this component
 */
TreeView.defaultProps = {
    id: 'rc_tree_view',
    treeDatas: [],
    selectedNodes: [],
    contextMenus: [],
    onSelect: () => {
    },
    onContextMenuClick: () => {
    }
};

export default TreeView;