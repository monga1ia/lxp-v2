import * as React from "react";
import TreeView from "modules/TreeView";

const TreeComponent = ({data = [], onChange, selectedNodes}) => {

    
    return (
        <div className="d-flex flex-row">
            <TreeView
                selectedNodes={selectedNodes}
                defaultExpandAll
                treeData={data}
                onSelect={onChange}
            />
        </div>
    );
}

export default TreeComponent;
