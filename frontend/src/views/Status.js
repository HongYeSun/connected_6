import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import $L from '@enact/i18n/$L';
import css from './Main.module.less';
import {useCpu, useMem} from '../hooks/configs';
import {useEffect} from 'react';


const Status = () => {
	const [data1, setCpu] = useCpu({returnValue: false});
    const [data2, setMem] = useMem({returnValue: false});

    useEffect(() => {
        setCpu();
        setMem();
    }, []);
	return (
		<>
			<BodyText>{$L('This is a page for system status.')}</BodyText>
            <BodyText>{`Cpu status : ${JSON.stringify(data1)}`}</BodyText>
            <BodyText>{`Mem status : ${JSON.stringify(data2)}`}</BodyText>
			{ <Button onClick={() => {
                setCpu();
                setMem();
            }} size="small" className={css.buttonCell}>
				{$L('Refresh')}
			</Button> }
		</>
	);
};

export default Status;