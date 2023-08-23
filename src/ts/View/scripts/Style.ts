

export default class Style {

  public addNavListeners(bodyElt:HTMLElement, sidebar:HTMLElement, sidebarToggle:HTMLElement, modeToggle:HTMLElement): void 
  {
    let getMode = localStorage.getItem("mode");
    if (getMode && getMode === "dark") {
      bodyElt.classList.toggle("dark");
    }

    let getStatus = localStorage.getItem("status");
    if (getStatus && getStatus === "close") {
      bodyElt.classList.toggle("close");
    }

    modeToggle.addEventListener("click", () => {
      bodyElt.classList.toggle("dark");
      if (bodyElt.classList.contains("dark")) {
        localStorage.setItem("mode", "dark");
      } else {
        localStorage.setItem("mode", "light");
      }
    });

    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("close");
      if (sidebar.classList.contains("close")) {
        localStorage.setItem("status", "close");
      } else {
        localStorage.setItem("status", "open");
      }
    });
  }


  public handleScroll(e:Event): void 
  {
    if(e==null || e.target==null) throw new Error('DOM Element missing');
    const targetContainer: HTMLElement = e.target as HTMLElement;
    if (targetContainer.classList.contains("on-scrollbar") === false) {
      targetContainer.classList.add("on-scrollbar");
    }
  }

  public initApplication(): void 
  {
    window.addEventListener("DOMContentLoaded", (event) => {
      const body = document.querySelector<HTMLElement>("body");
      const sidebar = document.querySelector<HTMLElement>("nav");
      const modeToggle = document.querySelector<HTMLElement>(".mode-toggle");
      const sidebarToggle = document.querySelector<HTMLElement>(".sidebar-toggle");

      if(body==null || sidebar==null || modeToggle==null || sidebarToggle==null) throw new Error('DOM Element missing');

      this.addNavListeners(body, sidebar, sidebarToggle, modeToggle);
    });
    window.addEventListener('scroll', (event) => {this.handleScroll(event)}, true);
  }

}