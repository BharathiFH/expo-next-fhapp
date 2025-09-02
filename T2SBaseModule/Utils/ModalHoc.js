import React, { useEffect, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from 't2sbasemodule/Themes';
import { mergeWebTabletMobileStyle, MyResponsiveContext } from 't2sbasemodule/Utils/helpers';
import { bodyScroll } from 't2sbasemodule/Utils/StyleHelper';
import { isLandscapeScreen } from '../../AppModules/BaseModule/GlobalAppHelper';

const modalHoc = (Component, onlyWeb = true) => {
    return (props) => {
        const context = useContext(MyResponsiveContext);
        const smallScreenSize = context.isSmallScreenMode || context.isTabletPortraitMode;
        const isLandscape = isLandscapeScreen(context);
        const { navigation } = props;

        useEffect(() => {
            isLandscape &&
                navigation?.setOptions({
                    presentation: 'transparentModal'
                });
        }, [isLandscape, navigation]);
        useEffect(() => {
            !smallScreenSize && bodyScroll('hidden');
            return () => {
                bodyScroll('');
            };
            //eslint-disable-next-line
        }, []);
        if (isLandscape && onlyWeb) {
            return (
                <View style={style.container}>
                    <Component {...props} />
                    <View style={style.backDrop} />
                </View>
            );
        }
        return (
            <View style={style.nonModalContainer}>
                <Component {...props} />
            </View>
        );
    };
};

const mobileStyle = {
    nonModalContainer: {
        flex: 1
        //  backgroundColor: Colors.white //will affect places where modal needs transparent background
    },
    container: {
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backDrop: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
};

const tabStyle = {
    container: {
        height: '100%',
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

const webStyle = {
    container: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.overlay,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

const style = StyleSheet.create(mergeWebTabletMobileStyle(mobileStyle, tabStyle, webStyle));

export default modalHoc;
