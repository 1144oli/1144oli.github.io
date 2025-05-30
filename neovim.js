(function() {
    
    let mode = 'NORMAL';
    let content = '';
    let cursor = 0; 

    const neovimWindow = document.getElementById('neovim-window');
    const modeBar = document.getElementById('neovim-mode-bar');
    const editor = document.getElementById('neovim-editor');
    const commandBar = document.getElementById('neovim-command-bar');
    const commandInput = document.getElementById('neovim-command-input');

    
    neovimWindow.tabIndex = 0;

    function updateEditor() {
        
        let display = content.slice(0, cursor) + '\u2588' + content.slice(cursor);
        editor.textContent = display || '\u200b'; 
    }

    function moveCursor(delta) {
        cursor = Math.max(0, Math.min(content.length, cursor + delta));
    }

    function moveCursorToLineStart() {
        let before = content.slice(0, cursor);
        let lastNewline = before.lastIndexOf('\n');
        cursor = lastNewline + 1;
    }

    function moveCursorToLineEnd() {
        let after = content.slice(cursor);
        let nextNewline = after.indexOf('\n');
        if (nextNewline === -1) {
            cursor = content.length;
        } else {
            cursor += nextNewline;
        }
    }

    function moveCursorWord(forward = true) {
        if (forward) {
            let after = content.slice(cursor);
            let match = after.match(/\w+\b/);
            if (match) cursor += match.index + match[0].length;
            else cursor = content.length;
        } else {
            let before = content.slice(0, cursor);
            let match = before.match(/\b\w+$/);
            if (match) cursor = match.index;
            else cursor = 0;
        }
    }

    function deleteChar() {
        if (cursor < content.length) {
            content = content.slice(0, cursor) + content.slice(cursor + 1);
        }
    }

    neovimWindow.addEventListener('keydown', function(e) {
        
        if (commandBar && commandBar.style.display === 'block') return;

        if (mode === 'NORMAL') {
            switch (e.key) {
                case 'i':
                case 'I':
                    mode = 'INSERT';
                    modeBar.textContent = '-- INSERT --';
                    e.preventDefault();
                    break;
                case 'v':
                case 'V':
                    mode = 'VISUAL';
                    modeBar.textContent = '-- VISUAL --';
                    e.preventDefault();
                    break;
                case 'h':
                    moveCursor(-1);
                    updateEditor();
                    e.preventDefault();
                    break;
                case 'l':
                    moveCursor(1);
                    updateEditor();
                    e.preventDefault();
                    break;
                case 'j': {
                    
                    let before = content.slice(0, cursor);
                    let after = content.slice(cursor);
                    let prevNewline = before.lastIndexOf('\n');
                    let nextNewline = after.indexOf('\n');
                    if (nextNewline !== -1) {
                        let col = cursor - prevNewline - 1;
                        let nextLineStart = cursor + nextNewline + 1;
                        let nextLineEnd = content.indexOf('\n', nextLineStart);
                        if (nextLineEnd === -1) nextLineEnd = content.length;
                        cursor = Math.min(nextLineStart + col, nextLineEnd);
                        updateEditor();
                    }
                    e.preventDefault();
                    break;
                }
                case 'k': {
                    
                    let before = content.slice(0, cursor);
                    let prevNewline = before.lastIndexOf('\n');
                    if (prevNewline !== -1) {
                        let prevPrevNewline = before.lastIndexOf('\n', prevNewline - 1);
                        let col = cursor - prevNewline - 1;
                        let prevLineStart = prevPrevNewline + 1;
                        let prevLineEnd = prevNewline;
                        cursor = Math.min(prevLineStart + col, prevLineEnd);
                        updateEditor();
                    }
                    e.preventDefault();
                    break;
                }
                case '0':
                    moveCursorToLineStart();
                    updateEditor();
                    e.preventDefault();
                    break;
                case '$':
                    moveCursorToLineEnd();
                    updateEditor();
                    e.preventDefault();
                    break;
                case 'w':
                    moveCursorWord(true);
                    updateEditor();
                    e.preventDefault();
                    break;
                case 'b':
                    moveCursorWord(false);
                    updateEditor();
                    e.preventDefault();
                    break;
                case 'x':
                    deleteChar();
                    updateEditor();
                    e.preventDefault();
                    break;
                case ':':
                    
                    if (commandBar && commandInput) {
                        commandBar.style.display = 'block';
                        commandInput.value = '';
                        setTimeout(() => commandInput.focus(), 0);
                    }
                    e.preventDefault();
                    break;
                case 'Escape':
                    mode = 'NORMAL';
                    modeBar.textContent = '-- NORMAL --';
                    e.preventDefault();
                    break;
                
            }
        } else if (mode === 'INSERT') {
            if (e.key === 'Escape') {
                mode = 'NORMAL';
                modeBar.textContent = '-- NORMAL --';
                e.preventDefault();
            } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                
                content = content.slice(0, cursor) + e.key + content.slice(cursor);
                cursor++;
                updateEditor();
                e.preventDefault();
            } else if (e.key === 'Backspace') {
                if (cursor > 0) {
                    content = content.slice(0, cursor - 1) + content.slice(cursor);
                    cursor--;
                    updateEditor();
                }
                e.preventDefault();
            } else if (e.key === 'Enter') {
                content = content.slice(0, cursor) + '\n' + content.slice(cursor);
                cursor++;
                updateEditor();
                e.preventDefault();
            }
        } else if (mode === 'VISUAL') {
            if (e.key === 'Escape') {
                mode = 'NORMAL';
                modeBar.textContent = '-- NORMAL --';
                e.preventDefault();
            }
            
        }
    });

    
    if (commandInput && commandBar) {
        commandInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                commandBar.style.display = 'none';
                neovimWindow.focus();
                e.preventDefault();
            }
            if (e.key === 'Enter') {
                
                const cmd = commandInput.value.trim();
                if (cmd === 'q' || cmd === 'quit') {
                    modeBar.textContent = '-- QUIT (not implemented) --';
                } else if (cmd === 'w' || cmd === 'write') {
                    modeBar.textContent = '-- WRITE (not implemented) --';
                } else {
                    modeBar.textContent = ':' + cmd;
                }
                commandBar.style.display = 'none';
                neovimWindow.focus();
                e.preventDefault();
            }
        });
    }

    

