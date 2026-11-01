import React from 'react';

// Helper to format inline markdown (bold, italic, inline code)
function formatInlineText(text, darkMode) {
    if (!text) return null;

    // Tokenize inline elements: bold, italic, inline code
    // Patterns:
    // `code`
    // ***bold italic***
    // **bold**
    // *italic*
    const tokens = [];
    const regex = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIdx) {
            tokens.push({ type: 'text', content: text.substring(lastIdx, match.index) });
        }

        const raw = match[0];
        if (raw.startsWith('`') && raw.endsWith('`')) {
            tokens.push({ type: 'code', content: raw.slice(1, -1) });
        } else if (raw.startsWith('***') && raw.endsWith('***')) {
            tokens.push({ type: 'bold_italic', content: raw.slice(3, -3) });
        } else if (raw.startsWith('**') && raw.endsWith('**')) {
            tokens.push({ type: 'bold', content: raw.slice(2, -2) });
        } else if (raw.startsWith('*') && raw.endsWith('*')) {
            tokens.push({ type: 'italic', content: raw.slice(1, -1) });
        } else {
            tokens.push({ type: 'text', content: raw });
        }

        lastIdx = regex.lastIndex;
    }

    if (lastIdx < text.length) {
        tokens.push({ type: 'text', content: text.substring(lastIdx) });
    }

    return tokens.map((token, i) => {
        switch (token.type) {
            case 'bold':
                return (
                    <strong
                        key={i}
                        className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        {token.content}
                    </strong>
                );
            case 'italic':
                return (
                    <em key={i} className="italic opacity-90">
                        {token.content}
                    </em>
                );
            case 'bold_italic':
                return (
                    <strong
                        key={i}
                        className={`font-semibold italic ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        {token.content}
                    </strong>
                );
            case 'code':
                return (
                    <code
                        key={i}
                        className={`px-1.5 py-0.5 rounded text-xs font-mono font-medium ${
                            darkMode ? 'bg-black/40 text-[#25d366]' : 'bg-gray-200 text-[#008f6f]'
                        }`}
                    >
                        {token.content}
                    </code>
                );
            default:
                return <span key={i}>{token.content}</span>;
        }
    });
}

export default function FormattedMessage({ text, darkMode }) {
    if (!text) return null;

    // Split text into lines to process block structures
    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // 1. Code blocks (```lang ... ```)
        if (line.trim().startsWith('```')) {
            const lang = line.trim().slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++; // skip closing ```
            elements.push(
                <div
                    key={`code-${i}`}
                    className={`my-2 rounded-lg overflow-hidden border ${
                        darkMode ? 'border-[#313d45] bg-[#111b21]' : 'border-gray-300 bg-gray-900 text-gray-100'
                    }`}
                >
                    {lang && (
                        <div className="px-3 py-1 text-[11px] font-mono uppercase bg-white/5 border-b border-white/5 text-[#8696a0]">
                            {lang}
                        </div>
                    )}
                    <pre className="p-3 text-xs font-mono overflow-x-auto text-[#25d366] leading-relaxed">
                        <code>{codeLines.join('\n')}</code>
                    </pre>
                </div>
            );
            continue;
        }

        // 2. Headers (# Header, ## Header, ### Header)
        if (line.startsWith('### ')) {
            elements.push(
                <h4
                    key={`h3-${i}`}
                    className="text-xs uppercase font-bold tracking-wider text-[#00a884] mt-2 mb-1"
                >
                    {formatInlineText(line.slice(4).trim(), darkMode)}
                </h4>
            );
            i++;
            continue;
        }
        if (line.startsWith('## ')) {
            elements.push(
                <h3
                    key={`h2-${i}`}
                    className={`text-sm font-bold mt-2 mb-1 ${darkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}
                >
                    {formatInlineText(line.slice(3).trim(), darkMode)}
                </h3>
            );
            i++;
            continue;
        }
        if (line.startsWith('# ')) {
            elements.push(
                <h2
                    key={`h1-${i}`}
                    className={`text-base font-bold mt-2.5 mb-1 ${darkMode ? 'text-[#e9edef]' : 'text-[#111b21]'}`}
                >
                    {formatInlineText(line.slice(2).trim(), darkMode)}
                </h2>
            );
            i++;
            continue;
        }

        // 3. Bullet points (* item, - item, • item)
        const isBullet = /^(\*|-|•)\s+(.*)/.test(line.trim());
        if (isBullet) {
            const listItems = [];
            while (i < lines.length && /^(\*|-|•)\s+(.*)/.test(lines[i].trim())) {
                const itemMatch = lines[i].trim().match(/^(\*|-|•)\s+(.*)/);
                listItems.push(itemMatch[2]);
                i++;
            }
            elements.push(
                <ul key={`ul-${i}`} className="space-y-1 my-1.5 pl-1">
                    {listItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-[#00a884] font-bold select-none">•</span>
                            <span className="flex-1">{formatInlineText(item, darkMode)}</span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // 4. Numbered lists (1. item, 2. item)
        const isNumbered = /^\d+\.\s+(.*)/.test(line.trim());
        if (isNumbered) {
            const listItems = [];
            while (i < lines.length && /^\d+\.\s+(.*)/.test(lines[i].trim())) {
                const itemMatch = lines[i].trim().match(/^(\d+)\.\s+(.*)/);
                listItems.push({ num: itemMatch[1], content: itemMatch[2] });
                i++;
            }
            elements.push(
                <ol key={`ol-${i}`} className="space-y-1 my-1.5 pl-1">
                    {listItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
                            <span className="text-[#00a884] font-semibold text-xs min-w-[16px] select-none">
                                {item.num}.
                            </span>
                            <span className="flex-1">{formatInlineText(item.content, darkMode)}</span>
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // 5. Empty lines (spacing between paragraphs)
        if (!line.trim()) {
            elements.push(<div key={`empty-${i}`} className="h-1.5" />);
            i++;
            continue;
        }

        // 6. Regular paragraph line
        elements.push(
            <p key={`p-${i}`} className="text-sm leading-relaxed my-0.5">
                {formatInlineText(line, darkMode)}
            </p>
        );
        i++;
    }

    return <div className="space-y-0.5">{elements}</div>;
}

