var FileHierarchyContextMenu = (function () {
    function FileHierarchyContextMenu() {
        this.menuModels = [];
        this.menuObject = false;
        this.menuUls = [];
        this.width = 100;
        this.srcElement = false;
        this.indexCurrentlyDisplayedMenuModel = false;
        this.imagePath = 'images/';
    }
    FileHierarchyContextMenu.prototype.setWidth = function (newWidth) {
        this.width = newWidth;
    };
    FileHierarchyContextMenu.prototype.attachToElement = function (element, elementId, menuModel) {
        window.refToThisContextMenu = this;
        if (!element && elementId)
            element = document.getElementById(elementId);
        if (!element.id) {
            element.id = 'context_menu' + Math.random();
            element.id = element.id.replace('.', '');
        }
        this.menuModels[element.id] = menuModel;
        element.oncontextmenu = this.__displayContextMenu;
        document.documentElement.onclick = this.__hideContextMenu;
    };
    FileHierarchyContextMenu.prototype.__displayContextMenu = function (e) {
        var ref = window.referenceToDHTMLSuiteContextMenu;
        ref.srcElement = ref.getSrcElement(e);
        if (!ref.indexCurrentlyDisplayedMenuModel || ref.indexCurrentlyDisplayedMenuModel != this.id) {
            if (ref.indexCurrentlyDisplayedMenuModel) {
                ref.menuObject.innerHTML = '';
            }
            else {
                ref.__createDivs();
            }
            ref.menuItems = ref.menuModels[this.id].getItems();
            ref.__createMenuItems();
        }
        ref.indexCurrentlyDisplayedMenuModel = this.id;
        ref.menuObject.style.left = (e.clientX + Math.max(document.body.scrollLeft, document.documentElement.scrollLeft)) + 'px';
        ref.menuObject.style.top = (e.clientY + Math.max(document.body.scrollTop, document.documentElement.scrollTop)) + 'px';
        ref.menuObject.style.display = 'block';
        return false;
    };
    FileHierarchyContextMenu.prototype.__hideContextMenu = function () {
        var ref = window.referenceToDHTMLSuiteContextMenu;
        if (ref.menuObject)
            ref.menuObject.style.display = 'none';
    };
    FileHierarchyContextMenu.prototype.__createDivs = function () {
        this.menuObject = document.createElement('DIV');
        this.menuObject.className = 'DHTMLSuite_contextMenu';
        if (this.width)
            this.menuObject.style.width = this.width + 'px';
        document.body.appendChild(this.menuObject);
    };
    FileHierarchyContextMenu.prototype.__mouseOver = function () {
        this.className = 'DHTMLSuite_item_mouseover';
        this.style.backgroundPosition = 'left center';
    };
    FileHierarchyContextMenu.prototype.__mouseOut = function () {
        this.className = '';
        this.style.backgroundPosition = '1px center';
    };
    FileHierarchyContextMenu.prototype.__evalUrl = function () {
        var js = this.getAttribute('jsFunction');
        if (!js)
            js = this.jsFunction;
        if (js)
            eval(js);
    };
    FileHierarchyContextMenu.prototype.__createMenuItems = function () {
        window.refToContextMenu = this;
        this.menuUls = [];
        for (var no in this.menuItems) {
            if (!this.menuUls[0]) {
                this.menuUls[0] = document.createElement('UL');
                this.menuObject.appendChild(this.menuUls[0]);
            }
            if (this.menuItems[no]['depth'] == 1) {
                if (this.menuItems[no]['separator']) {
                    var li_1 = document.createElement('DIV');
                    li_1.className = 'DHTMLSuite_contextMenu_separator';
                }
                else {
                    var li = document.createElement('LI');
                    if (this.menuItems[no]['jsFunction']) {
                        this.menuItems[no]['url'] = this.menuItems[no]['jsFunction'] + '(this,referenceToDHTMLSuiteContextMenu.srcElement)';
                    }
                    if (this.menuItems[no]['itemIcon']) {
                        li.style.backgroundImage = 'url(\'' + this.menuItems[no]['itemIcon'] + '\')';
                        li.style.backgroundPosition = '1px center';
                    }
                    if (this.menuItems[no]['url']) {
                        var url = this.menuItems[no]['url'] + '';
                        li.setAttribute('jsFunction', url);
                        li.jsFunction = url;
                        li.onclick = this.__evalUrl;
                    }
                    li.innerHTML = '<a href="#" onclick="return false">' + this.menuItems[no]['itemText'] + '</a>';
                    li.onmouseover = this.__mouseOver;
                    li.onmouseout = this.__mouseOut;
                }
                this.menuUls[0].appendChild(li);
            }
        }
    };
    FileHierarchyContextMenu.prototype.getSrcElement = function (e) {
        var el;
        if (e.target)
            el = e.target;
        else if (e.srcElement)
            el = e.srcElement;
        if (el.nodeType == 3)
            el = el.parentNode;
        return el;
    };
    FileHierarchyContextMenu.prototype.setLayoutCss = function (cssFileName) {
        this.layoutCSS = cssFileName;
    };
    FileHierarchyContextMenu.prototype.__setReference = function (obj) {
        window.referenceToDHTMLSuiteContextMenu = obj;
    };
    return FileHierarchyContextMenu;
}());
export default FileHierarchyContextMenu;