let lastKey = '';
let yankBuffer = '';

neovimWindow.addEventListener('keydown', function(e) {
    if (commandBar && commandBar.style.display === 'block') return;

    if (mode === 'NORMAL') {
        
        if (lastKey === 'd' && e.key === 'd') {
            
            let lines = content.split('\n');
            let lineIdx = content.slice(0, cursor).split('\n').length - 1;
            lines.splice(lineIdx, 1);
            content = lines.join('\n');
            
            let before = lines.slice(0, lineIdx).join('\n');
            cursor = before.length + (lineIdx > 0 ? 1 : 0);
            updateEditor();
            lastKey = '';
            e.preventDefault();
            return;
        }
        if (lastKey === 'y' && e.key === 'y') {
            
            let lines = content.split('\n');
            let lineIdx = content.slice(0, cursor).split('\n').length - 1;
            yankBuffer = lines[lineIdx] || '';
            modeBar.textContent = '-- LINE YANKED --';
            lastKey = '';
            e.preventDefault();
            return;
        }
        lastKey = '';

        switch (e.key) {
            case 'i':
            case 'I':
                mode = 'INSERT';
                modeBar.textContent = '-- INSERT --';
                e.preventDefault();
                break;
            case 'v':
            case 'V':
                mode = 'VISUAL';
                modeBar.textContent = '-- VISUAL --';
                e.preventDefault();
                break;
            case 'h':
                moveCursor(-1);
                updateEditor();
                e.preventDefault();
                break;
            case 'l':
                moveCursor(1);
                updateEditor();
                e.preventDefault();
                break;
            case 'j': {
                let before = content.slice(0, cursor);
                let after = content.slice(cursor);
                let prevNewline = before.lastIndexOf('\n');
                let nextNewline = after.indexOf('\n');
                if (nextNewline !== -1) {
                    let col = cursor - prevNewline - 1;
                    let nextLineStart = cursor + nextNewline + 1;
                    let nextLineEnd = content.indexOf('\n', nextLineStart);
                    if (nextLineEnd === -1) nextLineEnd = content.length;
                    cursor = Math.min(nextLineStart + col, nextLineEnd);
                    updateEditor();
                }
                e.preventDefault();
                break;
            }
            case 'k': {
                let before = content.slice(0, cursor);
                let prevNewline = before.lastIndexOf('\n');
                if (prevNewline !== -1) {
                    let prevPrevNewline = before.lastIndexOf('\n', prevNewline - 1);
                    let col = cursor - prevNewline - 1;
                    let prevLineStart = prevPrevNewline + 1;
                    let prevLineEnd = prevNewline;
                    cursor = Math.min(prevLineStart + col, prevLineEnd);
                    updateEditor();
                }
                e.preventDefault();
                break;
            }
            case '0':
                moveCursorToLineStart();
                updateEditor();
                e.preventDefault();
                break;
            case '$':
                moveCursorToLineEnd();
                updateEditor();
                e.preventDefault();
                break;
            case 'w':
                moveCursorWord(true);
                updateEditor();
                e.preventDefault();
                break;
            case 'b':
                moveCursorWord(false);
                updateEditor();
                e.preventDefault();
                break;
            case 'x':
                deleteChar();
                updateEditor();
                e.preventDefault();
                break;
            case ':':
                if (commandBar && commandInput) {
                    commandBar.style.display = 'block';
                    commandInput.value = '';
                    setTimeout(() => commandInput.focus(), 0);
                }
                e.preventDefault();
                break;
            case 'd':
                lastKey = 'd';
                setTimeout(() => { lastKey = ''; }, 500);
                e.preventDefault();
                break;
            case 'y':
                lastKey = 'y';
                setTimeout(() => { lastKey = ''; }, 500);
                e.preventDefault();
                break;
            case 'p':
                
                if (yankBuffer !== '') {
                    let lines = content.split('\n');
                    let lineIdx = content.slice(0, cursor).split('\n').length - 1;
                    lines.splice(lineIdx + 1, 0, yankBuffer);
                    content = lines.join('\n');
                    
                    let before = lines.slice(0, lineIdx + 1).join('\n');
                    cursor = before.length + 1;
                    updateEditor();
                }
                e.preventDefault();
                break;
            case 'Escape':
                mode = 'NORMAL';
                modeBar.textContent = '-- NORMAL --';
                e.preventDefault();
                break;
        }
    } else if (mode === 'INSERT') {
        if (e.key === 'Escape') {
            mode = 'NORMAL';
            modeBar.textContent = '-- NORMAL --';
            e.preventDefault();
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            content = content.slice(0, cursor) + e.key + content.slice(cursor);
            cursor++;
            updateEditor();
            e.preventDefault();
        } else if (e.key === 'Backspace') {
            if (cursor > 0) {
                content = content.slice(0, cursor - 1) + content.slice(cursor);
                cursor--;
                updateEditor();
            }
            e.preventDefault();
        } else if (e.key === 'Enter') {
            content = content.slice(0, cursor) + '\n' + content.slice(cursor);
            cursor++;
            updateEditor();
            e.preventDefault();
        }
    } else if (mode === 'VISUAL') {
        if (e.key === 'Escape') {
            mode = 'NORMAL';
            modeBar.textContent = '-- NORMAL --';
            e.preventDefault();
        }
    }
});


if (commandInput && commandBar) {
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            commandBar.style.display = 'none';
            neovimWindow.focus();
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            const cmd = commandInput.value.trim();
            if (
                cmd === 'q' || cmd === 'quit' || cmd === 'qa' || cmd === 'q!' ||
                cmd === 'wq' || cmd === 'x'
            ) {
                
                neovimWindow.style.display = 'none';
                modeBar.textContent = '-- QUIT --';
            } else if (cmd === 'w' || cmd === 'write') {
                modeBar.textContent = '-- WRITE (not implemented) --';
            } else {
                modeBar.textContent = ':' + cmd;
            }
            commandBar.style.display = 'none';
            neovimWindow.focus();
            e.preventDefault();
        }
    });
}


    neovimWindow.addEventListener('click', function() {
        if (!commandBar || commandBar.style.display !== 'block') neovimWindow.focus();
    });
    const observer = new MutationObserver(() => {
        if (neovimWindow.style.display !== 'none') {
            neovimWindow.focus();
            editor.focus();
        }
    });
    observer.observe(neovimWindow, { attributes: true, attributeFilter: ['style'] });
    updateEditor();
})();