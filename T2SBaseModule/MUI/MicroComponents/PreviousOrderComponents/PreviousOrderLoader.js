import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors } from 't2sbasemodule/Themes';
import Grid from '../../Grid';
import Card from '../../Card';
import FlexBox from '../../FlexBox';
import Box from '../../Box';

const SkeletonCard = () => (
    <Card height={92} elevation={'sm'} bordered>
        <FlexBox>
            <FlexBox>
                <SkeletonPlaceholder backgroundColor={Colors.grey} highlightColor={Colors.white}>
                    <SkeletonPlaceholder.Item marginRight={16} borderRadius={8} width={60} height={60} />
                </SkeletonPlaceholder>
            </FlexBox>
            <FlexBox flex={1}>
                <SkeletonPlaceholder backgroundColor={Colors.grey} highlightColor={Colors.white}>
                    <SkeletonPlaceholder.Item width={170} height={22} />
                </SkeletonPlaceholder>
            </FlexBox>
            <Box>
                <SkeletonPlaceholder backgroundColor={Colors.grey} highlightColor={Colors.white}>
                    <SkeletonPlaceholder.Item marginLeft={'auto'} width={40} height={14} />
                    <SkeletonPlaceholder.Item marginTop={12} borderRadius={8} top={8} width={77} height={28} />
                </SkeletonPlaceholder>
            </Box>
        </FlexBox>
    </Card>
);

const PreviousOrderLoader = ({ isLandscapeMode }) => (
    <Grid containerPadding={0} gutter={8}>
        <Grid.Column size={{ sm: 12, md: 12, lg: 6, xl: 6 }}>
            <SkeletonCard />
        </Grid.Column>
        {isLandscapeMode && (
            <Grid.Column size={{ sm: 12, md: 12, lg: 6, xl: 6 }}>
                <SkeletonCard />
            </Grid.Column>
        )}
    </Grid>
);

export default PreviousOrderLoader;
