const waitForDocumentLoad = new Promise<void>(resolve => {
    const listener = () => {
        window.removeEventListener('load', listener);
        resolve();
    };
    
    window.addEventListener('load', listener);
});

export default waitForDocumentLoad;
