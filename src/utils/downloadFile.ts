const downLoadFile = (blob: any,fileName: string)=> {
    const createObjectURL = (object: any) => { return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object); }
const filename = fileName;  // 这里的名字，可以按后端给的接口固定表单设置一下名字，如（费用单.xlsx,合同.doc等等）
const a = document.createElement('a');
const url = createObjectURL(blob);
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
window.URL.revokeObjectURL(url);
}
export default downLoadFile
