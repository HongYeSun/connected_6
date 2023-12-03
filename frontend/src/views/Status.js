import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Scroller from '@enact/sandstone/Scroller';
import $L from '@enact/i18n/$L';
import css from './Main.module.less';
import { useCpu, useMem } from '../hooks/configs';
import { useState, useEffect } from 'react';

const Status = () => {
    const [data_cpu, setCpu] = useCpu({ returnValue: false });
    const [data_mem, setMem] = useMem({ returnValue: false });
    const [parsedData, setParsedData] = useState({
        level: '',
        available: '',
        total: '',
        idle: '',
        irq: '',
        user: '',
        system: ''
    });

    const setData = async () => {
        setCpu();
        setMem();
    }

    useEffect(() => {
        setData();
    }, []);

    useEffect(() => {
        if (data_cpu.returnValue) {
            for (let [id, CPU] of Object.entries(data_cpu.dataArray)) {
                if (CPU.cpu.cpu == "cpu-total") {
                    setParsedData({
                        ...parsedData,
                        idle: CPU.cpu.data.usage_idle,
                        irq: CPU.cpu.data.usage_softirq,
                        user: CPU.cpu.data.usage_user,
                        system: CPU.cpu.data.usage_system
                    });
                }
            }
        }
    }, [data_cpu]);

    useEffect(() => {
        if (data_mem.returnValue) {
            setParsedData({
                ...parsedData,
                level: data_mem.system.level,
                available: data_mem.system.available,
                total: data_mem.system.total
            });
        }
    }, [data_mem]);

    return (
        <Scroller direction="verticle">
            <BodyText>{$L('This is a page for system status.')}</BodyText>
            {/* <BodyText>{`Cpu status : ${JSON.stringify(data_cpu)}`}</BodyText> */}
            <BodyText>{`Mem status: ${JSON.stringify(data_mem)}`}</BodyText>
            <BodyText>{`Mem_level: ${parsedData.level}`}</BodyText>
            <BodyText>{`Mem_available: ${parsedData.available}`}</BodyText>
            <BodyText>{`Mem_total: ${parsedData.total}`}</BodyText>
            <BodyText>{`Cpu_idle: ${parsedData.idle}`}</BodyText>
            <BodyText>{`Cpu_irq: ${parsedData.irq}`}</BodyText>
            <BodyText>{`Cpu_user: ${parsedData.user}`}</BodyText>
            <BodyText>{`Cpu_system: ${parsedData.system}`}</BodyText>
            {<Button onClick={setData} size="small" className={css.buttonCell}>
                {$L('Refresh')}
            </Button>}
        </Scroller>
    );
};

export default Status;