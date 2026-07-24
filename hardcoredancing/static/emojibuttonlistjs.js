function emojiButtonList_Initialize(attachToID, options) {
    return new emojiButtonList(attachToID,options);
}
function emojiButtonList(attachTo, options) {
    console.log('emojiButtonList');
    var _options = {}
      , _elements = {}
      , _elementTypes = {}
      , _document = null
      , _window = null
      , _this = this
      , _element_Attached = null
      , _element_TextBox = null
      , _element_DropDownMenu = null;
    function build() {
        _element_DropDownMenu = document.createElement("div");
        _element_DropDownMenu.className = "emoji-drop-down custom-scroll-bars";
        _element_DropDownMenu.style.display = "none";
        _document.body.appendChild(_element_DropDownMenu);
        var emojiRangesToShowLength = _options.emojiRangesToShow.length;
        for (var emojiRangeIndex = 0; emojiRangeIndex < emojiRangesToShowLength; emojiRangeIndex++) {
            var range = _options.emojiRangesToShow[emojiRangeIndex];
            for (var rangeIndex = range[0]; rangeIndex < range[1]; rangeIndex++) {
                buildClickableEmoji(rangeIndex);
            }
        }
        _document.body.addEventListener("click", hideDropDown);
        _window.addEventListener("resize", hideDropDown);
        _element_Attached.addEventListener("click", showDropDown);
    }
    function buildClickableEmoji(rangeIndex) {
        var emojiText = "&#" + rangeIndex + ";";
        var emojiInsertHTML = createElement("div");
        emojiInsertHTML.innerHTML = emojiText;
        var emoji = createElement("div");
        emoji.className = "emoji";
        emoji.innerHTML = emojiText;
        _element_DropDownMenu.appendChild(emoji);
        emoji.onclick = function() {
            if (_element_TextBox !== null && !triggerIsDefined("onEmojiClick")) {
                insertTextAtCaretPosition(emojiInsertHTML.innerHTML);
            } else {
                triggerOptionsEventWithData("onEmojiClick", emojiInsertHTML.innerHTML);
            }
        }
        ;
    }
    function showDropDown(e) {
        console.log('click!');
        cancelBubble(e);
        if (!isDropDownDisplayVisible()) {
            changeDropDownDisplayState("block");
            var offset = getOffset(_element_Attached)
              , left = getNewLeftPosition(offset.left)
              , top = getNewTopPosition(offset.top);
            _element_DropDownMenu.style.top = top + "px";
            _element_DropDownMenu.style.left = left + "px";
        } else {
            changeDropDownDisplayState("none");
        }
    }
    function hideDropDown() {
        changeDropDownDisplayState("none");
    }
    function changeDropDownDisplayState(state) {
        if (_element_DropDownMenu.style.display !== state) {
            _element_DropDownMenu.style.display = state;
        }
    }
    function isDropDownDisplayVisible() {
        return _element_DropDownMenu.style.display === "block";
    }
    function getNewLeftPosition(left) {
        var newLeft = left + _options.xAlignMargin;
        if (_options.dropDownXAlign === "center") {
            newLeft = left - ((_element_DropDownMenu.offsetWidth / 2) - (_element_Attached.offsetWidth / 2));
        }
        if (newLeft + _element_DropDownMenu.offsetWidth > _window.innerWidth || _options.dropDownXAlign === "right") {
            newLeft = left - (_element_DropDownMenu.offsetWidth - _element_Attached.offsetWidth) - _options.xAlignMargin;
        }
        if (newLeft < _options.xAlignMargin) {
            newLeft = _options.xAlignMargin;
        }
        return newLeft;
    }
    function getNewTopPosition(top) {
        var newTop = top + _element_Attached.offsetHeight + _options.yAlignMargin;
        if ((newTop + _element_DropDownMenu.offsetHeight) > _window.innerHeight || _options.dropDownYAlign === "top") {
            newTop = top - (_element_DropDownMenu.offsetHeight + _options.yAlignMargin);
        }
        if (newTop < _options.yAlignMargin) {
            newTop = _options.yAlignMargin;
        }
        return newTop;
    }
    function createElement(type) {
        var result = null
          , nodeType = type == null ? "div" : type.toLowerCase()
          , isText = nodeType === "text";
        if (!_elementTypes.hasOwnProperty(nodeType)) {
            _elementTypes[nodeType] = isText ? _document.createTextNode("") : _document.createElement(nodeType);
        }
        result = _elementTypes[nodeType].cloneNode(false);
        return result;
    }
    function getElementByID(id) {
        var element = null;
        if (isDefined(id)) {
            if (!_elements.hasOwnProperty(id) || _elements[id] === null) {
                _elements[id] = _document.getElementById(id);
            }
            element = _elements[id];
        }
        return element;
    }
    function getOffset(element) {
        var left = 0
          , top = 0;
        while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
            left += element.offsetLeft - element.scrollLeft;
            top += element.offsetTop - element.scrollTop;
            element = element.offsetParent;
        }
        return {
            left: left,
            top: top
        };
    }
    function insertTextAtCaretPosition(text) {
        if (_document.selection) {
            _element_TextBox.focus();
            var selection = _document.selection.createRange();
            selection.text = text;
            _element_TextBox.focus();
        } else if (_element_TextBox.selectionStart || _element_TextBox.selectionStart === 0) {
            var selectionStart = _element_TextBox.selectionStart
              , selectionEnd = _element_TextBox.selectionEnd
              , scrollTop = _element_TextBox.scrollTop;
            _element_TextBox.value = _element_TextBox.value.substring(0, selectionStart) + text + _element_TextBox.value.substring(selectionEnd, _element_TextBox.value.length);
            _element_TextBox.focus();
            _element_TextBox.selectionStart = selectionStart + text.length;
            _element_TextBox.selectionEnd = selectionStart + text.length;
            _element_TextBox.scrollTop = scrollTop;
        } else {
            _element_TextBox.value += text;
            _element_TextBox.focus();
        }
    }
    function cancelBubble(e) {
        e.preventDefault();
        e.cancelBubble = true;
    }
    function triggerOptionsEventWithData(name, data) {
        if (triggerIsDefined(name)) {
            _options[name](data);
        }
    }
    function triggerIsDefined(name) {
        return _options !== null && isDefined(_options[name]) && isFunction(_options[name]);
    }
    function isDefined(data) {
        return data !== undefined && data !== null && data !== "";
    }
    function isFunction(object) {
        return typeof object === "function";
    }
    this.setOptions = function(newOptions) {
        if (newOptions !== null && typeof newOptions === "object") {
            _options = newOptions;
        } else {
            _options = {};
        }
        if (!isDefined(_options.emojiRangesToShow)) {
            _options.emojiRangesToShow = [[128513, 128591], [9986, 10160], [128640, 128704]];
        }
        if (!isDefined(_options.dropDownXAlign)) {
            _options.dropDownXAlign = "left";
        }
        if (!isDefined(_options.dropDownYAlign)) {
            _options.dropDownYAlign = "bottom";
        }
        if (!isDefined(_options.textBoxID)) {
            _options.textBoxID = null;
        }
        if (!isDefined(_options.xAlignMargin)) {
            _options.xAlignMargin = 0;
        }
        if (!isDefined(_options.yAlignMargin)) {
            _options.yAlignMargin = 0;
        }
    }
    ;
    (function(documentObject, windowObject) {
        options = !isDefined(options) ? {} : options;
        _document = documentObject;
        _window = windowObject;
        _this.setOptions(options);
        // _element_Attached = getElementByID(attachToID);
        _element_Attached = attachTo;
        console.log(_element_Attached);
        _element_TextBox = getElementByID(_options.textBoxID);
        build();
        console.log('done building!');
    }
    )(document, window);
}

