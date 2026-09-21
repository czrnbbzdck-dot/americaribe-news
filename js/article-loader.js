(function () {
    "use strict";

    var article = document.querySelector(".article-detail");
    var message = document.querySelector(".article-loader-message");
    var params = new URLSearchParams(window.location.search);
    var articleId = params.get("id");

    function showMessage(text) {
        message.textContent = text;
        message.hidden = false;
        article.hidden = true;
    }

    function fieldValue(record, field) {
        var element = record.querySelector('[data-field="' + field + '"]');
        return element ? element.textContent.trim() : "";
    }

    function setField(field, value) {
        var element = article.querySelector('[data-field="' + field + '"]');
        if (element) {
            element.textContent = value;
        }
    }

    function setMetadata(record) {
        var id = record.documentElement.querySelector('meta[name="article-id"]');
        var status = record.documentElement.querySelector('meta[name="article-status"]');
        var type = record.documentElement.querySelector('meta[name="article-type"]');

        article.setAttribute("data-article-id", id ? id.content : fieldValue(record, "id"));
        article.setAttribute("data-article-status", status ? status.content : fieldValue(record, "status"));
        article.setAttribute("data-article-type", type ? type.content : fieldValue(record, "type"));
    }

    function setBody(record) {
        var target = article.querySelector('[data-field="body"]');
        var source = record.querySelector('[data-field="body"]');
        var heading = target.querySelector("h2");

        while (target.lastChild && target.lastChild !== heading) {
            target.removeChild(target.lastChild);
        }

        if (source) {
            source.querySelectorAll("p").forEach(function (sourceParagraph) {
                var paragraph = document.createElement("p");
                paragraph.textContent = sourceParagraph.textContent.trim();
                target.appendChild(paragraph);
            });
        }
    }

    function setSource(record) {
        var sourceSection = record.querySelector('[data-field="source"]');
        var sourceTarget = article.querySelector('[data-field="source"]');
        var sourceUrlTarget = article.querySelector('[data-field="sourceUrl"] dd');
        var sourceTextTarget = sourceTarget ? sourceTarget.querySelector("dd") : null;
        var sourceUrl = sourceSection ? sourceSection.querySelector('[data-field="sourceUrl"] a') : null;

        if (sourceTextTarget) {
            sourceTextTarget.textContent = sourceSection ? sourceSection.querySelector("p").textContent.trim() : "";
        }

        if (sourceUrlTarget) {
            sourceUrlTarget.textContent = "";
            if (sourceUrl && sourceUrl.href) {
                var link = document.createElement("a");
                link.href = sourceUrl.href;
                link.textContent = sourceUrl.href;
                sourceUrlTarget.appendChild(link);
            }
        }
    }

    function setOptionalMedia(record) {
        var imageTarget = article.querySelector('[data-field="heroImage"]');
        var captionTarget = article.querySelector('[data-field="imageCaption"]');
        var creditTarget = article.querySelector('[data-field="imageCredit"]');
        var image = record.querySelector('[data-field="heroImage"] img');
        var caption = fieldValue(record, "imageCaption");
        var credit = fieldValue(record, "imageCredit");

        if (imageTarget) {
            imageTarget.textContent = "";
            imageTarget.setAttribute("aria-label", image ? "Article hero image" : "No verified hero image available");
            if (image && image.src) {
                var imageElement = document.createElement("img");
                imageElement.src = image.src;
                imageElement.alt = image.alt || "";
                imageTarget.appendChild(imageElement);
            }
        }
        if (captionTarget) captionTarget.textContent = caption;
        if (creditTarget) creditTarget.textContent = credit;
    }

    function setRelatedStories(record) {
        var target = article.querySelector('[data-field="relatedStories"]');
        var source = record.querySelector('[data-field="relatedStories"]');
        if (!target) return;
        target.textContent = "";
        if (source) {
            source.querySelectorAll("li").forEach(function (item) {
                var listItem = document.createElement("li");
                listItem.textContent = item.textContent.trim();
                if (listItem.textContent) target.appendChild(listItem);
            });
        }
    }

    function setTags(record) {
        var target = article.querySelector('[data-field="tags"]');
        var source = record.querySelector('[data-field="tags"]');
        if (!target) return;
        target.textContent = "";
        if (source) {
            source.querySelectorAll("li").forEach(function (item) {
                var listItem = document.createElement("li");
                listItem.textContent = item.textContent.trim();
                if (listItem.textContent) target.appendChild(listItem);
            });
        }
    }

    function populate(record) {
        ["category", "type", "headline", "summary", "id", "date", "status", "subcategory", "time", "location", "author"].forEach(function (field) {
            setField(field, fieldValue(record, field));
        });
        setMetadata(record);
        setBody(record);
        setSource(record);
        setOptionalMedia(record);
        setRelatedStories(record);
        setTags(record);
        document.title = fieldValue(record, "headline") + " | AmeriCaribe News";
        message.hidden = true;
        article.hidden = false;
    }

    if (!article || !message) return;
    if (!articleId) {
        showMessage("Article not specified.");
        return;
    }
    if (!/^[a-z0-9-]+$/.test(articleId)) {
        showMessage("Article not found.");
        return;
    }

    fetch("articles/" + encodeURIComponent(articleId) + ".html")
        .then(function (response) {
            if (!response.ok) throw new Error("Article not found");
            return response.text();
        })
        .then(function (html) {
            var record = new DOMParser().parseFromString(html, "text/html");
            var recordArticle = record.querySelector("article[data-article-id]");
            if (!recordArticle || recordArticle.getAttribute("data-article-id") !== articleId) {
                throw new Error("Article not found");
            }
            populate(record);
        })
        .catch(function () {
            showMessage("Article not found.");
        });
}());
