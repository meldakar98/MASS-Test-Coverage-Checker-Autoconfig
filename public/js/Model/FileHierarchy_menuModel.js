var FileHierarchy_menuModel = (function () {
    function FileHierarchy_menuModel() {
        this.menuItems = {};
    }
    FileHierarchy_menuModel.prototype.addItem = function (id, itemText, itemIcon, url, parentId, jsFunction) {
        this.menuItems[id] = {};
        this.menuItems[id]['id'] = id;
        this.menuItems[id]['itemText'] = itemText;
        this.menuItems[id]['itemIcon'] = itemIcon;
        this.menuItems[id]['url'] = url;
        this.menuItems[id]['parentId'] = parentId;
        this.menuItems[id]['separator'] = false;
        this.menuItems[id]['jsFunction'] = jsFunction;
    };
    FileHierarchy_menuModel.prototype.addSeparator = function (id, parentId) {
        this.menuItems[id] = {};
        this.menuItems[id]['parentId'] = parentId;
        this.menuItems[id]['separator'] = true;
    };
    FileHierarchy_menuModel.prototype.init = function () {
        this.__getDepths();
    };
    FileHierarchy_menuModel.prototype.getItems = function () {
        return this.menuItems;
    };
    FileHierarchy_menuModel.prototype.__getDepths = function () {
        for (var no in this.menuItems) {
            this.menuItems[no]['depth'] = 1;
            if (this.menuItems[no]['parentId']) {
                this.menuItems[no]['depth'] = this.menuItems[this.menuItems[no]['parentId']]['depth'] + 1;
            }
        }
    };
    FileHierarchy_menuModel.prototype.__hasSubs = function (id) {
        for (var no in this.menuItems) {
            if (this.menuItems[no]['parentId'] == id)
                return true;
        }
        return false;
    };
    return FileHierarchy_menuModel;
}());
export default FileHierarchy_menuModel;
