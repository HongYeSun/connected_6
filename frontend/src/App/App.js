import { useState } from 'react';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Panels from '@enact/sandstone/Panels';
import Main from '../views/Main';
import RegisterPage from '../views/RegisterPage';   
import ProfileSelectPage from '../views/ProfileSelectPage'; 
import LoginPage from '../views/LoginPage'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { useBackHandler, useCloseHandler, useDocumentEvent } from './AppState';
import { isDevServe } from '../libs/utils';

if (isDevServe()) {
    window.webOSSystem = {
        highContrast: 'off',
        close: () => {},
        platformBack: () => {},
        PmLogString: () => {},
        screenOrientation: 'landscape',
        setWindowOrientation: () => {}
    };
}

const App = props => {
    const [skinVariants, setSkinVariants] = useState({ highContrast: false });
    const handleBack = useBackHandler();
    const handleClose = useCloseHandler();
    useDocumentEvent(setSkinVariants);

    return (
            <Router>
                <Routes>
                    <Route path="/" element={<RegisterPage />} />
                    <Route path="/profile-select" element={<ProfileSelectPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/main" element={
                        <Panels skinVariants={skinVariants} onBack={handleBack} onClose={handleClose}>
                        	<Main />
                    	</Panels>
                    } />
                </Routes>
            </Router>
    );
};

export default ThemeDecorator(App);
