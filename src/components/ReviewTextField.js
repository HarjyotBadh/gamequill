import React, { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import styles
import "../styles/ReviewTextField.css";

class SpoilerBlot extends Quill.import("blots/inline") {
    static create() {
        let node = super.create();
        node.setAttribute("class", "spoiler-effect");
        return node;
    }

    static formats(node) {
        return node.getAttribute("class") === "spoiler-effect";
    }
}
SpoilerBlot.blotName = "spoiler";
SpoilerBlot.tagName = "span";

Quill.register(SpoilerBlot);

export default function ReviewTextField({ reviewText, setReviewText }) {
    const [editorHtml, setEditorHtml] = useState(reviewText);
    const maxLength = 5000;

    const handleChange = (content) => {
        setEditorHtml(content);
        setReviewText(content);
    };

    const getTextFromHtml = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    const textLength = getTextFromHtml(editorHtml).length;

    /**
     * This function handles the spoiler formatting when the user clicks on the spoiler button in the toolbar.
     * It gets the current selection range and checks if any text is selected. If text is selected, it checks if the selected text is already formatted as a spoiler.
     * If it is, it removes the spoiler formatting. If it isn't, it adds the spoiler formatting.
     * @param {Object} quill - The Quill instance being used in the component.
     */
    const handleSpoiler = (quill) => {
      const range = quill.getSelection();
      if (range && range.length > 0) {
          // If some text is selected
          const isSpoiler = quill.getFormat(range).spoiler;
          quill.format("spoiler", !isSpoiler);
      }
    };

    const modules = {
        toolbar: {
            container: [["bold", "italic", "underline", "clean"], ["spoiler"]],
        },
    };

    useEffect(() => {
        let toolbar = Quill.import("modules/toolbar");
        toolbar.DEFAULTS.handlers["spoiler"] = function () {
            handleSpoiler(this.quill);
        };

    }, []);

    return (
        <div className="review-text-field-container">
            <ReactQuill
                value={editorHtml}
                onChange={handleChange}
                modules={modules}
                className="review-text-field"
                formats={[
                    "header",
                    "font",
                    "list",
                    "bold",
                    "italic",
                    "underline",
                    "align",
                    "clean",
                    "spoiler",
                ]}
            />

<div
                className={`review-character-count ${
                    textLength > maxLength ? "error-text" : ""
                }`}
            >
                {textLength} / {maxLength}
            </div>
        </div>
    );
}
