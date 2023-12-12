import BodyText from '@enact/sandstone/BodyText';
import Button from '@enact/sandstone/Button';
import Scroller from '@enact/sandstone/Scroller';
import $L from '@enact/i18n/$L';
import css from './Main.module.less';
import { useCpu, useMem, useConfigs } from '../hooks/configs';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Status = () => {
    const data = useConfigs();
    const [data_cpu, setCpu] = useCpu({ returnValue: false });
    const [data_mem, setMem] = useMem({ returnValue: false });
    const [parsedData, setParsedData] = useState({
        cur_vmallocSize: '',
        init_vmallocSize: '',
        swapUsed: '',
        usable_memory: '',
        user: '',
        system: '',
        nice: '',
        idle: ''
    });

    const renderTVInfo = () => (
        <div>
            <h2>TV Information</h2>
            {data && (
                <ul>
                    <li><strong>Model Name:</strong> {data.modelName}</li>
                    <li><strong>Firmware Version:</strong> {data.firmwareVersion}</li>
                    <li><strong>UHD:</strong> {data.UHD}</li>
                    <li><strong>SDK Version:</strong> {data.sdkVersion}</li>
                </ul>
            )}
        </div>
    );

    const setData = async () => {
        setCpu();
        setMem();
    }

    useEffect(() => {
        setData();
    }, []);

    useEffect(() => {
        if (data_cpu.returnValue) {
            const statArray = data_cpu.stat || [];
            console.log(statArray);
            const cpuLine= statArray.find(line => line.startsWith("cpu "));
            console.log(cpuLine);

            if(cpuLine) {
                const [, user, system, nice, idle] = cpuLine.split(/\s+/).map(Number);
                console.log(user+ " " +system+ " "+nice+" " +idle);
                setParsedData({
                    ...parsedData,
                    user: user,
                    system: system,
                    nice: nice,
                    idle: idle
                });
            }
            else {
                setParsedData({
                    ...parsedData,
                    user: "no cpu line",
                    system: "no cpu line",
                    nice: "no cpu line",
                    idle: "no cpu line"
                });
            }
        }
    }, [data_cpu]);

    useEffect(() => {
        if (data_mem.returnValue) {
            const vmallocInfo = data_mem.vmallocInfo || {};
            const curVmallocSize = vmallocInfo.cur_vmallocSize || 0;
            const initVmallocSize = vmallocInfo.init_vmallocSize || 0;
            const swapUsed = data_mem.swapUsed || 0;
            const usableMemory = data_mem.usable_memory || 0;

            setParsedData({
                ...parsedData,
                cur_vmallocSize: curVmallocSize,
                init_vmallocSize: initVmallocSize,
                swapUsed: swapUsed,
                usable_memory: usableMemory
            });
        }
    }, [data_mem]);

    const MemPieData = {
        labels: ['cur_vmallocSize', 'swapUsed', 'usable_memory'],
        datasets: [
          {
            label: 'CPU share',
            data: [parsedData.cur_vmallocSize, parsedData.swapUsed, parsedData.usable_memory],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
    }

    const CpuPieData = {
        labels: ['user', 'system', 'nice', 'idle'],
        datasets: [
          {
            label: 'CPU share',
            data: [parsedData.user, parsedData.system, parsedData.nice, parsedData.idle],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
    }

    return (
        <Scroller direction="vertical">
            <BodyText>{$L('This is a page for system status.')}</BodyText>
            {<Button onClick={setData} size="small" className={css.buttonCell}>
                {$L('Refresh')}
            </Button>}
            {/* <BodyText>{`Cpu status : ${JSON.stringify(data_cpu)}`}</BodyText> */}
            {/* <BodyText>{`Mem status: ${JSON.stringify(data_mem)}`}</BodyText> */}
            <div style={{
                position: "absolute",
                top: '150px',
                left: '0px',
                height: '600px',
                width: '700px'
            }}>
                <Pie data={MemPieData}/>
            </div>
            <div style={{
                position: "absolute",
                top: '150px',
                left: '700px',
                height: '600px',
                width: '700px'
            }}>
                <Pie data={CpuPieData}/>
            </div>
            <div style={{
                position: "absolute",
                top: '800px',
                left: '90px'
            }}>
                <BodyText>{`Mem_cur_vmallocSize: ${parsedData.cur_vmallocSize}`}</BodyText>
                <BodyText>{`Mem_init_vmallocSize: ${parsedData.init_vmallocSize}`}</BodyText>
                <BodyText>{`Mem_swapUsed: ${parsedData.swapUsed}`}</BodyText>
                <BodyText>{`Mem_usable_memory: ${parsedData.usable_memory}`}</BodyText>
            </div>
            <div style={{
                position: "absolute",
                top: '800px',
                left: '850px'
            }}>
                <BodyText>{`Cpu_user: ${parsedData.user}`}</BodyText>
                <BodyText>{`Cpu_system: ${parsedData.system}`}</BodyText>
                <BodyText>{`Cpu_nice: ${parsedData.nice}`}</BodyText>
                <BodyText>{`Cpu_idle: ${parsedData.idle}`}</BodyText>
            </div>
            <div style={{
                position: "absolute",
                top: '1100px',
                left: '100px',
                height: '600px',
                width: '700px'
            }}>
                {renderTVInfo()}
            </div>
        </Scroller>
    );
};

export default Status;