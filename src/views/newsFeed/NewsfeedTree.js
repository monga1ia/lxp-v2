import React, { useState } from 'react';
// import TreeView from 'Widgets/TreeView2'
import TreeView from 'modules/TreeView';
import { translations } from "utils/translations";

const NewsfeedTree  = ({ locale, data, onTreeChange, selectedTreeId }) => {
    const onTreeClick = (idArr, event) => {
        if (idArr && idArr.length > 0) {
            if (onTreeChange)
                onTreeChange(idArr, event.node);
        }
    }

    return (
        <div className="m-portlet br-12">
            <div className="m-portlet__body">
                <TreeView
                    treeData={data}
                    defaultExpandAll={true}
                    selectedNodes={selectedTreeId}
                    onSelect={onTreeClick}
                />
            </div>
        </div>
    )
}

export default NewsfeedTree;
