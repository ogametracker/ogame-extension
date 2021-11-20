export default function download(filename: string, content: string): void {
    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', `data:test/plain;charset=utf-8,${encodeURIComponent(content)}`);
    
    link.click();
}