const icon25 = { iconSize: 25 };
export const ratingIconStyle = icon25;
export const infoIconStyle = icon25;
export const distanceIconStyle = icon25;
export const deliveryIconStyle = icon25;
export const collectionIconStyle = icon25;
export const basketIconStyle = { size: 20 };
export const itemWrapper = (data) => `(${data})`;
const preventTouchMove = function (e) {
    e.preventDefault();
};
export const bodyScroll = (scroll, isIOSTouchBlock = false) => {
    document.body.style.setProperty('overflow', scroll, 'important');
    if (isIOSTouchBlock) {
        if (scroll === 'hidden') {
            document.addEventListener('touchmove', preventTouchMove, {
                passive: false
            });
        } else {
            document.removeEventListener('touchmove', preventTouchMove, {
                passive: true
            });
        }
    }
};
export const bodyScrollY = (scroll) => {
    document.body.style.setProperty('overflow-y', scroll, 'important');
};
export const modalStyle = 'transparentModal';
export const outlineStyles = {
    outlineStyle: 'none',
    borderBottomColor: 'transparent'
};
export const theme = {
    containerWidth: 1540,
    spacing: [0, 4, 8, 16, 32, 48, 64],
    borderRadius: [0, 4, 8, 12, 18, 20]
};
