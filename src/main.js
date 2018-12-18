//  temporary stubs required for Vue. These will not be required as soon as the XD environment provides setTimeout/clearTimeout
global.setTimeout = function (fn) {
    fn()
};
global.clearTimeout = function () {
};

const Vue = require("vue").default;
// const styles = require("@/components/hello/styles.css");
const panel = require("@/components/panel/panel").default;

const {Path, Color, Group,RepeatGrid} = require("scenegraph");
const commands = require("commands");
// const {error} = require("./libs/dialogs.js");

let dialog;
let orgCells;
let orgColumns;

function getDialog(grid) {
    const {selection, root} = require("scenegraph");
    if (dialog == null) {
        document.body.innerHTML = `<dialog><div id="container">test</div></dialog>`;
        dialog = document.querySelector("dialog");
        new Vue(
            {
                el: "#container",
                components: {
                    panel
                },
                render(h) {
                    return h(panel, {props:{dialog,title:"Hello from vue!",columns:grid.numColumns, cells:grid.numColumns*grid.numRows},on:{close:this.closeFunc}});
                },
                methods:{
                    closeFunc:function(value){
                        console.log(value);
                        if (value) {
                            let currentCol = value.numColumns;
                            let currentRow = Math.ceil(value.numCells / value.numColumns);

                            fitSizeGird(grid, currentCol, currentRow);
                            console.log("need set" + currentRow  + "/" + (currentRow * currentCol) + "/" + value.numCells);
                            if (currentRow>1 && currentRow*currentCol>value.numCells) {
                                setMask(selection, grid, currentCol, value.numCells);
                            }


                        }
                    }

                }
            }
        );
        // const app = new Vue({
        //     el: "#container",
        //     components: { hello },
        //     render(h) {
        //         return h(hello, { props: { dialog } })
        //     }
        // })
    }
    return dialog;
}


async function mainFunction() {
    const {selection, root} = require("scenegraph");
    // find RepeatGrids
    const grids = findRepeatGrid(selection);
    if (grids.length===0) {
        console.log("no Repeat Grid");
        // error("リピートグリッドを選択してください。");
        return;
    } else if(grids.length>1) {
        console.log("you can only 1 repeat grid");
    }
    getDialog(grids[0], selection);
    await dialog.showModal();
    // let elemNumColums, elemNumItems, elemNumRows,elemIndexGrid;
    // elemIndexGrid = dialog.querySelector("#indexGrid");
    // elemNumColums = dialog.querySelector("#settingColumns");
    // elemNumItems = dialog.querySelector("#settingItems");
    // elemNumRows = dialog.querySelector("#settingRows")
    // for (let i=0;i<grids.length;i++){
    //     let grid = grids[i];
    //     selection.items = [grid];
    //     elemIndexGrid.innerHTML = (i+1) + "/" + (grids.length);
    //     elemNumColums.value = grid.numColumns;
    //     elemNumRows.value = grid.numRows;
    //     elemNumItems.value = grid.numRows * grid.numColumns;
    //
    //     await dialog.showModal();
    //     return;
    //
    // }

}
function fitSizeGird(rg, columns, rows) {
    console.log("fitSizeGrid");
    if (!columns) columns = rg.numColumns;
    if (!rows) rows = rg.numRows;
    rg.width = rg.cellSize.width * columns + rg.paddingX*(columns-1);
    // const newRows =  Math.ceil(length/columns);
    rg.height = rg.cellSize.height * rows + rg.paddingY*(rows-1);

}
function setMask(rg, columns,length) {
    const {selection, root} = require("scenegraph");
    selection.items = [rg];
    const maskPath = new Path();
    selection.insertionParent.addChild(maskPath);
    const basePoint = {x:rg.boundsInParent.x, y:rg.boundsInParent.y};
    basePoint.right = basePoint.x + rg.width;
    basePoint.bottom = basePoint.y + rg.height;
    const exceptRect = {};
    const exceptCell = columns - (length % columns);
    exceptRect.right = basePoint.right;
    exceptRect.bottom = basePoint.bottom;
    exceptRect.y = exceptRect.bottom - rg.cellSize.height - rg.paddingY;
    exceptRect.x = exceptRect.right - (rg.cellSize.width*exceptCell + rg.paddingX*exceptCell);
    const start = "M"+basePoint.x + " " + basePoint.y;
    const end = " L"+basePoint.x + " " + basePoint.y;
    let path = " H " + basePoint.right
        + " V " + exceptRect.y
        + " H " + exceptRect.x
        + " V " + exceptRect.bottom
        + " H " + basePoint.x;
    console.log(path);
    maskPath.pathData = start + path + end;
    maskPath.fill = new Color("#666");

    selection.items = [rg, maskPath];
    commands.createMaskGroup();
}
function findRepeatGrid(selection) {
    const result = [];
    for(let i=0;i<selection.items.length;i++) {
        console.log(selection.items[i].constructor.name);
        if (selection.items[i] instanceof RepeatGrid) {
            result.push(selection.items[i]);
        }
    }
    return result;
}



module.exports = {
    commands: {
        menuCommand: mainFunction
        // menuCommand: function () {
        //     // getDialog().showModal();
        //     // mainFunction
        // }
    }
};
