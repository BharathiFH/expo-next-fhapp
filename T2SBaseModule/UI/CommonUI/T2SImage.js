import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import { setTestId } from '../../Utils/AutomationHelper';
import PropTypes from 'prop-types';
import { isWeb } from 'appmodules/BaseModule/GlobalAppHelper';

export const LOADING_TYPE = {
    LAZY: 'lazy'
};

const WebLazyImage = ({ src, style, testIdProps, ...props }) => {
    const imgRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let observer;
        if (imgRef.current && !isVisible) {
            observer = new window.IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                },
                {
                    root: null,
                    rootMargin: '0px',
                    threshold: 0
                }
            );
            observer.observe(imgRef.current);
        }
        return () => observer && observer.disconnect();
    }, [isVisible]);
    return (
        <img
            ref={imgRef}
            src={isVisible ? src : undefined}
            data-src={src}
            style={style}
            loading={LOADING_TYPE.LAZY}
            {...testIdProps}
            {...props}
        />
    );
};

const T2SImage = ({ screenName, id, webID, style, resizeMode, source, loading, ...props }) => {
    const testIdProps = setTestId(screenName, id, webID);
    if (isWeb() && loading === LOADING_TYPE.LAZY) {
        const src = typeof source === 'string' ? source : source?.uri || '';
        return <WebLazyImage src={src} style={style} testIdProps={testIdProps} {...props} />;
    }
    return <Image style={style} resizeMode={resizeMode} source={source} {...testIdProps} {...props} />;
};

T2SImage.propTypes = {
    screenName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

T2SImage.defaultProps = {
    screenName: '',
    id: '',
    style: {},
    source: {},
    resizeMode: 'cover'
};

export default T2SImage;
