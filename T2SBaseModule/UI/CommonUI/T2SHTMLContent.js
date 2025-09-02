import React from 'react';
import HTMLView from 'react-native-htmlview';

const T2SHtmlContent = (props) => {
    const { styles, content } = props || {};

    return <HTMLView stylesheet={styles} value={content} />;
};

export default T2SHtmlContent;
