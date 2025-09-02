import React, { Component } from 'react';
import { View } from 'react-native';
// Redux
import { connect } from 'react-redux';
// Util
import { handleReDirectToStoreReview, isCustomerApp, isForceUpdateAvailable, isOptionalUpdateAvailable } from '../../Utils/helpers';
import T2SModal from '../../UI/CommonUI/T2SModal';
import { APP_UPDATE_CONSTANTS } from './Utils/AppUpdateConstants';
import { isWeb } from '../../../AppModules/BaseModule/GlobalAppHelper';

const isCustomer = isCustomerApp();
class AppUpdateManager extends Component {
    constructor(props) {
        super(props);
        this.redirectToStore = this.redirectToStore.bind(this);
        this.dismissModal = this.dismissModal.bind(this);
        this.state = {
            showForceUpdateModal: false,
            showOptionalUpdateModal: false,
            optionalUpdateDismissed: false
        };
    }

    componentDidMount() {
        if (!isWeb()) {
            this.shouldShowForceOrOptionUpdateModal();
        }
    }

    shouldShowForceOrOptionUpdateModal() {
        const { forcedVersionNumber, optionalVersionNumber } = this.props;
        const { showForceUpdateModal, optionalUpdateDismissed, showOptionalUpdateModal } = this.state;
        if (isForceUpdateAvailable(forcedVersionNumber, showForceUpdateModal)) {
            this.setState({
                showForceUpdateModal: true
            });
        } else if (
            isOptionalUpdateAvailable(optionalVersionNumber, optionalUpdateDismissed, showOptionalUpdateModal, showForceUpdateModal)
        ) {
            this.setState({
                showOptionalUpdateModal: true
            });
        }
    }

    redirectToStore(updateType) {
        const { storeIOSlink, storeAndroidLink, profileResponse, countryIso, storeIOSFranchiseLink, storeAndroidFranchiseLink } =
            this.props;
        if (updateType === APP_UPDATE_CONSTANTS.updateType.OPTIONAL) {
            this.dismissModal();
        }
        handleReDirectToStoreReview(
            profileResponse,
            null,
            isCustomer ? storeIOSlink : storeIOSFranchiseLink,
            isCustomer ? storeAndroidLink : storeAndroidFranchiseLink,
            countryIso,
            false
        );
    }

    dismissModal() {
        this.setState({
            showOptionalUpdateModal: false,
            optionalUpdateDismissed: true
        });
    }

    render() {
        return (
            <View>
                <T2SModal
                    title={APP_UPDATE_CONSTANTS.ModalButtons.UPDATE}
                    isVisible={this.state.showOptionalUpdateModal}
                    description={APP_UPDATE_CONSTANTS.updateType.optionalUpdate}
                    positiveButtonText={APP_UPDATE_CONSTANTS.ModalButtons.OK}
                    positiveButtonClicked={this.redirectToStore.bind(this, APP_UPDATE_CONSTANTS.updateType.OPTIONAL)}
                    negativeButtonText={APP_UPDATE_CONSTANTS.ModalButtons.CANCEL}
                    negativeButtonClicked={this.dismissModal}
                    requestClose={this.dismissModal}
                />
                <T2SModal
                    title={APP_UPDATE_CONSTANTS.ModalButtons.UPDATE}
                    isVisible={this.state.showForceUpdateModal}
                    description={APP_UPDATE_CONSTANTS.updateType.forceUpdateApp}
                    positiveButtonText={APP_UPDATE_CONSTANTS.ModalButtons.OK}
                    positiveButtonClicked={this.redirectToStore.bind(this, APP_UPDATE_CONSTANTS.updateType.Forced)}
                    requestClose={() => {}}
                    dialogCancelable={false}
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    forcedVersionNumber: state.updateState?.forcedVersionNumber,
    optionalVersionNumber: state.updateState?.optionalVersionNumber,
    storeIOSlink: state.appState.storeConfigResponse?.ios_link,
    storeAndroidLink: state.appState.storeConfigResponse?.android_link,
    profileResponse: state.profileState.profileResponse,
    countryIso: state.appState.s3ConfigResponse?.country?.iso,
    storeIOSFranchiseLink: state.appState.s3ConfigResponse?.config?.links?.app_store?.ios,
    storeAndroidFranchiseLink: state.appState.s3ConfigResponse?.config?.links?.app_store?.android
});

export default connect(mapStateToProps)(AppUpdateManager);
