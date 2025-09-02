import { useContext } from 'react';
import { MyResponsiveContext } from '../../../Utils/helpers';

export default function useResponsiveStyle(styleModel) {
    const mode = useContext(MyResponsiveContext);
    return styleModel.setViewMode(mode);
}
