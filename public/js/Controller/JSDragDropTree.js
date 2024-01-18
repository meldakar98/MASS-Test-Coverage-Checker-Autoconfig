import FileHierarchy_menuModel from "../Model/FileHierarchy_menuModel.js";
import FileHierarchy_contextMenu from "../Model/FileHierarchy_contextMenu.js";
window.JSTreeObj = '';
var JSDragDropTree = (function () {
    function JSDragDropTree() {
        this.idOfTree = null;
        this.dragNode_source = null;
        this.dragNode_parent = null;
        this.dragNode_sourceNextSib = null;
        this.dragNode_destination = false;
        this.dropTargetIndicator = null;
        this.imageFolder = 'assets/images/';
        this.plusIconClassName = 'uil uil-angle-right';
        this.minusIconClassName = 'uil uil-angle-down';
        this.maximumDepth = 6;
        this.contextMenu = false;
        this.floatingContainer = document.createElement('UL');
        this.floatingContainer.style.position = 'absolute';
        this.floatingContainer.style.display = 'none';
        this.floatingContainer.id = 'floatingContainer';
        document.body.appendChild(this.floatingContainer);
        this.dragDropTimer = -1;
        this.dragNode_noSiblings = false;
        this.currentItemToEdit = false;
        this.indicator_offsetX = 2;
        this.indicator_offsetX_sub = 4;
        this.indicator_offsetY = 2;
        this.messageMaximumDepthReached = '';
        this.renameAllowed = true;
        this.deleteAllowed = true;
        this.currentlyActiveItem = false;
        this.ajaxObjects = [];
        this.helpObj = null;
        this.RENAME_STATE_BEGIN = 1;
        this.RENAME_STATE_CANCELED = 2;
        this.RENAME_STATE_REQUEST_SENDED = 3;
        this.renameState = null;
    }
    JSDragDropTree.prototype.addEvent = function (whichObject, eventType, functionName) {
        if (whichObject.attachEvent) {
            whichObject['e' + eventType + functionName] = functionName;
            whichObject[eventType + functionName] = function () { whichObject['e' + eventType + functionName](window.event); };
            whichObject.attachEvent('on' + eventType, whichObject[eventType + functionName]);
        }
        else {
            whichObject.addEventListener(eventType, functionName, false);
        }
    };
    JSDragDropTree.prototype.removeEvent = function (whichObject, eventType, functionName) {
        if (whichObject.detachEvent) {
            whichObject.detachEvent('on' + eventType, whichObject[eventType + functionName]);
            whichObject[eventType + functionName] = null;
        }
        else {
            whichObject.removeEventListener(eventType, functionName, false);
        }
    };
    JSDragDropTree.prototype.Get_Cookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return null;
    };
    JSDragDropTree.prototype.Set_Cookie = function (name, value, expires, path, domain, secure) {
        expires = expires * 60 * 60 * 24 * 1000;
        var today = new Date();
        var expires_date = new Date(today.getTime() + (expires));
        var cookieString = name + "=" + encodeURIComponent(value) +
            ((expires) ? ";expires=" + expires_date.toUTCString() : "") +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") +
            ((secure) ? ";secure" : "");
        document.cookie = cookieString;
    };
    JSDragDropTree.prototype.setRenameAllowed = function (renameAllowed) {
        this.renameAllowed = renameAllowed;
    };
    JSDragDropTree.prototype.setDeleteAllowed = function (deleteAllowed) {
        this.deleteAllowed = deleteAllowed;
    };
    JSDragDropTree.prototype.setMaximumDepth = function (maxDepth) {
        this.maximumDepth = maxDepth;
    };
    JSDragDropTree.prototype.setMessageMaximumDepthReached = function (newMessage) {
        this.messageMaximumDepthReached = newMessage;
    };
    JSDragDropTree.prototype.setImageFolder = function (path) {
        this.imageFolder = path;
    };
    JSDragDropTree.prototype.setTreeId = function (idOfTree) {
        this.idOfTree = idOfTree;
    };
    JSDragDropTree.prototype.expandAll = function () {
        var menuItems = document.getElementById(this.idOfTree).getElementsByTagName('LI');
        for (var no = 0; no < menuItems.length; no++) {
            var subItems = menuItems[no].getElementsByTagName('UL');
            if (subItems.length > 0 && subItems[0].style.display != 'block') {
                window.JSTreeObj.showHideNode(false, menuItems[no].id);
            }
        }
    };
    JSDragDropTree.prototype.collapseAll = function () {
        var menuItems = document.getElementById(this.idOfTree).getElementsByTagName('LI');
        for (var no = 0; no < menuItems.length; no++) {
            var subItems = menuItems[no].getElementsByTagName('UL');
            if (subItems.length > 0 && subItems[0].style.display == 'block') {
                window.JSTreeObj.showHideNode(false, menuItems[no].id);
            }
        }
    };
    JSDragDropTree.prototype.getTopPos = function (obj) {
        var top = obj.offsetTop / 1;
        while ((obj = obj.offsetParent) != null) {
            if (obj.tagName != 'HTML')
                top += obj.offsetTop;
        }
        if (document.all)
            top = top / 1 + 13;
        else
            top = top / 1 + 4;
        return top;
    };
    JSDragDropTree.prototype.getLeftPos = function (obj) {
        var left = obj.offsetLeft / 1 + 1;
        while ((obj = obj.offsetParent) != null) {
            if (obj.tagName != 'HTML')
                left += obj.offsetLeft;
        }
        if (document.all)
            left = left / 1 - 2;
        return left;
    };
    JSDragDropTree.prototype.showHideNode = function (e, inputId) {
        if (e === void 0) { e = false; }
        var thisNode = null;
        var initExpandedNodes = this.Get_Cookie('filehierarchy_expandedNodes');
        if (inputId) {
            if (!document.getElementById(inputId))
                return;
            thisNode = document.getElementById(inputId).getElementsByTagName('I')[0];
        }
        else {
            thisNode = this;
            if (this.tagName == 'A')
                thisNode = this.parentNode.getElementsByTagName('I')[0];
        }
        if (thisNode.style.visibility == 'hidden')
            return;
        var parentNode = thisNode.parentNode;
        inputId = parentNode.id.replace(/[^0-9]/g, '');
        if (thisNode.className == window.JSTreeObj.plusIconClassName) {
            thisNode.className = window.JSTreeObj.minusIconClassName;
            var ul = parentNode.getElementsByTagName('UL')[0];
            ul.style.display = 'block';
            if (!initExpandedNodes)
                initExpandedNodes = ',';
            if (initExpandedNodes.indexOf(',' + inputId + ',') < 0)
                initExpandedNodes = initExpandedNodes + inputId + ',';
        }
        else {
            thisNode.className = window.JSTreeObj.plusIconClassName;
            parentNode.getElementsByTagName('UL')[0].style.display = 'none';
            initExpandedNodes = initExpandedNodes.replace(',' + inputId, '');
        }
        window.JSTreeObj.Set_Cookie('filehierarchy_expandedNodes', initExpandedNodes, 500);
        return false;
    };
    JSDragDropTree.prototype.initDrag = function (e) {
        if (document.all)
            e = event;
        var subs = window.JSTreeObj.floatingContainer.getElementsByTagName('LI');
        if (subs.length > 0) {
            if (window.JSTreeObj.dragNode_sourceNextSib) {
                window.JSTreeObj.dragNode_parent.insertBefore(window.JSTreeObj.dragNode_source, window.JSTreeObj.dragNode_sourceNextSib);
            }
            else {
                window.JSTreeObj.dragNode_parent.appendChild(window.JSTreeObj.dragNode_source);
            }
        }
        window.JSTreeObj.dragNode_source = this.parentNode;
        window.JSTreeObj.dragNode_parent = this.parentNode.parentNode;
        window.JSTreeObj.dragNode_sourceNextSib = false;
        if (window.JSTreeObj.dragNode_source.nextSibling)
            window.JSTreeObj.dragNode_sourceNextSib = window.JSTreeObj.dragNode_source.nextSibling;
        window.JSTreeObj.dragNode_destination = false;
        window.JSTreeObj.dragDropTimer = 0;
        window.JSTreeObj.timerDrag();
        return false;
    };
    JSDragDropTree.prototype.timerDrag = function () {
        if (this.dragDropTimer >= 0 && this.dragDropTimer < 10) {
            this.dragDropTimer = this.dragDropTimer + 1;
            setTimeout('JSTreeObj.timerDrag()', 20);
            return;
        }
        if (this.dragDropTimer == 10) {
            window.JSTreeObj.floatingContainer.style.display = 'block';
            window.JSTreeObj.floatingContainer.appendChild(window.JSTreeObj.dragNode_source);
        }
    };
    JSDragDropTree.prototype.moveDragableNodes = function (e) {
        if (window.JSTreeObj.dragDropTimer < 10)
            return;
        if (document.all)
            e = event;
        var dragDrop_x = e.clientX / 1 + 5 + document.body.scrollLeft;
        var dragDrop_y = e.clientY / 1 + 5 + document.documentElement.scrollTop;
        window.JSTreeObj.floatingContainer.style.left = dragDrop_x + 'px';
        window.JSTreeObj.floatingContainer.style.top = dragDrop_y + 'px';
        var thisObj = this;
        if (thisObj.tagName == 'A' || thisObj.tagName == 'IMG')
            thisObj = thisObj.parentNode;
        window.JSTreeObj.dragNode_noSiblings = false;
        var tmpVar = thisObj.getAttribute('noSiblings');
        if (!tmpVar)
            tmpVar = thisObj.noSiblings;
        if (tmpVar == 'true')
            window.JSTreeObj.dragNode_noSiblings = true;
        if (thisObj && thisObj.id) {
            window.JSTreeObj.dragNode_destination = thisObj;
            var tmpObj = window.JSTreeObj.dropTargetIndicator;
            tmpObj.style.display = 'block';
            var eventSourceObj = this;
            if (window.JSTreeObj.dragNode_noSiblings && eventSourceObj.tagName == 'IMG')
                eventSourceObj = eventSourceObj.nextSibling;
            var tmpImg = tmpObj.getElementsByTagName('IMG')[0];
            if (this.tagName == 'A' || window.JSTreeObj.dragNode_noSiblings) {
                tmpImg.src = tmpImg.src.replace('ind1', 'ind2');
                window.JSTreeObj.insertAsSub = true;
                tmpObj.style.left = (window.JSTreeObj.getLeftPos(eventSourceObj) + window.JSTreeObj.indicator_offsetX_sub) + 'px';
            }
            else {
                tmpImg.src = tmpImg.src.replace('ind2', 'ind1');
                window.JSTreeObj.insertAsSub = false;
                tmpObj.style.left = (window.JSTreeObj.getLeftPos(eventSourceObj) + window.JSTreeObj.indicator_offsetX) + 'px';
            }
            tmpObj.style.top = (window.JSTreeObj.getTopPos(thisObj) + window.JSTreeObj.indicator_offsetY) + 'px';
        }
        return false;
    };
    JSDragDropTree.prototype.dropDragableNodes = function () {
        if (window.JSTreeObj.dragDropTimer < 10) {
            window.JSTreeObj.dragDropTimer = -1;
            return;
        }
        var showMessage = false;
        if (window.JSTreeObj.dragNode_destination) {
            var countUp = window.JSTreeObj.dragDropCountLevels(window.JSTreeObj.dragNode_destination, 'up');
            var countDown = window.JSTreeObj.dragDropCountLevels(window.JSTreeObj.dragNode_source, 'down');
            var countLevels = countUp / 1 + countDown / 1 + (window.JSTreeObj.insertAsSub ? 1 : 0);
            if (countLevels > window.JSTreeObj.maximumDepth) {
                window.JSTreeObj.dragNode_destination = false;
                showMessage = true;
            }
        }
        if (window.JSTreeObj.dragNode_destination) {
            if (window.JSTreeObj.insertAsSub) {
                var uls = window.JSTreeObj.dragNode_destination.getElementsByTagName('UL');
                if (uls.length > 0) {
                    ul = uls[0];
                    ul.style.display = 'block';
                    var lis = ul.getElementsByTagName('LI');
                    if (lis.length > 0) {
                        ul.insertBefore(window.JSTreeObj.dragNode_source, lis[0]);
                    }
                    else {
                        ul.appendChild(window.JSTreeObj.dragNode_source);
                    }
                }
                else {
                    var ul = document.createElement('UL');
                    ul.style.display = 'block';
                    window.JSTreeObj.dragNode_destination.appendChild(ul);
                    ul.appendChild(window.JSTreeObj.dragNode_source);
                }
                var ico = window.JSTreeObj.dragNode_destination.getElementsByTagName('I')[0];
                ico.style.visibility = 'visible';
                ico.className = window.JSTreeObj.minusIconClassName;
            }
            else {
                if (window.JSTreeObj.dragNode_destination.nextSibling) {
                    var nextSib = window.JSTreeObj.dragNode_destination.nextSibling;
                    nextSib.parentNode.insertBefore(window.JSTreeObj.dragNode_source, nextSib);
                }
                else {
                    window.JSTreeObj.dragNode_destination.parentNode.appendChild(window.JSTreeObj.dragNode_source);
                }
            }
            var tmpObj = window.JSTreeObj.dragNode_parent;
            var lis = tmpObj.getElementsByTagName('LI');
            if (lis.length == 0) {
                var ico = tmpObj.parentNode.getElementsByTagName('I')[0];
                ico.style.visibility = 'hidden';
                tmpObj.parentNode.removeChild(tmpObj);
            }
        }
        else {
            if (window.JSTreeObj.dragNode_sourceNextSib) {
                window.JSTreeObj.dragNode_parent.insertBefore(window.JSTreeObj.dragNode_source, window.JSTreeObj.dragNode_sourceNextSib);
            }
            else {
                window.JSTreeObj.dragNode_parent.appendChild(window.JSTreeObj.dragNode_source);
            }
        }
        window.JSTreeObj.dropTargetIndicator.style.display = 'none';
        window.JSTreeObj.dragDropTimer = -1;
        if (showMessage && window.JSTreeObj.messageMaximumDepthReached)
            alert(window.JSTreeObj.messageMaximumDepthReached);
    };
    JSDragDropTree.prototype.createDropIndicator = function () {
        this.dropTargetIndicator = document.createElement('DIV');
        this.dropTargetIndicator.style.position = 'absolute';
        this.dropTargetIndicator.style.display = 'none';
        var img = document.createElement('IMG');
        img.src = this.imageFolder + 'dragDrop_ind1.gif';
        img.id = 'dragDropIndicatorImage';
        this.dropTargetIndicator.appendChild(img);
        this.dropTargetIndicator.appendChild(img);
        document.body.appendChild(this.dropTargetIndicator);
    };
    JSDragDropTree.prototype.dragDropCountLevels = function (obj, direction, stopAtObject) {
        var countLevels = 0;
        if (direction == 'up') {
            while (obj.parentNode && obj.parentNode != stopAtObject) {
                obj = obj.parentNode;
                if (obj.tagName == 'UL')
                    countLevels = countLevels / 1 + 1;
            }
            return countLevels;
        }
        if (direction == 'down') {
            var subObjects = obj.getElementsByTagName('LI');
            for (var no = 0; no < subObjects.length; no++) {
                countLevels = Math.max(countLevels, window.JSTreeObj.dragDropCountLevels(subObjects[no], "up", obj));
            }
            return countLevels;
        }
    };
    JSDragDropTree.prototype.cancelEvent = function () {
        return false;
    };
    JSDragDropTree.prototype.cancelSelectionEvent = function () {
        if (window.JSTreeObj.dragDropTimer < 10)
            return true;
        return false;
    };
    JSDragDropTree.prototype.getNodeOrders = function (initObj, saveString) {
        if (!saveString)
            var saveString = '';
        if (!initObj) {
            initObj = document.getElementById(this.idOfTree);
        }
        var lis = initObj.getElementsByTagName('LI');
        if (lis.length > 0) {
            var li = lis[0];
            while (li) {
                if (li.id) {
                    if (saveString.length > 0)
                        saveString = saveString + ',';
                    var numericID = li.id.replace(/[^0-9]/gi, '');
                    if (numericID.length == 0)
                        numericID = 'A';
                    var numericParentID = li.parentNode.parentNode.id.replace(/[^0-9]/gi, '');
                    if (numericID != '0') {
                        saveString = saveString + numericID;
                        saveString = saveString + '-';
                        if (li.parentNode.id != this.idOfTree)
                            saveString = saveString + numericParentID;
                        else
                            saveString = saveString + '0';
                    }
                    var ul = li.getElementsByTagName('UL');
                    if (ul.length > 0) {
                        saveString = this.getNodeOrders(ul[0], saveString);
                    }
                }
                li = li.nextSibling;
            }
        }
        if (initObj.id == this.idOfTree) {
            return saveString;
        }
        return saveString;
    };
    JSDragDropTree.prototype.highlightItem = function (inputObj, e) {
        if (window.JSTreeObj.currentlyActiveItem)
            window.JSTreeObj.currentlyActiveItem.className = '';
        this.className = 'highlightedNodeItem';
        window.JSTreeObj.currentlyActiveItem = this;
    };
    JSDragDropTree.prototype.removeHighlight = function () {
        if (window.JSTreeObj.currentlyActiveItem)
            window.JSTreeObj.currentlyActiveItem.className = '';
        window.JSTreeObj.currentlyActiveItem = false;
    };
    JSDragDropTree.prototype.hasSubNodes = function (obj) {
        var subs = obj.getElementsByTagName('LI');
        if (subs.length > 0)
            return true;
        return false;
    };
    JSDragDropTree.prototype.deleteItem = function (obj1, obj2) {
        var message = 'Click OK to delete item ' + obj2.innerHTML;
        if (this.hasSubNodes(obj2.parentNode))
            message = message + ' and it\'s sub nodes';
        if (confirm(message)) {
            this.__deleteItem_step2(obj2.parentNode);
        }
    };
    JSDragDropTree.prototype.__refreshDisplay = function (obj) {
        if (this.hasSubNodes(obj))
            return;
        var img = obj.getElementsByTagName('IMG')[0];
        img.style.visibility = 'hidden';
    };
    JSDragDropTree.prototype.__deleteItem_step2 = function (obj) {
        var saveString = obj.id.replace(/[^0-9]/gi, '');
        var lis = obj.getElementsByTagName('LI');
        for (var no = 0; no < lis.length; no++) {
            saveString = saveString + ',' + lis[no].id.replace(/[^0-9]/gi, '');
        }
        var ajaxIndex = window.JSTreeObj.ajaxObjects.length;
        window.JSTreeObj.ajaxObjects[ajaxIndex].setVar("deleteIds", saveString);
        window.JSTreeObj.__deleteComplete(ajaxIndex, obj);
    };
    JSDragDropTree.prototype.__deleteComplete = function (ajaxIndex, obj) {
        if (this.ajaxObjects[ajaxIndex].response != 'OK') {
            alert('ERROR WHEN TRYING TO DELETE NODE: ' + this.ajaxObjects[ajaxIndex].response);
        }
        else {
            var parentRef = obj.parentNode.parentNode;
            obj.parentNode.removeChild(obj);
            this.__refreshDisplay(parentRef);
        }
    };
    JSDragDropTree.prototype.__renameComplete = function (ajaxIndex) {
        if (this.ajaxObjects[ajaxIndex].response != 'OK') {
            alert('ERROR WHEN TRYING TO RENAME NODE: ' + this.ajaxObjects[ajaxIndex].response);
        }
    };
    JSDragDropTree.prototype.__saveTextBoxChanges = function (e, inputObj) {
        if (!inputObj && this)
            inputObj = this;
        if (document.all)
            e = event;
        if (e.keyCode && e.keyCode == 27) {
            window.JSTreeObj.__cancelRename(e, inputObj);
            return;
        }
        inputObj.style.display = 'none';
        inputObj.nextSibling.style.visibility = 'visible';
        if (inputObj.value.length > 0) {
            inputObj.nextSibling.innerHTML = inputObj.value;
            if (window.JSTreeObj.renameState != window.JSTreeObj.RENAME_STATE_BEGIN) {
                return;
            }
            window.JSTreeObj.renameState = window.JSTreeObj.RENAME_STATE_REQUEST_SENDED;
            var ajaxIndex = window.JSTreeObj.ajaxObjects.length;
            window.JSTreeObj.ajaxObjects[ajaxIndex].setVar("renameId", inputObj.parentNode.id.replace(/[^0-9]/gi, ''));
            window.JSTreeObj.ajaxObjects[ajaxIndex].setVar("newName", inputObj.value);
            window.JSTreeObj.__renameComplete(ajaxIndex);
        }
    };
    JSDragDropTree.prototype.__cancelRename = function (e, inputObj) {
        window.JSTreeObj.renameState = window.JSTreeObj.RENAME_STATE_CANCELD;
        if (!inputObj && this)
            inputObj = this;
        inputObj.value = window.JSTreeObj.helpObj.innerHTML;
        inputObj.nextSibling.innerHTML = window.JSTreeObj.helpObj.innerHTML;
        inputObj.style.display = 'none';
        inputObj.nextSibling.style.visibility = 'visible';
    };
    JSDragDropTree.prototype.__renameCheckKeyCode = function (e) {
        if (document.all)
            e = event;
        if (e.keyCode == 13) {
            window.JSTreeObj.__saveTextBoxChanges(false, this);
        }
        if (e.keyCode == 27) {
            window.JSTreeObj.__cancelRename(false, this);
        }
    };
    JSDragDropTree.prototype.__createTextBox = function (obj) {
        var textBox = document.createElement('INPUT');
        textBox.className = 'folderTreeTextBox';
        textBox.value = obj.innerHTML;
        obj.parentNode.insertBefore(textBox, obj);
        textBox.id = 'textBox' + obj.parentNode.id.replace(/[^0-9]/gi, '');
        textBox.onblur = this.__saveTextBoxChanges;
        textBox.onkeydown = this.__renameCheckKeyCode;
        this.__renameEnableTextBox(obj);
    };
    JSDragDropTree.prototype.__renameEnableTextBox = function (obj) {
        window.JSTreeObj.renameState = window.JSTreeObj.RENAME_STATE_BEGIN;
        obj.style.visibility = 'hidden';
        obj.previousSibling.value = obj.innerHTML;
        obj.previousSibling.style.display = 'inline';
        obj.previousSibling.select();
    };
    JSDragDropTree.prototype.renameItem = function (obj1, obj2) {
        this.currentItemToEdit = obj2.parentNode;
        if (!obj2.previousSibling || obj2.previousSibling.tagName.toLowerCase() != 'input') {
            this.__createTextBox(obj2);
        }
        else {
            this.__renameEnableTextBox(obj2);
        }
        this.helpObj.innerHTML = obj2.innerHTML;
    };
    JSDragDropTree.prototype.initTree = function () {
        var _this = this;
        window.JSTreeObj = this;
        window.JSTreeObj.createDropIndicator();
        document.documentElement.onselectstart = window.JSTreeObj.cancelSelectionEvent;
        document.documentElement.ondragstart = window.JSTreeObj.cancelEvent;
        document.documentElement.onmousedown = window.JSTreeObj.removeHighlight;
        this.helpObj = document.createElement('DIV');
        this.helpObj.style.display = 'none';
        document.body.appendChild(this.helpObj);
        if (this.deleteAllowed || this.renameAllowed) {
            try {
                var menuModel = new FileHierarchy_menuModel();
                if (this.deleteAllowed)
                    menuModel.addItem(1, 'Delete', '', '', false, 'JSTreeObj.deleteItem');
                if (this.renameAllowed)
                    menuModel.addItem(2, 'Rename', '', '', false, 'JSTreeObj.renameItem');
                menuModel.init();
                var menuModelRenameOnly = new FileHierarchy_menuModel();
                if (this.renameAllowed)
                    menuModelRenameOnly.addItem(3, 'Rename', '', '', false, 'JSTreeObj.renameItem');
                menuModelRenameOnly.init();
                var menuModelDeleteOnly = new FileHierarchy_menuModel();
                if (this.deleteAllowed)
                    menuModelDeleteOnly.addItem(4, 'Delete', '', '', false, 'JSTreeObj.deleteItem');
                menuModelDeleteOnly.init();
                window.refToDragDropTree = this;
                this.contextMenu = new FileHierarchy_contextMenu();
                this.contextMenu.setWidth(120);
                window.referenceToDHTMLSuiteContextMenu = this.contextMenu;
            }
            catch (e) { }
        }
        var nodeId = 0;
        var treeUlCounter = 0;
        var filehierarchy_tree = document.getElementById(this.idOfTree);
        var menuItems = filehierarchy_tree.getElementsByTagName('LI');
        var _loop_1 = function (no) {
            noChildren = false;
            tmpVar = menuItems[no].getAttribute('noChildren');
            if (!tmpVar)
                tmpVar = menuItems[no].noChildren;
            if (tmpVar == 'true')
                noChildren = true;
            noDrag = false;
            tmpVar = menuItems[no].getAttribute('noDrag');
            if (!tmpVar)
                tmpVar = menuItems[no].noDrag;
            if (tmpVar == 'true')
                noDrag = true;
            nodeId++;
            subItems = menuItems[no].getElementsByTagName('UL');
            ico = document.createElement('I');
            ico.className = this_1.plusIconClassName;
            ico.addEventListener('click', function () { return window.JSTreeObj.showHideNode(false, menuItems[no].id); });
            if (subItems.length == 0)
                ico.style.visibility = 'hidden';
            else {
                subItems[0].id = 'tree_ul_' + treeUlCounter;
                treeUlCounter++;
            }
            aTag = menuItems[no].getElementsByTagName('A')[0];
            aTag.id = 'nodeATag' + menuItems[no].id.replace(/[^0-9]/gi, '');
            this_1.addEvent(aTag, 'click', function () { return _this.showHideNode(false, menuItems[no].id); });
            if (!noDrag)
                aTag.onmousedown = window.JSTreeObj.initDrag;
            if (!noChildren)
                aTag.onmousemove = window.JSTreeObj.moveDragableNodes;
            menuItems[no].insertBefore(ico, aTag);
            folderIco = document.createElement('I');
            if (!noDrag)
                folderIco.onmousedown = window.JSTreeObj.initDrag;
            folderIco.onmousemove = window.JSTreeObj.moveDragableNodes;
            if (menuItems[no].className) {
                folderIco.className = "uil uil-file";
            }
            else {
                folderIco.className = "uil uil-folder-open";
            }
            menuItems[no].insertBefore(folderIco, aTag);
            if (this_1.contextMenu) {
                noDelete = menuItems[no].getAttribute('noDelete');
                if (!noDelete)
                    noDelete = menuItems[no].noDelete;
                noRename = menuItems[no].getAttribute('noRename');
                if (!noRename)
                    noRename = menuItems[no].noRename;
                if (noRename == 'true' && noDelete == 'true') { }
                else {
                    if (noDelete == 'true')
                        this_1.contextMenu.attachToElement(aTag, false, menuModelRenameOnly);
                    else if (noRename == 'true')
                        this_1.contextMenu.attachToElement(aTag, false, menuModelDeleteOnly);
                    else
                        this_1.contextMenu.attachToElement(aTag, false, menuModel);
                }
            }
            this_1.addEvent(aTag, 'contextmenu', this_1.highlightItem);
        };
        var this_1 = this, noChildren, tmpVar, noDrag, tmpVar, subItems, ico, aTag, folderIco, noDelete, noRename;
        for (var no = 0; no < menuItems.length; no++) {
            _loop_1(no);
        }
        var initExpandedNodes = this.Get_Cookie('filehierarchy_expandedNodes');
        if (initExpandedNodes) {
            var nodes = initExpandedNodes.split(',');
            for (var no = 0; no < nodes.length; no++) {
                if (nodes[no])
                    this.showHideNode(false, nodes[no]);
            }
        }
        document.documentElement.onmousemove = window.JSTreeObj.moveDragableNodes;
        document.documentElement.onmouseup = window.JSTreeObj.dropDragableNodes;
    };
    JSDragDropTree.prototype.__addAdditionalRequestParameters = function (ajax, parameters) {
        for (var parameter in parameters) {
            ajax.setVar(parameter, parameters[parameter]);
        }
    };
    return JSDragDropTree;
}());
export default JSDragDropTree;
