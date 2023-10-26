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
        // if (content.length <= maxLength) {
            setEditorHtml(content);
            setReviewText(content);
        // }
    };

    const handleSpoiler = (quill) => {
        const range = quill.getSelection();
        if (range) {
            if (range.length) {
                // If some text is selected
                const isSpoiler = quill.getFormat(range).spoiler;
                quill.format("spoiler", !isSpoiler);
            }
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

        // Adding the EyeSlashIcon to the spoiler button
        // const spoilerButton = document.querySelector('.ql-spoiler');
        // if (spoilerButton) {
        //     ReactDOM.render(<EyeSlashIcon className="h-5 w-5" />, spoilerButton);
        // }
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

<div className={`review-character-count ${editorHtml.length > maxLength ? 'error-text' : ''}`}>
    {editorHtml.length} / {maxLength}
</div>

        </div>
    );
}
