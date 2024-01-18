var Notifier = (function () {
    function Notifier() {
        this.toCover = true;
        this.htmlCode = "";
        this.toCover = true;
        this.expiration = 18000;
        this.imageSrc = null;
    }
    Notifier.prototype.setCover = function () {
        var cover = document.getElementById("empty_cover");
        if (cover == null) {
            cover = document.createElement("div");
            cover.setAttribute("id", "empty_cover");
            document.body.appendChild(cover);
        }
        cover.style.display = "block";
        document.getElementsByTagName('html')[0].style.overflowY = "hidden";
        document.getElementsByTagName('body')[0].style.overflowY = "hidden";
    };
    Notifier.prototype.unsetCover = function () {
        document.getElementsByTagName('html')[0].style.overflowY = "visible";
        document.getElementsByTagName('body')[0].style.overflowY = "visible";
        var cover = document.getElementById("empty_cover");
        if (cover != null) {
            cover.style.display = "none";
            cover.remove();
        }
    };
    Notifier.prototype.createNotifBox = function () {
        var notifBox = document.getElementById("notif_box");
        if (notifBox == null) {
            notifBox = document.createElement("div");
            notifBox.setAttribute("id", "notif_box");
            document.body.appendChild(notifBox);
        }
    };
    Notifier.prototype.deleteNotifBox = function () {
        var notifBox = document.getElementById("notif_box");
        if (notifBox != null) {
            notifBox.style.display = "none";
            document.getElementById("empty_cover").remove();
        }
    };
    Notifier.prototype.notif = function (htmlCode, toCover, expiration) {
        var _this = this;
        if (toCover === void 0) { toCover = true; }
        var exp = expiration === undefined ? 1800000 : expiration;
        if (toCover)
            this.setCover();
        this.createNotifBox();
        var notifBox = document.getElementById("notif_box");
        notifBox.innerHTML = htmlCode + "<br><button id='btnClose_notif_box'> &times; </button>";
        this.fadeIn(notifBox, "block");
        document.getElementById("btnClose_notif_box").addEventListener("click", function () { return _this.removeNotif(toCover); });
        setTimeout(function () { return _this.removeNotif(toCover); }, exp);
    };
    Notifier.prototype.removeNotif = function (cover) {
        this.fadeOut(document.getElementById("notif_box"));
        this.deleteNotifBox();
        if (cover)
            this.unsetCover();
    };
    Notifier.prototype.enableClick = function (element) {
        element.style.pointerEvents = 'auto';
    };
    Notifier.prototype.disableClick = function (element) {
        element.style.pointerEvents = 'none';
    };
    Notifier.prototype.fadeOut = function (el) {
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= .1) < 0)
                el.style.display = "none";
            else
                requestAnimationFrame(fade);
        })();
    };
    ;
    Notifier.prototype.fadeIn = function (el, display) {
        el.style.opacity = 0;
        el.style.display = display || "block";
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    };
    ;
    return Notifier;
}());
export default Notifier;
