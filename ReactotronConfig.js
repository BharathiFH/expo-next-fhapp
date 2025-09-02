let Reactotron;
let sagaMonitor = null;

if (__DEV__) {
    const reactotron = require('reactotron-react-native').default;
    const { reactotronRedux } = require('reactotron-redux');
    const sagaPlugin = require('reactotron-redux-saga');

    Reactotron = reactotron.configure().use(sagaPlugin()).use(reactotronRedux()).useReactNative().connect();

    sagaMonitor = Reactotron.createSagaMonitor?.();
}

export default Reactotron;
export { sagaMonitor };
