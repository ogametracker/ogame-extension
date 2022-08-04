export function downloadFile(filename: string, content: string, type = 'data:text/plain;chartset=utf-8'): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();

    window.URL.revokeObjectURL(url);
}