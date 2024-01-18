var Style = (function () {
    function Style() {
    }
    Style.prototype.addNavListeners = function (bodyElt, sidebar, sidebarToggle, modeToggle) {
        var getMode = localStorage.getItem("mode");
        if (getMode && getMode === "dark") {
            bodyElt.classList.toggle("dark");
        }
        var getStatus = localStorage.getItem("status");
        if (getStatus && getStatus === "close") {
            bodyElt.classList.toggle("close");
        }
        modeToggle.addEventListener("click", function () {
            bodyElt.classList.toggle("dark");
            if (bodyElt.classList.contains("dark")) {
                localStorage.setItem("mode", "dark");
            }
            else {
                localStorage.setItem("mode", "light");
            }
        });
        sidebarToggle.addEventListener("click", function () {
            sidebar.classList.toggle("close");
            if (sidebar.classList.contains("close")) {
                localStorage.setItem("status", "close");
            }
            else {
                localStorage.setItem("status", "open");
            }
        });
    };
    Style.prototype.handleScroll = function (e) {
        if (e == null || e.target == null)
            throw new Error('DOM Element missing');
        var targetContainer = e.target;
        if (targetContainer.classList.contains("on-scrollbar") === false) {
            targetContainer.classList.add("on-scrollbar");
        }
    };
    Style.prototype.initApplication = function () {
        var _this = this;
        window.addEventListener("DOMContentLoaded", function (event) {
            var body = document.querySelector("body");
            var sidebar = document.querySelector("nav");
            var modeToggle = document.querySelector(".mode-toggle");
            var sidebarToggle = document.querySelector(".sidebar-toggle");
            if (body == null || sidebar == null || modeToggle == null || sidebarToggle == null)
                throw new Error('DOM Element missing');
            _this.addNavListeners(body, sidebar, sidebarToggle, modeToggle);
        });
        window.addEventListener('scroll', function (event) { _this.handleScroll(event); }, true);
    };
    return Style;
}());
export default Style;
