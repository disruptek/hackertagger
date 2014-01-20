var removeHtmlRegex = /(<([^>]+)>)/ig;

var userElements = document.querySelectorAll('a[href*="user?id="]');
for (var i = 1; i < userElements.length; i++) {
    var userElement = userElements[i];
    var username = userElement.innerHTML.trim().replace(removeHtmlRegex, '');

    (function(username, i) {
        var tagLink = getTagLink(username, i);

        var dividerSpan = document.createElement('span');
        dividerSpan.innerHTML = ' |';

        userElement.parentNode.insertBefore(tagLink, userElement.nextSibling);
        userElement.parentNode.insertBefore(dividerSpan, tagLink.nextSibling);
    })(username, i);
}

function editTag(username, i) {
    var userElement = userElements[i];

    var tagTextInput = document.createElement('input');
    tagTextInput.type = 'text';
    tagTextInput.className = 'hackertagger-textinput';

    var existingTag = getExistingTag(username);
    if (existingTag) {
        tagTextInput.value = existingTag;
    }

    userElement.parentNode.replaceChild(tagTextInput, userElement.nextSibling);
    tagTextInput.focus();
    tagTextInput.onkeyup = function(e) {
        if (e.keyCode == 13){
            tagTextInput.onblur = null;
            done();
        } else if (e.keyCode == 27) {
            tagTextInput.onblur = null;
            if (existingTag) {
                tagTextInput.value = existingTag;
            } else {
                tagTextInput.value = '';
            }
            done();
        }
    }
    tagTextInput.onblur = function() {
        done();
    }

    function done(tag) {
        var tag = tagTextInput.value.trim();
        if (tag.length > 0) {
            localStorage[username + '_tag'] = tag;
        } else {
            delete localStorage[username + '_tag'];
        }

        userElement.parentNode.replaceChild(getTagLink(username, i), tagTextInput);
    }
}

function getTagLink(username, i) {
    var tagLink = document.createElement('a');

    var existingTag = getExistingTag(username);
    if (existingTag) {
        tagLink.innerHTML = '<a class="hackertagger-tag"> - ' + existingTag + '</a>';
    } else {
        tagLink.innerHTML = '<a class="hackertagger-tag"> +</a>';
    }

    tagLink.onclick = function() {
        editTag(username, i);
    }

    return tagLink;
}

function getExistingTag(username) {
    return localStorage[username + '_tag'];
}