window.showEmojiPicker = function(bandName, review, callback) {
    var TAB_ICONS = {
        'Smileys & Emotion': '😀',
        'People & Body': '🤚',
        'Animals & Nature': '🐶',
        'Food & Drink': '🍔',
        'Travel & Places': '🗺️',
        'Activities': '⚽',
        'Objects': '💡',
        'Symbols': '🔣',
        'Flags': '🏁',
    };

    var backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:1000;display:flex;align-items:center;justify-content:center;';

    var picker = document.createElement('div');
    picker.className = 'emoji-drop-down custom-scroll-bars';
    picker.style.cssText = 'display:flex;flex-direction:column;position:relative;width:90vw;max-width:90vw;height:70vh;overflow:hidden;';

    var header = document.createElement('div');
    header.style.cssText = 'font-weight:bold;font-size:14pt;border-bottom:1px solid #282828;padding-bottom:4px;margin-bottom:4px;flex-shrink:0;';
    header.textContent = bandName;
    picker.appendChild(header);

    if (review) {
        var rev = document.createElement('div');
        rev.style.cssText = 'font-size:10pt;font-style:italic;margin-bottom:4px;flex-shrink:0;';
        rev.textContent = review;
        picker.appendChild(rev);
    }

    var tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex;flex-wrap:wrap;border-bottom:1px solid #ccc;margin-bottom:4px;flex-shrink:0;';
    picker.appendChild(tabBar);

    var grid = document.createElement('div');
    grid.style.cssText = 'flex:1;overflow-y:auto;text-align:center;white-space:normal;';
    grid.textContent = '⏳';
    picker.appendChild(grid);

    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'search…';
    search.style.cssText = 'width:100%;box-sizing:border-box;padding:4px 6px;margin-bottom:4px;font-size:12pt;border:1px solid #ccc;border-radius:4px;flex-shrink:0;background:#f5f5f5;color:#282828;outline:none;';
    picker.appendChild(search);

    function makeEmojiBtn(item) {
        var btn = document.createElement('div');
        btn.className = 'emoji';
        btn.textContent = item.char;
        btn.title = item.name;
        btn.onclick = function(e) {
            e.stopPropagation();
            document.body.removeChild(backdrop);
            callback(item.char);
        };
        return btn;
    }

    function renderCat(cat, activeTab) {
        search.value = '';
        grid.innerHTML = '';
        grid.scrollTop = 0;
        tabBar.querySelectorAll('span').forEach(function(t) {
            t.style.borderBottom = '2px solid transparent';
            t.style.opacity = '0.5';
            delete t.dataset.active;
        });
        activeTab.style.borderBottom = '2px solid #282828';
        activeTab.style.opacity = '1';
        activeTab.dataset.active = '1';
        cat.emojis.forEach(function(item) { grid.appendChild(makeEmojiBtn(item)); });
    }

    search.oninput = function(e) {
        e.stopPropagation();
        var term = search.value.trim().toLowerCase();
        grid.innerHTML = '';
        grid.scrollTop = 0;
        if (!term) {
            var activeTab = tabBar.querySelector('[data-active]');
            if (activeTab) activeTab.click();
            return;
        }
        window._emojiData.forEach(function(cat) {
            cat.emojis.forEach(function(item) {
                if (item.name.indexOf(term) !== -1) grid.appendChild(makeEmojiBtn(item));
            });
        });
    };
    search.onclick = function(e) { e.stopPropagation(); };

    function buildTabs(categories) {
        var firstTab = null;
        categories.forEach(function(cat, i) {
            var tab = document.createElement('span');
            tab.textContent = TAB_ICONS[cat.name] || cat.emojis[0].char || '?';
            tab.title = cat.name;
            tab.style.cssText = 'flex:1;text-align:center;padding:4px 2px;cursor:pointer;font-size:16pt;border-bottom:2px solid transparent;opacity:0.5;';
            tab.onclick = function(e) { e.stopPropagation(); renderCat(cat, tab); };
            tabBar.appendChild(tab);
            if (i === 0) firstTab = tab;
        });
        if (firstTab) renderCat(categories[0], firstTab);
    }

    picker.onclick = function(e) { e.stopPropagation(); };
    backdrop.onclick = function() { document.body.removeChild(backdrop); };
    backdrop.appendChild(picker);
    document.body.appendChild(backdrop);

    if (window._emojiData) {
        buildTabs(window._emojiData);
    } else {
        fetch('/emojis')
            .then(function(r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.json();
            })
            .then(function(data) {
                if (!Array.isArray(data)) throw new Error('unexpected response');
                window._emojiData = data;
                buildTabs(data);
            })
            .catch(function(err) {
                grid.textContent = '❌ ' + err.message;
            });
    }
};
