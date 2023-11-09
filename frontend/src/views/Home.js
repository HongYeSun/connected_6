import Alert from '@enact/sandstone/Alert';
import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import css from './Main.module.less';
import $L from '@enact/i18n/$L';
import {useConfigs} from '../hooks/configs';
import {usePopup} from './HomeState';

const Home = () => {
	const data = useConfigs();
	const {isPopupOpen, handlePopupOpen, handlePopupClose} = usePopup();
	return (
		<>
			<BodyText>{$L('This is a main page of sample application.')}</BodyText>
			<BodyText>{`TV Info : ${JSON.stringify(data)}`}</BodyText>
			<Button onClick={handlePopupOpen} size="small" className={css.buttonCell}>
				{$L('This is a main page of sample application.')}
			</Button>
			<Alert type="overlay" open={isPopupOpen} onClose={handlePopupClose}>
				<span>{$L('This is an alert message.')}</span>
				<buttons>
					<Button
						size="small"
						className={css.buttonCell}
						onClick={handlePopupClose}
					>
						{$L('OK')}
					</Button>
				</buttons>
			</Alert>
		</>
	);
};

export default Home;
