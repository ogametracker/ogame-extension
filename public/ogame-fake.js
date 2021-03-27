
    var curPage = window.location.search.substr(1).split('&').find(x => x.startsWith('page')).split('=')[1];
    var pages = document.querySelectorAll('[id^="page-"]');
    Array.from(pages).filter(p => p.id != `page-${curPage}`).forEach(p => p.remove());