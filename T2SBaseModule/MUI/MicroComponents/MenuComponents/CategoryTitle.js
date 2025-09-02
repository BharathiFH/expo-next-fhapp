import React, { useMemo } from 'react';
import { Pressable } from 'react-native';
import { isValidString } from 't2sbasemodule/Utils/helpers';
import { useTheme } from 't2sbasemodule/MUI/Utils/context';
import Heading from '../../Heading';
import Box from '../../Box';
const Category = (props) => {
    const { title, titleId, webID, id, isCollapsible, href, onPress, children, screenName, style } = props;
    const theme = useTheme();
    const componentProps = theme?.microComponents?.menuComponents?.category;
    const titleProps = componentProps?.titleProps;
    // Category Title
    const categoryTitle = useMemo(() => {
        return isValidString(title) ? (
            <Heading screenName={screenName} id={titleId} {...titleProps}>
                {title}
            </Heading>
        ) : null;
    }, [screenName, title, titleId, titleProps]);
    const renderTitle = useMemo(() => {
        return isCollapsible ? (
            <Pressable onPress={onPress} href={href}>
                {categoryTitle}
            </Pressable>
        ) : (
            categoryTitle
        );
    }, [categoryTitle, href, isCollapsible, onPress]);
    return (
        <Box webID={webID} id={id} screenName={screenName} style={style} mb="md">
            {renderTitle}
            {children}
        </Box>
    );
};
export default React.memo(Category);
