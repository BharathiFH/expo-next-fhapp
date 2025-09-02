import React, { Suspense, useContext } from 'react';
import { View } from 'react-native';
import Section from 't2sbasemodule/MUI/Section';
import Grid from 't2sbasemodule/MUI/Grid';
import { MyResponsiveContext } from 't2sbasemodule/Utils/helpers';
import { isLandscapeScreen, isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';
import Box from '../Box';
import Page from '../Page';

const isWebDevice = isWeb();

const DesktopLayout = (props) => {
    const { main, aside, top, showMain, showFooter = true } = props;
    return (
        <Page bgColor="grey" showFooter={isWebDevice && showFooter}>
            <Section py="xl" bgColor="transparent">
                <Grid justifyContent={'center'}>
                    {showMain ? <Grid.Column size={{ sm: 12, md: 12, lg: 7, xl: 8 }}>{main}</Grid.Column> : null}
                    <Grid.Column sticky={true} size={{ sm: 12, md: 12, lg: 5, xl: 4 }}>
                        <Box position="sticky" top={top}>
                            {aside}
                        </Box>
                    </Grid.Column>
                </Grid>
            </Section>
        </Page>
    );
};

const MobileLayout = (props) => {
    const { main } = props;
    return (
        <Section fullHeight={true} bgColor="grey" pt="md" pb="sm">
            <Grid>
                <Grid.Column size={12}>{main}</Grid.Column>
            </Grid>
        </Section>
    );
};

const BasketLayout = (props) => {
    const mode = useContext(MyResponsiveContext);
    const isDesktop = isLandscapeScreen(mode);

    return <Suspense fallback={<View>Loading...</View>}>{isDesktop ? <DesktopLayout {...props} /> : <MobileLayout {...props} />}</Suspense>;
};

export default BasketLayout;
