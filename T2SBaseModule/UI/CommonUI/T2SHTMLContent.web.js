import React from 'react';

const T2SHtmlContent = (props) => {
    const { content, isExpanded, isTruncated } = props || {};

    return (
        <div
            id="html_content"
            className={`dm_content ${isTruncated ? (isExpanded ? 'expanded' : 'collapsed') : ''}`}
            dangerouslySetInnerHTML={{
                __html: content
            }}
        />
    );
};

export default T2SHtmlContent;
