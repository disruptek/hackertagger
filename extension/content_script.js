var ht = {
    'elements': {},
    'usernames': []
};

var elements = document.querySelectorAll('a[href*="user?id="]');
for (var i = 1; i < elements.length; i++) {
    (function() {
        var element = elements[i];
        var username = element.textContent;

        var set = ht.elements[username];
        if (!set) {
            ht.elements[username] = [element];
            ht.usernames.push(username);
        } else {
            set.push(element);
        }
    })();
}

chrome.storage.sync.get(ht.usernames, function(items) {
    ht.usernames.map(function(username) {
        var tag = items[username];
        var elements = ht.elements[username];
        elements.map(function(element) {
            var link = tagElement(element, username, tag);

            var divider = document.createElement('span');
            divider.innerHTML = ' |';

            element.parentNode.insertBefore(link, element.nextSibling);
            element.parentNode.insertBefore(divider, link.nextSibling);
        });
    });
});

var tagElement = function(element, username, tag) {
    var link = document.createElement('a');
    link.className = 'hackertagger-tag';

    link.textContent = ' ' + (tag ? '- ' + tag : '+');

    link.onclick = function() {
        editTag(element, username, tag);
    };

    return link;
};

function editTag(element, username, tag) {
    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'hackertagger-textinput';
    input.value = tag || '';

    element.parentNode.replaceChild(input, element.nextSibling);
    input.focus();

    input.onkeyup = function(e) {
        if (e.keyCode == 13) {
            input.blur();
        } else if (e.keyCode == 27) {
            input.value = tag || '';
            input.blur();
        }
    };

    input.onblur = function() {
        var tag = input.value.trim();
        if (tag) {
            var items = { };
            items[username] = tag;
            chrome.storage.sync.set(items);
        } else {
            chrome.storage.sync.remove(username);
        }

        element.parentNode.replaceChild(tagElement(element, username, tag), input);
    };
};

var keys = Object.keys(localStorage);
if (keys && !localStorage.transitioned) {
    var items = { };

    keys.map(function(key) {
        var username = key.split('_tag')[0];
        username = username.replace('<font color="#cd6e00">', '');
        username = username.replace('</font>', '');
        items[username] = localStorage[key];
    });

    chrome.storage.sync.set(b);

    localStorage.transitioned = true;
}
