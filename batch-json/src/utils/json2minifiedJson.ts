export function handleZip(str: string) {
    if (!str) {
        return str;
    }
    try {
        JSON.parse(str)
        return compressJson(str).replace('\n', '')
    } catch (e) {
        console.error(e);
        window.$he3.message.warn('请输入 JSON 格式字符');
        return str;
    }
}


function compressJson(json: string) {
    let compressedJson = '';
    let inString = false;
    let inVariable = false;
    for (let i = 0, len = json.length; i < len; i++) {
        const char = json.charAt(i);
        if (inString) {
            if (char === '"' && json.charAt(i - 1) !== '\\') {
                inString = false;
            }
            compressedJson += char;
        } else if (inVariable) {
            if (/[,\}\]]/.test(char)) {
                inVariable = false;
            }
            compressedJson += char;
        } else {
            switch (char) {
                case ' ':
                case '\n':
                case '\r':
                case '\t':
                    break;
                case '"':
                    inString = true;
                    compressedJson += char;
                    break;
                case ':':
                    compressedJson += char;
                    break;
                case ',':
                    compressedJson += char;
                    break;
                case '{':
                case '}':
                case '[':
                case ']':
                    compressedJson += char;
                    break;
                default:
                    inVariable = true;
                    compressedJson += char;
                    break;
            }
        }
    }
    return compressedJson;
}
