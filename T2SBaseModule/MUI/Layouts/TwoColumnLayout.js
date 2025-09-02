import React, { Suspense, useContext } from 'react';
import { View } from 'react-native';
import Section from 't2sbasemodule/MUI/Section';
import Grid from 't2sbasemodule/MUI/Grid';
import { MyResponsiveContext } from 't2sbasemodule/Utils/helpers';
import { isLandscapeScreen, isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';
import Box from '../Box';
import Page from '../Page';

const DesktopLayout = (props) => {
    const { header, main, aside, top, bgColor = 'grey' } = props;
    return (
        <Page bgColor={bgColor} showFooter={isWeb()}>
            {header ? header() : null}
            <Section py={header ? 'none' : 'xl'} bgColor="transparent">
                <Grid>
                    <Grid.Column size={{ sm: 12, md: 12, lg: 7, xl: 8 }}>{main()}</Grid.Column>
                    <Grid.Column sticky={true} size={{ sm: 12, md: 12, lg: 5, xl: 4 }}>
                        <Box position="sticky" top={top + 32}>
                            {aside()}
                        </Box>
                    </Grid.Column>
                </Grid>
            </Section>
        </Page>
    );
};

const MobileLayout = (props) => {
    const { main, mobileFlatList = false } = props;
    return (
        <Section sectionHeight={true} bgColor="grey" pt={mobileFlatList ? 'none' : 'md'} pb={mobileFlatList ? 'none' : 'sm'}>
            <Grid>
                <Grid.Column size={12}>{main()}</Grid.Column>
            </Grid>
        </Section>
    );
};

const TwoColumnLayout = (props) => {
    const mode = useContext(MyResponsiveContext);
    const isDesktop = isLandscapeScreen(mode);

    return <Suspense fallback={<View>Loading...</View>}>{isDesktop ? <DesktopLayout {...props} /> : <MobileLayout {...props} />}</Suspense>;
};

export default TwoColumnLayout;
