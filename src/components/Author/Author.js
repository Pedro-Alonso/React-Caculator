import React from "react";
import "./Author.css";

const Author = props => {
    return (
        <div id="author" className="author">
            <p>Made with{" "}by</p>
            <a href={props.github} target="_blank" rel="noopener noreferrer">
                {props.name}
            </a>
        </div>
    );
}

export default Author;